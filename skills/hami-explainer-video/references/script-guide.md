# Writing the narration script

The script is read aloud by a synthetic voice and heard once, at speaking pace, by someone who has not read the source. Write for the ear.

## Shape

- **Length**: 700 to 900 Chinese characters, or 400 to 470 English words, which is roughly 2.5 to 3 minutes with the default voices (the example is 832 characters and 155 seconds in Chinese, 457 words and 169 seconds in English).
- **Sections**: five or six, each a `[SECTION:name]` block. Names are lowercase ASCII words; they become the scene keys.
  1. `hero`: the question the viewer already has, asked directly, and a promise of how long this takes. 10 to 15 seconds.
  2. Context: the minimum needed to follow the rest, such as what was compared or what the problem is.
  3. Two or three sections for the substance, one idea each.
  4. So what: how a viewer should use this, including the source's own caveats.
  5. `outro`: where the full material is and one invitation. About 10 seconds.

## Plain language

- One idea per sentence. If a sentence needs a second comma to be understood, split it.
- Introduce a term only if the viewer needs it to follow the next minute. Explain it in one clause with something familiar the first time it appears ("叫 Graph，可以理解为把计算步骤提前录好，之后直接回放"), then use the same word every time.
- Pick one concrete scenario and carry it through. The example uses a knowledge assistant and a customer-service bot sharing one GPU, and returns to it when explaining failures.
- At most two numbers in a sentence. Say rounded figures ("大约 25% 到 38%"); the exact values go on screen.
- Leave out mechanism details that do not change what the viewer should do. Record each omission in `brief.md`.

## Markers

A `{marker}` tag in front of a word tells the scenes when that word is spoken:

```text
{graph}很多推理服务会开启一种加速模式，叫 Graph，{record}可以理解为把计算步骤提前录好，{replay}之后直接回放。
```

- Names are lowercase words and hyphens (`{mps-faster}`), unique within the video, and say what appears rather than where (`{crash}`, not `{scene4-item2}`).
- Place one wherever the screen should change: a new item, a number, a highlight, the start and end of a small demonstration. The example has 48 across six sections.
- Put it immediately before the first word of the phrase, never at the very end of a section.
- Markers are not spoken and do not appear in subtitles.
- **Both languages use the same marker names.** Write one script, design the scenes and their markers, then write the other script and place each marker where the same idea is said. Word order differs between languages, so keep a marker with its idea, not with its position in the sentence.

## Writing the English script

Rewrite for an English-speaking listener rather than translating sentence by sentence: same sections, same points, same numbers and caveats, natural English.

- Spell out what should be read as words: `25 to 38 percent`, `release 2.12`, `the new version of MPS` rather than `MPS v3`.
- Avoid idioms that only work in Chinese, and keep sentences short: the listener cannot re-read.
- Write `Hami` so the voice reads it as a word, and map it back with `{"Hami": "HAMi"}`.

## Phrasing for speech and subtitles

Subtitles break at punctuation, and phrases are merged up to about 20 characters per line in Chinese and 64 in English. So:

- Put a comma wherever a speaker would breathe. A long stretch with no punctuation (over 20 Chinese characters, or about 80 English ones) becomes one long subtitle line and one long breath.
- End sections on a complete sentence; a short pause is inserted between sections.
- In Chinese, digits with units read correctly: `25%`, `6 次`, `2.12 版本`, `A100`. Avoid three-part versions (`v2.10.0`) and ISO dates (`2026-11-23`); write `2.10 版本`, `11 月 23 日`.
- Write names the way they should be said, and map them back for the subtitles in `subtitle_replacements.json`:

  ```json
  { "哈密": "HAMi", "英伟达的": "NVIDIA ", "英伟达": "NVIDIA " }
  ```

  Longer keys first when one contains another. English abbreviations (GPU, MPS, AI) can be written as they are.

## Voice of the HAMi community

The video speaks for the project, so it is held to what the source supports.

- State what was measured or decided, not a verdict. "这次测试的 MPS 配置，6 次全部受到了影响" is a result; "MPS 不可靠" is a claim the source does not make.
- When another project or approach does better at something, say so as plainly as where HAMi does better.
- Keep the source's limits in the narration, not only in small print: which hardware, versions and conditions the result covers.
- No superlatives or urgency. No platform-specific calls to action (一键三连 and the like) unless the user named the platform; the default ending points to the website and the repository.

## Before generating audio

Read each script aloud once in your head at speaking pace and check each sentence against `brief.md`: every number matches, nothing is claimed that the brief does not contain, and each caveat is still there. Then compare the two languages: same sections, same markers, same facts.
