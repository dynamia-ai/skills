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
```

Install every skill in the repository. The CLI prompts you to select the target agents when needed.

```sh
npx skills add dynamia-ai/skills --skill '*'
```

## Skills

| Skill | Use it to |
| --- | --- |
| [remove-defensive-writing](skills/remove-defensive-writing/SKILL.md) | Edit human-facing prose to remove redundant caveats while preserving limits the reader needs. |
| [feishu-pdf-export](skills/feishu-pdf-export/SKILL.md) | Export a Feishu document or wiki page to a local PDF, compare extracted text with the source, and inspect every rendered page. Includes an optional Dynamia PDF template. |

Each skill lives in `skills/<name>/` and starts at `SKILL.md`. The Feishu skill also requires the exporter, Poppler, and access to the source document. See [exporter setup](skills/feishu-pdf-export/references/setup.md).
