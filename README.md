# Dynamia Agent Skills

## Install

Use the [Skills CLI](https://github.com/vercel-labs/skills). Run these commands from the project where you want to use the skills. Add `-g` to an install command to make the skill available across your projects.

List available skills.

```sh
npx skills add dynamia-ai/skills --list
```

Install one skill by name.

```sh
npx skills add dynamia-ai/skills --skill remove-defensive-writing
npx skills add dynamia-ai/skills --skill feishu-pdf-export
npx skills add dynamia-ai/skills --skill terminal-demo
npx skills add dynamia-ai/skills --skill hami-explainer-video
```

Install every skill in the repository. The CLI prompts you to select the target agents when needed.

```sh
npx skills add dynamia-ai/skills --skill '*'
```

## Skills

| Skill | Use it to |
| --- | --- |
| [remove-defensive-writing](skills/remove-defensive-writing/SKILL.md) | Edit human-facing prose to remove redundant caveats while preserving limits the reader needs. |
| [feishu-pdf-export](skills/feishu-pdf-export/SKILL.md) | Export a Feishu document or wiki page to a local PDF, compare extracted text with the source, and inspect every rendered page. Uses the bundled Dynamia stylesheet and cover logo by default. |
| [terminal-demo](skills/terminal-demo/SKILL.md) | Record reproducible terminal demonstrations with real interactive prompts and optional subtitles. |
| [hami-explainer-video](skills/hami-explainer-video/SKILL.md) | Turn a blog post, doc page or other text into a HAMi-branded narrated explainer video (horizontal 4K, voice-over and subtitles) and image cards for 小绿书 and LinkedIn, in Chinese and English. |

Each skill lives in `skills/<name>/` and starts at `SKILL.md`. The Feishu skill also requires the exporter, Poppler, and access to the source document. See [exporter setup](skills/feishu-pdf-export/references/setup.md).

The `hami-explainer-video` skill requires:

- Node.js with npm, Python 3, and ffmpeg with ffprobe.
- A local checkout of the [HAMi website](https://github.com/Project-HAMi/website), passed as `HAMI_WEBSITE_REPO` or `--website`. The brand rules and the official logo and mascot artwork are read from it at setup; this repository ships none of the artwork.
- An Azure Speech key (`AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`) in the video project's `.env` for the narration. Image cards alone need no key.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
