// Brand font stacks from BRAND.md, with a CJK fallback appended. The Latin
// brand fonts are bundled so renders do not depend on what is installed; the
// CJK glyphs come from whichever of the fallback fonts the machine has.
import { cancelRender, continueRender, delayRender } from "remotion";
import sg500 from "@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2";
import sg700 from "@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2";
import ss500 from "@fontsource/source-sans-3/files/source-sans-3-latin-500-normal.woff2";
import ss600 from "@fontsource/source-sans-3/files/source-sans-3-latin-600-normal.woff2";
import ss700 from "@fontsource/source-sans-3/files/source-sans-3-latin-700-normal.woff2";
import ss800 from "@fontsource/source-sans-3/files/source-sans-3-latin-800-normal.woff2";

const CJK = '"Source Han Sans SC", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei"';

/** Headings. */
export const FONT_DISPLAY = `"Space Grotesk", "Avenir Next", "Segoe UI", ${CJK}, sans-serif`;
/** Body text and labels. */
export const FONT_BODY = `"Source Sans 3", "Noto Sans", "Segoe UI", ${CJK}, sans-serif`;

const FACES: [string, string, string][] = [
  ["Space Grotesk", sg500, "500"],
  ["Space Grotesk", sg700, "700"],
  ["Source Sans 3", ss500, "500"],
  ["Source Sans 3", ss600, "600"],
  ["Source Sans 3", ss700, "700"],
  ["Source Sans 3", ss800, "800"],
];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading HAMi brand fonts");
  Promise.all(
    FACES.map(([family, url, weight]) =>
      new FontFace(family, `url(${url}) format("woff2")`, { weight }).load().then((face) => {
        document.fonts.add(face);
      }),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
}
