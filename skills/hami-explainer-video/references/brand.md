# Brand rules for video

The authoritative sources are in the HAMi website checkout (`$HAMI_WEBSITE_REPO`, see SKILL.md); read them when a case is not covered here.

- `$HAMI_WEBSITE_REPO/BRAND.md`: colors, fonts, logo.
- `$HAMI_WEBSITE_REPO/static/resources/hami-character-assets/guidelines/`: the hami mascot handbook and usage rules (PDF, Chinese).

The kit already applies most of this. These are the rules that scene code can still break.

## Color

Use the tokens in `src/remotion/hami/brand.ts`; do not introduce other hues.

| Token                        | Use                                                              |
| ---------------------------- | ---------------------------------------------------------------- |
| `green` `#10d05d`            | Fills, borders, highlights. Never text: it fails contrast.       |
| `greenText` `#0a8f3d`        | Green text and icons on light backgrounds; fill under white text |
| `blue` / `blueText`          | Information, metrics, a neutral second item                      |
| `purple` / `purpleText`      | Scheduling, policy, a third item                                 |
| `warn` / `warnText`          | Caveats and attention                                            |
| `danger` / `dangerText`      | Errors and failed results only                                   |
| `heading`, `text`, `muted`   | Titles, body, secondary labels                                   |
| `surface`, `canvas`,`border` | Backgrounds and dividers                                         |

Green means HAMi. When comparing HAMi with something else, give the other item blue or purple, never red: red is for an actual failure shown on screen, not for a competitor. The `*Text` shades are the ones to use for colored text, icons, and solid fills that carry white text.

Videos are light theme: white scene background with the soft glows that `Scene` draws.

## Type

`FONT_DISPLAY` (Space Grotesk) for titles and headings, `FONT_BODY` (Source Sans 3) for everything else. Both are bundled for Latin text and fall back to the system Chinese font. `Scene` sets the body font; add `fontFamily: FONT_DISPLAY` on headings you draw yourself.

In the 1920×1080 design space: scene titles 72px, card headings 44 to 46px, body 30px or more, small notes no less than 24px. Text smaller than that is unreadable on a phone.

## Logo

`Scene` places the horizontal logo top-left on every scene; thumbnails use `LOGO.horizontal`. Use the files as they are: no recoloring, gradients, shadows, outlines, skewing or stretching, and never retype the wordmark as text to stand in for the logo. Keep the horizontal logo at least 100px wide. Writing "HAMi" in a sentence is fine.

## The hami mascot

- Use only the official artwork exposed as `MASCOT` in `src/remotion/hami/assets.ts`. Do not draw, generate or trace new mascot art.
- Show it unmodified: no cropping, rounded corners, recoloring, filters, shadows or overlays on the character. Scaling it proportionally and moving the whole image (a gentle float) are fine.
- `MASCOT.curiosity` and `MASCOT.broadcast` are square tiles with their own background; the others are transparent and sit better on scenes.
- The mascot always appears as part of HAMi: on a scene that carries the HAMi logo or name. It is never presented as a separate brand.
- "hami" in lowercase is the character; "HAMi" is the project.
- Use it sparingly, where it adds warmth: the opening, a friendly stand-in such as a service agent, the goodbye. One per scene.

Community videos are a permitted non-commercial use of the official artwork. Commercial use needs written approval from the maintainers; raise it with the user instead of proceeding.
