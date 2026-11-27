---
name: hami-explainer-video
description: Create HAMi-branded explainer content from a blog post, doc page, URL or any supplied text - a narrated video (horizontal 4K, voice-over and subtitles, about 2-3 minutes) and image cards for 小绿书 and LinkedIn, each in Chinese, English or both. Use when asked to make a video, explainer, 解说视频, 讲解视频, 短视频, 视频版, 贴图, 图文卡片 or carousel for HAMi content, or to revise content made this way.
---

# HAMi explainer video and image cards

Turns one piece of written content into two things a general technical audience can take in without reading the source:

- **A video**: a narrator explains it in plain language while animated scenes show each point as it is said.
- **Image cards**: a short deck making the same points for feeds, sized for 小绿书 (3:4) and LinkedIn (4:5, plus a PDF carousel).

Both come in Chinese and English from one set of code. They are published as the HAMi community, so they must be accurate to the source, fair to other projects, and on brand.

Make what the user asked for: video, cards, or both; one language or both. If they did not say, make the video and the cards in both languages.

## Where things live

- **This skill**: instructions, scripts, the shared scene kit, and one complete example. `$SKILL` is the absolute path of the directory containing this `SKILL.md`, wherever the skill is installed.
- **The HAMi website checkout**: a local clone of [Project-HAMi/website](https://github.com/Project-HAMi/website), at `$HAMI_WEBSITE_REPO`. The brand rules (`BRAND.md`) and the official logo and mascot artwork are read from it; the skill ships no artwork. It is also where HAMi blog posts and docs live when they are the source.
- **The video project** (outside the website repo, so renders and `node_modules` never reach the site or its CI): `$HAMI_VIDEO_PROJECT`, default `../hami-videos` next to the website checkout.

```
videos/<name>/
  brief.md                 facts, shared by every language
  zh/  en/                 one folder per language: podcast.txt, audio, timings, final_video.mp4
  cards/                   rendered image cards and post copy
src/remotion/compositions/<name>/
  Video.tsx  Thumbnail.tsx  Cards.tsx    one set of code for all languages
```

`<name>` is lowercase kebab-case, e.g. `gpu-sharing-benchmarks`. Its composition id is the PascalCase form, `GpuSharingBenchmarks`. Every command below runs from the video project root, with `SKILL` and `HAMI_WEBSITE_REPO` set in the shell:

```bash
export SKILL=/absolute/path/to/hami-explainer-video      # the directory containing this SKILL.md
export HAMI_WEBSITE_REPO=/absolute/path/to/website       # the HAMi website checkout
```

If the website checkout's location is not known, ask the user for it, or to clone it; do not guess a path and do not substitute other artwork.

## Set up

```bash
bash "$SKILL/scripts/init_project.sh"                # creates or completes the project; safe to re-run
bash "$SKILL/scripts/init_project.sh" --update-kit   # also refresh the shared code from the skill
```

The script takes the website checkout from `HAMI_WEBSITE_REPO` or `--website <dir>` and stops with an error if it is missing or lacks `BRAND.md` or the artwork. An optional first argument is the project directory, overriding `$HAMI_VIDEO_PROJECT`. It needs `node`, `npm`, `python3`, `ffmpeg` and `ffprobe` on the PATH.

It installs dependencies, copies the official logo and mascot artwork from the website checkout's `static/`, and reports whether an Azure Speech key is present. The key belongs in the project's `.env` (`AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`). If it is missing, ask the user to put it there or to authorize fetching it with `az`; never ask for it to be pasted into the conversation and never print it. Cards alone need no key.

## Workflow

### 1. Read the source and write the brief

The source may be a blog post in the website checkout (`$HAMI_WEBSITE_REPO/blog/<slug>/index.md`, with a Chinese mirror under `$HAMI_WEBSITE_REPO/i18n/zh/docusaurus-plugin-content-blog/`), a docs page there, a URL, or a file the user points at. Read all of it.

Write `videos/<name>/brief.md`:

- the single takeaway a viewer should leave with;
- every fact and number that will be used, copied exactly, with where in the source it comes from;
- what is being left out or simplified, and why;
- the caveats the source itself states (scope of a test, versions, "does not prove X").

The brief is what makes the result checkable. Nothing may be spoken or shown, in either language, that is not in it, and the source's caveats must survive into both the video and the cards.

### 2. Write the narration, with markers

Write `videos/<name>/<lang>/podcast.txt` for each language, following [references/script-guide.md](references/script-guide.md). It is plain text in `[SECTION:name]` blocks; each section becomes one scene.

Put a `{marker}` tag in front of each word on which something should happen on screen:

```text
{crash}知识助手崩了，{still-ok}客服还能正常工作吗？
{crash}The knowledge assistant crashes. {still-ok}Can customer service keep working?
```

Markers are never spoken. Scenes refer to them by name, so the Chinese and English scripts must use the same section names and the same marker names, each placed where that idea is said in that language. The English script is a rewrite for an English-speaking listener, not a word-for-word translation, but it makes the same points in the same order.

Add `subtitle_replacements.json` beside each script for words spoken one way and shown another (`{"哈密": "HAMi"}`).

Carry on without waiting for script approval unless the user asked to review it. The preview in step 5 is the review point.

### 3. Generate the narration audio

```bash
.venv/bin/python "$SKILL/scripts/build_audio.py" videos/<name>/zh
.venv/bin/python "$SKILL/scripts/build_audio.py" videos/<name>/en
```

Each run writes the audio, subtitles (`podcast_audio.srt`, `cues.json`), `marks.json` (when each marker is spoken) and `timing.json` (language and section starts). Aim for 2 to 3.5 minutes; if it is longer, cut script rather than speeding up the voice. Treat any WARNING as a defect to fix in the script text.

Default voices are `zh-CN-Xiaochen:DragonHDLatestNeural` and `en-US-Ava:DragonHDLatestNeural`. To let the user choose another, synthesize a 30-second sample per candidate (a scratch folder with a short `podcast.txt`, then `--voice <name>`) rather than rebuilding the whole video.

### 4. Build the scenes

Read the example first: [examples/gpu-sharing-benchmarks/](examples/gpu-sharing-benchmarks/) (`Video.tsx` with `zh/podcast.txt` and `en/podcast.txt`). It shows the structure and the expected level of polish; it is a reference to learn from, not a form to fill in. Each new video needs scenes designed for its own content.

Create `src/remotion/compositions/<name>/Video.tsx` and `Thumbnail.tsx`, and register them in `src/remotion/registry.ts`. `Video.tsx` hands `ExplainerVideo` one scene per section (keys equal the section names), chapter labels and a badge per language.

- Use the kit in `src/remotion/hami/`. [references/motion-kit.md](references/motion-kit.md) lists the pieces and when each one helps.
- Follow [references/brand.md](references/brand.md) for color, type, logo and mascot.
- Time every reveal with `at("marker")`. Scenes contain no times, which is what lets one composition serve every language and survive any re-recording.
- Write every on-screen string as `L("中文", "English")`, side by side. English runs longer: `L` also takes numbers, so a font size can differ per language (`fontSize: L(46, 38)`).

The principle for every scene: the screen shows what the narrator is saying right now, in fewer words, and each element arrives when it is mentioned. A scene that shows everything at once, or text that repeats the narration verbatim, is a slide rather than an explainer.

### 5. Check it, then stop for review

```bash
npx tsc --noEmit
npx remotion still src/remotion/index.ts <Id> out/qa/<lang>_<n>.jpg --frame=<frame> \
  --scale=0.3 --image-format=jpeg --public-dir videos/<name>/<lang>/
```

For **each language**, render and look at stills for every scene: one near its end, when everything is revealed, and one or two mid-animation. Pick frames from `marks.json` (`frame = seconds × 30`, a second or two after a marker). Check for text overflow (English especially), content running under the subtitle area, elements visible before they are mentioned, and numbers that differ from the brief. Fix and re-check.

Then render a 1080p preview per language and give the user the absolute paths:

```bash
npx remotion render src/remotion/index.ts <Id> out/<name>_<lang>_preview.mp4 --scale=0.5 --public-dir videos/<name>/<lang>/
```

Stop here and wait. Say plainly what was not verified: the audio has not been listened to, and only sampled frames were inspected. Do not render 4K until the user approves.

Start Remotion Studio only if the user asks for it. It listens on all network interfaces without authentication, so say so and stop it when the review is over.

### 6. Final render

Per language:

```bash
npx remotion render src/remotion/index.ts <Id> videos/<name>/<lang>/output.mp4 --video-bitrate 16M --public-dir videos/<name>/<lang>/
python3 "$SKILL/scripts/finalize.py" videos/<name>/<lang>          # add --bgm <file> for background music
npx remotion still src/remotion/index.ts <Id>-Thumb16x9 videos/<name>/<lang>/thumbnail_16x9.png --props='{"lang":"<lang>"}'
npx remotion still src/remotion/index.ts <Id>-Thumb4x3 videos/<name>/<lang>/thumbnail_4x3.png --props='{"lang":"<lang>"}'
```

`finalize.py` normalizes loudness, writes `final_video.mp4`, and exits non-zero with a reason if the file is not publishable. The skill ships no music; background music is added only from a track the user supplies and is licensed to publish (`videos/<name>/bgm.mp3` is picked up for every language).

Write `videos/<name>/<lang>/publish_info.md` in that language: a title, a 100 to 200 character description, about ten tags, chapter timestamps taken from `timing.json`, and links to the source. Keep the wording platform-neutral unless the user named a platform.

### 7. Image cards

Follow [references/image-cards.md](references/image-cards.md). Write `src/remotion/compositions/<name>/Cards.tsx`, add `cards` to the registry entry, then:

```bash
.venv/bin/python "$SKILL/scripts/render_cards.py" <name> <Id>      # --langs zh for one language
```

This renders every card at both sizes in both languages and builds the LinkedIn PDFs under `videos/<name>/cards/`. Look at every card of every set: the 4:5 size is the shortest and is where text overflows. Then write the post copy next to them (`post_zh.md`, `post_en.md`).

Cards need no audio, so they can be made on their own from steps 1 and 7.

### 8. Changes after review

- **Visual change**: edit the composition, repeat step 5 (or re-render the cards).
- **Narration change** (wording, voice): edit `podcast.txt`, rerun `build_audio.py` for that language, repeat step 5. Markers move with the words, so nothing needs re-timing. If a sentence that carries a marker is removed, move the marker or remove its use in the scene; the render stops with the marker's name if one is missing.
- **A change of substance** goes into `brief.md` first, then into both scripts, the scenes and the cards.

Never edit `timing.json`, `cues.json`, `marks.json` or the `.srt` by hand: they are regenerated and must agree with the audio.

## Reporting to the user

Lead with the file paths and their state (preview or final), per language. Then say what needs their ears or eyes, because these cannot be checked from here: pronunciation and pacing of the narration in each language, the music balance, and the feel of the motion. List what the content simplifies or omits relative to the source.

## Things that go wrong

- **`timing.json: HTTP 404`**: a Remotion command ran without `--public-dir videos/<name>/<lang>/`.
- **`Marker {x} is not in marks.json`**: the scene uses a marker that this language's script lacks. Add it to that `podcast.txt` and rerun `build_audio.py`.
- **A red "No scene for [SECTION:x]" frame**: the scene keys in `Video.tsx` do not match the section names in `podcast.txt`.
- **HAMi is mispronounced**: write it the way it should sound (`哈密` in Chinese, `Hami` in English) and map it back in `subtitle_replacements.json`. Ask the user to listen: pronunciation cannot be checked from here.
- **English text overflows where Chinese fits**: shorten the English, or give it a smaller size with `L(46, 38)`. Do not shrink the Chinese to match.
- **Chinese text looks different on another machine**: the Latin brand fonts are bundled, but Chinese glyphs come from the system (Source Han Sans, Noto Sans CJK or PingFang). Check the stills.
- **Other languages**: only `zh` and `en` are supported. Adding one means a voice and punctuation rules in `build_audio.py` and a third argument everywhere `L` is used; say so rather than improvising.
