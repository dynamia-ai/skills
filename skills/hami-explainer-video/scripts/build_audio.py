#!/usr/bin/env python3
"""Synthesize narration for one language of a HAMi explainer video.

Reads   <dir>/podcast.txt      [SECTION:name] blocks of narration, with {marker} tags
Writes  <dir>/podcast_audio.wav   48 kHz mono narration
        <dir>/podcast_audio.srt   phrase-level subtitles
        <dir>/cues.json           the same subtitles as [{start, end, text, section}]
        <dir>/marks.json          {marker: seconds}; scenes animate against these
        <dir>/timing.json         language and section start frames; drives the scene cuts

<dir> is videos/<name>/<lang>, e.g. videos/gpu-sharing-benchmarks/en. Run from the
video project root so ./.env is found:

    .venv/bin/python <skill>/scripts/build_audio.py videos/<name>/zh

A {marker} tag is never spoken. Its time is the moment the next word starts, so
`{crash}The assistant crashes` lets a scene do something exactly on "The". Scenes
refer to markers by name, which is why one composition works for every language,
voice and re-recording: only this script has to be run again.

Azure reads AZURE_SPEECH_KEY and AZURE_SPEECH_REGION from the environment or ./.env.
Optional <dir>/subtitle_replacements.json maps spoken text to displayed text,
e.g. {"哈密": "HAMi"}: the narration says the key, the subtitle shows the value.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import wave

FPS = 30
SECTION_GAP = 0.45  # seconds of silence between sections (azure)
MARKER = re.compile(r"\{([a-z0-9][a-z0-9-]*)\}")
LANG = {
    "zh": {
        "voice": "zh-CN-Xiaochen:DragonHDLatestNeural",
        "max_chars": 20,  # soft limit per subtitle line
        "hard": "。？！；",
        "soft": "，、：",
    },
    "en": {
        "voice": "en-US-Ava:DragonHDLatestNeural",
        "max_chars": 64,
        "hard": ".?!;",
        "soft": ",:",
    },
}
EDGE_VOICE = {"zh": "zh-CN-XiaoxiaoNeural", "en": "en-US-AvaNeural"}


def detect_lang(text):
    cjk = len(re.findall(r"[\u4e00-\u9fff]", text))
    return "zh" if cjk > len(text) * 0.2 else "en"


def parse_sections(raw, lang):
    """Returns [(name, clean_text, [(marker, char_index)])]."""
    out, seen = [], set()
    for m in re.finditer(r"\[SECTION:(\w+)\]\s*(.*?)(?=\[SECTION:|\Z)", raw, re.S):
        body = re.sub(r"\s*\n\s*", "" if lang == "zh" else " ", m.group(2).strip())
        clean, marks, last = "", [], 0
        for mk in MARKER.finditer(body):
            clean += body[last : mk.start()]
            last = mk.end()
            if mk.group(1) in seen:
                sys.exit(f"Marker {{{mk.group(1)}}} is used twice; marker names must be unique.")
            seen.add(mk.group(1))
            marks.append((mk.group(1), len(clean)))
        clean += body[last:]
        if lang == "en":  # a tag between two words leaves a double space behind
            fixed, shift = "", []
            for ch in clean:
                if ch == " " and fixed.endswith(" "):
                    shift.append(len(fixed))
                    continue
                fixed += ch
            marks = [(n, i - sum(1 for s in shift if s < i)) for n, i in marks]
            clean = fixed
        stray = re.search(r"[{}]", clean)
        if stray:
            sys.exit(f"Malformed marker near: {clean[max(0, stray.start() - 20) : stray.start() + 20]!r}")
        if clean.strip():
            out.append((m.group(1), clean, marks))
    return out


def split_phrases(text, cfg, lang):
    """Split at punctuation, then merge short neighbours up to max_chars."""
    pieces, buf = [], ""
    for i, ch in enumerate(text):
        buf += ch
        if ch in cfg["hard"] + cfg["soft"]:
            # In English a dot or comma inside a number or abbreviation is not a break.
            if lang == "en" and i + 1 < len(text) and text[i + 1] != " ":
                continue
            pieces.append(buf)
            buf = ""
    if buf:
        pieces.append(buf)
    cues, cur = [], ""
    for p in pieces:
        if cur and (len(cur) + len(p) > cfg["max_chars"] or cur.rstrip()[-1] in cfg["hard"]):
            cues.append(cur)
            cur = ""
        cur += p
    if cur:
        cues.append(cur)
    return cues


def display(text, repl, lang):
    for k, v in repl.items():
        text = text.replace(k, v)
    if lang == "en":
        return re.sub(r"\s+", " ", text).strip().rstrip(",:;")
    text = text.rstrip("。？！；，、：")
    text = re.sub(r"[，、：；。]", " ", text)
    text = re.sub(r"([\u4e00-\u9fff])([A-Za-z0-9])", r"\1 \2", text)
    text = re.sub(r"([A-Za-z0-9%])([\u4e00-\u9fff])", r"\1 \2", text)
    return re.sub(r"\s+", " ", text).strip()


def ts(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def load_env():
    env = dict(os.environ)
    if os.path.exists(".env"):
        for line in open(".env", encoding="utf-8"):
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.strip().split("=", 1)
                env.setdefault(k, v)
    return env


def synth_azure(bodies, voice, wav):
    """One request per section. Returns per-section word lists [(text, start, end)] and offsets."""
    import azure.cognitiveservices.speech as sdk

    env = load_env()
    if not env.get("AZURE_SPEECH_KEY") or not env.get("AZURE_SPEECH_REGION"):
        sys.exit("AZURE_SPEECH_KEY / AZURE_SPEECH_REGION not set (environment or ./.env).")
    cfg = sdk.SpeechConfig(subscription=env["AZURE_SPEECH_KEY"], region=env["AZURE_SPEECH_REGION"])
    cfg.speech_synthesis_voice_name = voice
    cfg.set_speech_synthesis_output_format(sdk.SpeechSynthesisOutputFormat.Riff48Khz16BitMonoPcm)
    words, pcm, offset = [], bytearray(), 0.0
    for i, body in enumerate(bodies):
        got = []
        syn = sdk.SpeechSynthesizer(speech_config=cfg, audio_config=None)
        syn.synthesis_word_boundary.connect(
            lambda e: got.append(
                (e.text, e.audio_offset / 1e7, e.duration.total_seconds(), str(e.boundary_type))
            )
        )
        res = syn.speak_text_async(body).get()
        if res.reason != sdk.ResultReason.SynthesizingAudioCompleted:
            detail = getattr(res.cancellation_details, "error_details", "")
            sys.exit(f"Azure synthesis failed on section {i + 1}: {res.reason} {detail}")
        data = res.audio_data[44:]  # strip the RIFF header
        words.append([(t, offset + off, offset + off + dur) for t, off, dur, kind in got if "Word" in kind])
        pcm += data
        offset += len(data) / 96000
        if i < len(bodies) - 1:
            pcm += b"\x00" * (int(SECTION_GAP * 48000) * 2)
            offset += SECTION_GAP
        print(f"  section {i + 1}/{len(bodies)}: {len(body)} chars")
    with wave.open(wav, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(48000)
        w.writeframes(bytes(pcm))
    return words


def synth_edge(bodies, voice, rate, wav):
    """Fallback: one request for the whole text, so section pauses are whatever the voice does."""
    import asyncio

    import edge_tts

    mp3 = wav[:-4] + ".mp3"
    flat = []

    async def run():
        com = edge_tts.Communicate(" ".join(bodies), voice=voice, rate=rate, boundary="WordBoundary")
        with open(mp3, "wb") as f:
            async for ev in com.stream():
                if ev["type"] == "audio":
                    f.write(ev["data"])
                elif ev["type"] == "WordBoundary":
                    flat.append((ev["text"], ev["offset"] / 1e7, (ev["offset"] + ev["duration"]) / 1e7))

    asyncio.run(run())
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-ar", "48000", "-ac", "1", wav],
        check=True,
    )
    os.remove(mp3)
    # Hand the flat word list to sections in order, by matching text.
    words, k = [], 0
    for body in bodies:
        mine, cursor = [], 0
        while k < len(flat):
            i = body.find(flat[k][0], cursor)
            if i < 0 or i - cursor > 12:
                break
            mine.append(flat[k])
            cursor = i + len(flat[k][0])
            k += 1
        words.append(mine)
    return words


def align(body, words):
    """Map each spoken word to its character span in the section text."""
    spans, cursor, missed = [], 0, []
    for text, start, end in words:
        i = body.find(text, cursor)
        if i < 0 or i - cursor > 16:
            missed.append(text)
            continue
        spans.append((i, i + len(text), start, end))
        cursor = i + len(text)
    return spans, missed


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dir", help="language folder of a video, e.g. videos/gpu-sharing-benchmarks/zh")
    ap.add_argument("--lang", choices=sorted(LANG), default=None, help="default: detected from the script")
    ap.add_argument("--backend", default="azure", choices=["azure", "edge"])
    ap.add_argument("--voice", default=None, help="voice name; default depends on language and backend")
    ap.add_argument("--rate", default="+5%", help="speech rate, edge backend only")
    a = ap.parse_args()
    d = a.dir

    raw = open(os.path.join(d, "podcast.txt"), encoding="utf-8").read()
    lang = a.lang or detect_lang(MARKER.sub("", raw))
    cfg = LANG[lang]
    voice = a.voice or (cfg["voice"] if a.backend == "azure" else EDGE_VOICE[lang])
    sections = parse_sections(raw, lang)
    if not sections:
        sys.exit("No [SECTION:name] blocks with text found in podcast.txt")
    rp = os.path.join(d, "subtitle_replacements.json")
    repl = json.load(open(rp, encoding="utf-8")) if os.path.exists(rp) else {}

    wav = os.path.join(d, "podcast_audio.wav")
    bodies = [body for _, body, _ in sections]
    if a.backend == "azure":
        words = synth_azure(bodies, voice, wav)
    else:
        words = synth_edge(bodies, voice, a.rate, wav)
    with wave.open(wav, "rb") as w:
        total = w.getnframes() / w.getframerate()

    cues, marks, starts, problems = [], {}, [], []
    for (name, body, tags), sec_words in zip(sections, words):
        spans, missed = align(body, sec_words)
        if not spans:
            sys.exit(f"Could not time section '{name}': no spoken words matched its text.")
        if missed:
            problems.append(f"section '{name}': {len(missed)} spoken tokens not matched: {missed[:6]}")
        starts.append(spans[0][2])

        def window(lo, hi):
            hit = [s for s in spans if s[0] < hi and s[1] > lo]
            return (hit[0][2], hit[-1][3]) if hit else None

        p = 0
        for phrase in split_phrases(body, cfg, lang):
            t = window(p, p + len(phrase))
            if t:
                cues.append([t[0], t[1], display(phrase, repl, lang), name])
            elif phrase.strip():
                problems.append(f"no subtitle timing for: {phrase.strip()!r}")
            p += len(phrase)
        for tag, pos in tags:
            after = [s for s in spans if s[1] > pos]
            if not after:
                problems.append(f"{{{tag}}} is at the very end of section '{name}': put it before a word")
            marks[tag] = round(after[0][2] if after else spans[-1][3], 3)

    for i, c in enumerate(cues):
        nxt = cues[i + 1][0] if i + 1 < len(cues) else total
        c[1] = min(max(c[1] + 0.25, c[0] + 0.8), nxt - 0.04)

    with open(os.path.join(d, "podcast_audio.srt"), "w", encoding="utf-8") as f:
        for i, (s, e, text, _) in enumerate(cues, 1):
            f.write(f"{i}\n{ts(s)} --> {ts(e)}\n{text}\n\n")
    json.dump(
        [{"start": round(s, 3), "end": round(e, 3), "text": t, "section": n} for s, e, t, n in cues],
        open(os.path.join(d, "cues.json"), "w", encoding="utf-8"),
        ensure_ascii=False,
        indent=1,
    )
    json.dump(marks, open(os.path.join(d, "marks.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    cuts = [0.0] + [max(0.0, s - 0.3) for s in starts[1:]] + [total]
    out = []
    for idx, (name, body, _) in enumerate(sections):
        s, e = cuts[idx], cuts[idx + 1]
        sf, ef = round(s * FPS), round(e * FPS)
        first = re.split(r"[，。？！、：,.?!:]", body)[0].strip()
        out.append(
            {
                "name": name,
                "label": display(first[:24], repl, lang),
                "start_time": round(s, 3),
                "end_time": round(e, 3),
                "duration": round(e - s, 3),
                "start_frame": sf,
                "duration_frames": ef - sf,
            }
        )
    timing = {
        "lang": lang,
        "total_duration": round(total, 3),
        "fps": FPS,
        "total_frames": round(total * FPS),
        "backend": a.backend,
        "voice": voice,
        "sections": out,
    }
    json.dump(timing, open(os.path.join(d, "timing.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    chars = sum(len(b) for b in bodies)
    print(f"{lang}: {total:.1f}s narration, {len(cues)} subtitle cues, {len(marks)} markers, {chars} chars, {voice}")
    for s in out:
        print(f"  {s['name']:<12} {s['start_time']:>7.2f}s  {s['duration']:>6.2f}s")
    for p in problems:
        print(f"WARNING: {p}", file=sys.stderr)


if __name__ == "__main__":
    main()
