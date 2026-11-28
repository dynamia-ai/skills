/**
 * Image cards for feeds (小绿书, LinkedIn): a short deck that makes the same
 * points as the video, readable on a phone without sound. Cards are 1080 wide
 * and either 1440 (3:4) or 1350 (4:5) tall, so lay content out with flex and
 * never against a fixed height. See references/image-cards.md in the skill.
 */
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { LOGO } from "./assets";
import { HAMI as C } from "./brand";
import { FONT_BODY, FONT_DISPLAY } from "./fonts";

export type CardRatio = "3x4" | "4x5";
export const CARD_HEIGHT: Record<CardRatio, number> = { "3x4": 1440, "4x5": 1350 };

/** Position of the card being rendered. Provided by Root. */
export const CardPage = React.createContext<{ page: number; total: number; ratio: CardRatio }>({
  page: 1,
  total: 1,
  ratio: "3x4",
});

/**
 * Frame for every card: white surface with soft brand glows, the HAMi logo and
 * page count on top, the site address at the bottom. Children fill the space
 * between, stacked top to bottom; use `justify` to center a cover or closing card.
 */
export const CardFrame = ({
  children,
  glow = [C.green, C.blue],
  justify = "flex-start",
  footer = "project-hami.io",
}: {
  children: React.ReactNode;
  glow?: [string, string];
  justify?: "flex-start" | "center" | "space-between";
  footer?: string;
}) => {
  const { page, total } = React.useContext(CardPage);
  return (
    <AbsoluteFill style={{ backgroundColor: C.surface, fontFamily: FONT_BODY, color: C.text }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -330,
          top: -360,
          background: `radial-gradient(circle, ${glow[0]}2e 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          right: -360,
          bottom: -380,
          background: `radial-gradient(circle, ${glow[1]}26 0%, transparent 65%)`,
        }}
      />
      <AbsoluteFill style={{ padding: "56px 64px 48px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Img src={LOGO.horizontal} style={{ height: 72 }} />
          <div style={{ fontSize: 32, fontWeight: 600, color: C.muted }}>
            {page} / {total}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: justify,
            padding: "44px 0 36px",
          }}
        >
          {children}
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.muted, textAlign: "center" }}>
          {footer}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Card headline. Keep it to two lines. */
export const CardTitle = ({
  children,
  size = 76,
  style,
}: {
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      fontFamily: FONT_DISPLAY,
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.2,
      color: C.heading,
      ...style,
    }}
  >
    {children}
  </div>
);

/** One line under the headline that says what the card shows. */
export const CardLead = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.4, color: C.muted, marginTop: 18 }}>
    {children}
  </div>
);

/** Small print for the source's caveats. Never smaller than this. */
export const CardNote = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.45, color: C.muted }}>{children}</div>
);
