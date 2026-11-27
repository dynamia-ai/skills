# Image cards for 小绿书 and LinkedIn

A card deck makes the video's points for someone scrolling a feed with the sound off. It is its own piece of work, not screenshots of the video: portrait instead of landscape, read instead of heard, and each card has to make sense alone because feeds show them one at a time.

## Sizes and outputs

`render_cards.py` produces, under `videos/<name>/cards/`:

| Output | Size | For |
| --- | --- | --- |
| `zh-3x4/`, `en-3x4/` | 1080×1440 | 小绿书 (WeChat image posts): up to 20 images, 3:4 recommended |
| `zh-4x5/`, `en-4x5/` | 1080×1350 | LinkedIn multi-image posts: 4:5 is the tallest it shows |
| `linkedin-<lang>.pdf` | 1080×1350 | LinkedIn document post, the swipeable carousel |

Both languages are rendered at both sizes, so either platform can be posted in either language. Platform limits change; if the user reports a different requirement, follow them.

## Shape of a deck

Five to seven cards:

1. **Cover**: the question in the largest type on the card, one line saying whose result this is, and a reason to swipe. It must work as the only card someone sees.
2. **Context**: what was compared or what the situation is, in one glance.
3. **Two to four content cards**, one finding each, shown as a chart, a table or two contrasting boxes rather than as paragraphs.
4. **What to do with it**: the decision or takeaway.
5. **Closing**: where the full material is, and the mascot saying goodbye.

Every card that shows a result carries the source's caveat for that result in a `CardNote`. A card gets screenshotted and passed on without its neighbours, so the caveat cannot live only on another card or in the post text.

## Building `Cards.tsx`

Export the deck in reading order: `export const cards: React.FC[] = [Cover, Setup, …]`, and add `cards` to the video's registry entry. See [the example](../examples/gpu-sharing-benchmarks/Cards.tsx).

From `src/remotion/hami/cards.tsx`:

- `CardFrame`: background, logo, page count and footer. Children stack top to bottom; `justify="center"` suits a cover or closing card.
- `CardTitle`, `CardLead`, `CardNote`: headline, one-line explanation, small print.
- `CardPage` context: `page`, `total` and `ratio`, for text such as "6 张图看懂".

`Pill`, `card()`, the brand tokens, fonts, `MASCOT` and `useL` come from the same kit as the video. Cards are static, so the animation helpers (`Appear`, `Pop`, `useAt`) do not apply.

Layout rules:

- The card is 1080 wide with 64px side padding, so content is 952 wide.
- The same component is rendered 1440 and 1350 tall. Stack content with flex and margins; never position against the bottom edge. **Design for the 1350 height**: about 1060px of content below the header. The 1440 version simply gets more air.
- Type is for a phone held at arm's length: titles 68 to 108px, body 36px or more, `CardNote` (28px) is the floor.
- Write text as `L("中文", "English")`. English runs longer, so check its 4:5 set first; shorten the English or reduce its size with `L(76, 68)`.
- Reuse the video's figures and wording so the two never disagree, but redraw visuals for portrait: stack what the video places side by side.
- Brand rules are the same as for video ([brand.md](brand.md)): green text in `greenText`, red only for an actual failure, mascot artwork unmodified and at most one per card.

## Checking

After `render_cards.py`, look at every card in every set; a contact sheet per set is the quick way:

```bash
cd videos/<name>/cards/en-4x5
ffmpeg -y -loglevel error -i 01.png -i 02.png -i 03.png -i 04.png -i 05.png -i 06.png \
  -filter_complex "[0][1][2]hstack=3[a];[3][4][5]hstack=3[b];[a][b]vstack,scale=1500:-1" ../../../../out/qa/cards_en-4x5.jpg
```

Look for text running into the footer or off the bottom, a title wrapping to three lines, and numbers that differ from `brief.md`. The script checks sizes and counts only.

## Post copy

Write `videos/<name>/cards/post_zh.md` and `post_en.md`. Each holds the text to paste for both platforms in that language:

- **小绿书**: a title of at most 20 characters that states the question; 300 to 500 characters of body that give the conclusion first, then the two or three findings, then the caveat and the link; five to eight `#话题` tags.
- **LinkedIn**: a first line that works before the "see more" cut; short paragraphs with the findings; the caveat; a link to the report; three to five hashtags. No emoji-led bullet lists and no engagement bait.

The same voice rules as the narration apply ([script-guide.md](script-guide.md)): results rather than verdicts, the other project's strengths stated as plainly as HAMi's, the source's limits kept.
