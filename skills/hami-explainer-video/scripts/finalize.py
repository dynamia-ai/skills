#!/usr/bin/env python3
"""Turn the 4K render into the publishable file and check it.

    python3 <skill>/scripts/finalize.py videos/<name>/<lang> [--bgm track.mp3] [--bgm-volume 0.1]

Reads  <dir>/output.mp4 (the Remotion render: picture + narration)
Writes <dir>/final_video.mp4

Narration is raised to about -20.5 dB mean with a limiter (TTS output is quiet
and varies by voice). Background music is mixed in only when a track is given
with --bgm or exists as bgm.mp3 in <dir> or in videos/<name>/. The skill ships no music: use a
track the HAMi community is licensed to publish.

Exit code 1 means the file is not publishable; the reason is printed.
"""
import argparse
import json
import os
import re
import subprocess
import sys


def probe(path, entries, stream="v:0"):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", stream, "-show_entries", entries, "-of", "csv=p=0", path],
        capture_output=True,
        text=True,
    ).stdout.strip()
    return out


def loudness(path):
    err = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path, "-vn", "-af", "volumedetect", "-f", "null", "-"],
        capture_output=True,
        text=True,
    ).stderr
    mean = re.search(r"mean_volume: (-?[\d.]+) dB", err)
    peak = re.search(r"max_volume: (-?[\d.]+) dB", err)
    if not mean or not peak:
        sys.exit(f"Could not measure loudness of {path}")
    return float(mean.group(1)), float(peak.group(1))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dir")
    ap.add_argument("--bgm", default=None, help="background music file (default: <dir>/bgm.mp3 if present)")
    ap.add_argument("--bgm-volume", type=float, default=0.1)
    ap.add_argument("--target", type=float, default=-20.5, help="narration mean volume in dB")
    a = ap.parse_args()
    d = a.dir
    src, dst = os.path.join(d, "output.mp4"), os.path.join(d, "final_video.mp4")
    if not os.path.exists(src):
        sys.exit(f"{src} not found: render the composition first.")
    # A track next to this language folder, or one level up, shared by all languages.
    found = [p for p in (os.path.join(d, "bgm.mp3"), os.path.join(d, "..", "bgm.mp3")) if os.path.exists(p)]
    bgm = a.bgm or (os.path.normpath(found[0]) if found else None)

    mean, _ = loudness(src)
    gain = max(0.0, min(a.target - mean, 14.0))
    voice = f"[0:a]volume={gain:.1f}dB,alimiter=limit=0.84:level=disabled[v]"
    if bgm:
        graph = f"{voice};[1:a]volume={a.bgm_volume}[m];[v][m]amix=inputs=2:duration=first:normalize=0[out]"
        inputs = ["-i", src, "-stream_loop", "-1", "-i", bgm]
    else:
        graph = f"{voice};[v]anull[out]"
        inputs = ["-i", src]
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", graph, "-map", "0:v", "-map", "[out]"]
        + ["-c:v", "copy", "-c:a", "aac", "-b:a", "192k", dst],
        check=True,
    )

    problems = []
    size = probe(dst, "stream=width,height")
    if size != "3840,2160":
        problems.append(f"resolution is {size}, expected 3840,2160 (was it rendered with --scale?)")
    duration = float(probe(dst, "format=duration", "a:0") or 0)
    timing = json.load(open(os.path.join(d, "timing.json"), encoding="utf-8"))
    if abs(duration - timing["total_duration"]) > 0.5:
        problems.append(f"duration {duration:.1f}s does not match narration {timing['total_duration']:.1f}s")
    out_mean, out_peak = loudness(dst)
    if out_peak > -0.5:
        problems.append(f"peak {out_peak} dB: likely clipping")
    if not -23.5 <= out_mean <= -18:
        problems.append(f"mean volume {out_mean} dB is outside -23.5..-18")

    print(f"final_video.mp4  {size.replace(',', 'x')}  {duration:.1f}s  {os.path.getsize(dst) / 1e6:.0f} MB")
    print(f"loudness  mean {out_mean} dB, peak {out_peak} dB  (narration gain +{gain:.1f} dB)")
    print(f"music     {bgm if bgm else 'none'}")
    if problems:
        print("NOT PUBLISHABLE:\n  - " + "\n  - ".join(problems))
        sys.exit(1)
    print("OK. Loudness is measured, not listened to: have a person play it before publishing.")


if __name__ == "__main__":
    main()
