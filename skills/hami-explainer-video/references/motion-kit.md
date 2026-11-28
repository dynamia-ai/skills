# The scene kit

Everything is in `src/remotion/hami/` of the video project. Sizes are in a 1920×1080 design space; the shell scales it to 4K.

## Shell (`chrome.tsx`)

`ExplainerVideo` takes `scenes`, and `chapters` and `badge` per language. It reads the language from `timing.json`, cuts between scenes at the section boundaries in `timing.json`, plays a green wipe across each cut, and draws the subtitles, the chapter bar and the narration audio. Scenes never deal with any of that.

## Scene frame and layout (`kit.tsx`)

`<Scene title="…" glow={[C.purple, C.green]}>` gives the background, logo, badge and an animated title. Vary the two glow colors between consecutive scenes so a cut reads as a change.

Scene content is absolutely positioned inside it:

- usable width: x from 110 to 1810 (1700 wide);
- usable height: y from 210 to 900 with a title, from 110 without. Below 900 belong to the subtitles and the chapter bar.

## Timing and language

```tsx
const at = useAt();
const L = useL();
<Appear at={at("graph")}>{L("Graph 模式", "Graph mode")}</Appear>;
```

`at("marker")` is the frame, inside the current scene, at which that `{marker}` from `podcast.txt` is spoken in the language being rendered. Add frames for small offsets: `at("crash") + 9`, or `at("faults") - 13` to finish something just before the next phrase. Use a plain frame number such as `0` or `8` for things present when the scene opens. A marker missing from the script stops the render with its name.

`L(zh, en)` returns the value for the language being rendered. It takes anything, not only text: `fontSize: L(46, 38)`, or an array of lines. Keep the two versions side by side so a scene stays one piece of code.

Scenes never contain times in seconds. That is what makes one composition work for both languages, any voice, and any later re-recording.

## Motions and what each is for

| Piece | What it does | Use it for |
| --- | --- | --- |
| `Appear` | Fade in while sliding up, or from the left (`axis="x"`) | The default entrance for anything |
| `Pop` | Bouncy scale-in | A conclusion, a number, a verdict badge: the thing to remember |
| `Focus` | Slightly enlarges the current item, dims it afterwards | Side-by-side items discussed one after another; `release` for recaps |
| `Mark` | Highlighter sweep under a word | The one keyword of a sentence. Once or twice per scene |
| `useProgress` | A 0 to 1 eased value from a frame | Bars growing, counters, anything custom |
| `BusyDots` | Three pulsing dots | Showing that something is running |
| `card(color)`, `Pill` | Card surface style, rounded label | Grouping content; short takeaways |
| `CLAMP`, Remotion `interpolate` | Building blocks | One-off motion written in the scene |

## Designing a scene

Start from the script of that section and decide what is on screen during each phrase; that decides where the markers go.

- **An element appears when it is first mentioned**, on a marker placed before that word. Earlier and the viewer reads ahead of the narrator; later and it feels broken.
- **One new thing per phrase.** If three items are listed, reveal three times.
- **Show mechanisms as tiny animations rather than describing them.** The example explains "record once, then replay" with four step boxes that are recorded one by one and then replayed quickly, and "native sharing" with two services taking turns. These are small components written in the composition for that one video, which is the normal way to do it: add to the kit only what a second video also needs.
- **Motion carries meaning or it is left out.** A shake belongs to a failure and lasts well under a second. Nothing blinks, and nothing loops for decoration beyond a gentle float on the mascot or a busy indicator.
- **On-screen text is shorter than the narration**: labels, numbers and conclusions, not sentences. Exact figures go on screen while the narrator says the rounded ones.
- **Leave the complete picture up** for at least a second before the scene ends.
- **Put the source's caveat on screen** in the scene where the result is shown, in `muted` text of at least 24px, not only in the narration.

Scene types that work, all in the example: questions and a simple picture (opening); option cards revealed and focused in turn; a bar chart per condition with takeaway pills; a short story that turns into a results table revealed row by row; two "if you… then…" cards with a joint conclusion; links and a goodbye.

Use different layouts for consecutive scenes. Three card grids in a row read as slides.

## Check both languages

English text is usually longer than the Chinese it replaces. After building a scene, look at stills of both languages; where English overflows, shorten it or give it a smaller size with `L`.

## Thumbnail

`Thumbnail.tsx` renders at 1920×1080 and 1200×900, in the language passed as `--props='{"lang":"en"}'` (text through `L`, as in scenes). It is seen about 300px wide: logo, a title of at least 120px, and one short hook. Nothing else survives at that size.
