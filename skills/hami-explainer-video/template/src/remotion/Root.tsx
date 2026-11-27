import React from "react";
import { Composition, Still, useCurrentFrame } from "remotion";
import { CardPage, CARD_HEIGHT } from "./hami/cards";
import type { CardRatio } from "./hami/cards";
import { loadTiming } from "./hami/chrome";
import { LangContext } from "./hami/kit";
import type { Lang } from "./hami/kit";
import { VIDEOS } from "./registry";
import type { VideoEntry } from "./registry";

// Per video:
//   <Id>              the video; language comes from timing.json in --public-dir
//   <Id>-Thumb16x9    cover images; pass --props='{"lang":"en"}' for English
//   <Id>-Thumb4x3
//   <Id>-Cards        one card per frame; --props='{"lang":"en","ratio":"4x5"}'
const build = (v: VideoEntry) => {
  const Thumb = ({ lang, aspectRatio }: { lang: Lang; aspectRatio: "16:9" | "4:3" }) => (
    <LangContext.Provider value={lang}>
      <v.Thumbnail aspectRatio={aspectRatio} />
    </LangContext.Provider>
  );
  const cards = v.cards ?? [];
  const Deck = ({ lang, ratio }: { lang: Lang; ratio: CardRatio }) => {
    const frame = useCurrentFrame();
    const Card = cards[Math.min(frame, cards.length - 1)];
    return (
      <LangContext.Provider value={lang}>
        <CardPage.Provider value={{ page: frame + 1, total: cards.length, ratio }}>
          <Card />
        </CardPage.Provider>
      </LangContext.Provider>
    );
  };
  return { ...v, Thumb, Deck, cardCount: cards.length };
};

const ENTRIES = VIDEOS.map(build);

export const RemotionRoot = () => (
  <>
    {ENTRIES.map((v) => (
      <React.Fragment key={v.id}>
        <Composition
          id={v.id}
          component={v.Video}
          fps={30}
          width={3840}
          height={2160}
          durationInFrames={300}
          calculateMetadata={async () => ({ durationInFrames: (await loadTiming()).total_frames })}
        />
        <Still
          id={`${v.id}-Thumb16x9`}
          component={v.Thumb}
          width={1920}
          height={1080}
          defaultProps={{ lang: "zh" as Lang, aspectRatio: "16:9" as const }}
        />
        <Still
          id={`${v.id}-Thumb4x3`}
          component={v.Thumb}
          width={1200}
          height={900}
          defaultProps={{ lang: "zh" as Lang, aspectRatio: "4:3" as const }}
        />
        {v.cardCount > 0 && (
          <Composition
            id={`${v.id}-Cards`}
            component={v.Deck}
            fps={30}
            width={1080}
            height={1440}
            durationInFrames={v.cardCount}
            defaultProps={{ lang: "zh" as Lang, ratio: "3x4" as CardRatio }}
            calculateMetadata={({ props }) => ({ height: CARD_HEIGHT[props.ratio] })}
          />
        )}
      </React.Fragment>
    ))}
  </>
);
