#!/usr/bin/env python3
"""Render the image cards of a video for 小绿书 and LinkedIn.

    .venv/bin/python <skill>/scripts/render_cards.py <name> <CompositionId> [--langs zh,en]

Writes, under videos/<name>/cards/:
    <lang>-3x4/01.png ...   1080x1440, for 小绿书 (WeChat image posts) and similar feeds
    <lang>-4x5/01.png ...   1080x1350, for LinkedIn multi-image posts
    linkedin-<lang>.pdf     the 4x5 set as one document, for a LinkedIn carousel

Run from the video project root. Needs Pillow for the PDF.
"""
import argparse
import glob
import os
import shutil
import subprocess
import sys

SIZES = {"3x4": (1080, 1440), "4x5": (1080, 1350)}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("name", help="video name, e.g. gpu-sharing-benchmarks")
    ap.add_argument("id", help="composition id, e.g. GpuSharingBenchmarks")
    ap.add_argument("--langs", default="zh,en")
    a = ap.parse_args()
    from PIL import Image

    root = os.path.join("videos", a.name, "cards")
    counts = set()
    for lang in a.langs.split(","):
        for ratio, size in SIZES.items():
            out = os.path.join(root, f"{lang}-{ratio}")
            tmp = out + "_tmp"  # Remotion rejects a sequence folder that looks like it has an extension
            shutil.rmtree(tmp, ignore_errors=True)
            props = '{"lang":"%s","ratio":"%s"}' % (lang, ratio)
            cmd = ["npx", "remotion", "render", "src/remotion/index.ts", f"{a.id}-Cards", tmp]
            cmd += ["--sequence", "--image-format=png", f"--props={props}", "--log=error"]
            res = subprocess.run(cmd, capture_output=True, text=True)
            frames = sorted(glob.glob(os.path.join(tmp, "*.png")))
            if res.returncode != 0 or not frames:
                sys.exit(f"Rendering {lang} {ratio} failed:\n{res.stdout[-1500:]}\n{res.stderr[-1500:]}")
            shutil.rmtree(out, ignore_errors=True)
            os.makedirs(out)
            pages = []
            for i, f in enumerate(frames, 1):
                dest = os.path.join(out, f"{i:02d}.png")
                shutil.move(f, dest)
                with Image.open(dest) as im:
                    if im.size != size:
                        sys.exit(f"{dest} is {im.size}, expected {size}")
                    pages.append(im.convert("RGB"))
            shutil.rmtree(tmp, ignore_errors=True)
            counts.add(len(pages))
            print(f"{out}: {len(pages)} cards at {size[0]}x{size[1]}")
            if ratio == "4x5":
                pdf = os.path.join(root, f"linkedin-{lang}.pdf")
                pages[0].save(pdf, save_all=True, append_images=pages[1:], resolution=144)
                print(f"{pdf}: {len(pages)} pages, {os.path.getsize(pdf) / 1e6:.1f} MB")
    if len(counts) != 1:
        sys.exit(f"Card counts differ between sets: {sorted(counts)}")
    print("Look at every card before publishing: text fit is not checked here.")


if __name__ == "__main__":
    main()
