/**
 * HAMi explainer motion kit: the scene frame plus the small set of motions
 * that help a viewer follow narration. All sizes are in a 1920x1080 design
 * space. See references/motion-kit.md in the skill for when to use each.
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LOGO } from "./assets";
import { HAMI as C } from "./brand";
import { FONT_BODY, FONT_DISPLAY } from "./fonts";

export const FPS = 30;
export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Lang = "zh" | "en";

/** Start of the current scene in narration seconds. Provided by ExplainerVideo. */
export const T0 = React.createContext(0);
/** Marker times in seconds, from marks.json. Provided by ExplainerVideo. */
export const Marks = React.createContext<Record<string, number>>({});
/** Small label shown top-right on every scene. Provided by ExplainerVideo. */
export const Badge = React.createContext("");
/** Language being rendered. Provided by ExplainerVideo, and by Root for stills and cards. */
export const LangContext = React.createContext<Lang>("zh");

/**
 * Picks the text (or number, or node) for the language being rendered:
 * `const L = useL(); L("先比速度", "Speed first")`. Keep both versions next to
 * each other so a scene stays one piece of code for every language.
 */
export const useL = () => {
  const lang = React.useContext(LangContext);
  return <T,>(zh: T, en: T): T => (lang === "en" ? en : zh);
};

/**
 * Frame, local to the current scene, at which a {marker} from podcast.txt is
 * spoken: `at("crash")`. Add frames for small offsets: `at("crash") + 9`.
 * Markers are resolved per language, so scenes never contain times.
 */
export const useAt = () => {
  const t0 = React.useContext(T0);
  const marks = React.useContext(Marks);
  return (marker: string) => {
    if (!(marker in marks)) {
      throw new Error(
        `Marker {${marker}} is not in marks.json. Add {${marker}} to podcast.txt for this language and rerun build_audio.py.`,
      );
    }
    return Math.round((marks[marker] - t0) * FPS);
  };
};

/** 0 -> 1 eased progress starting at a frame. */
export const useProgress = (at: number, frames = 30) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping: 200 }, durationInFrames: frames });
};

export const useAppear = (at: number, distance = 28, axis: "x" | "y" = "y") => {
  const p = useProgress(at, 18);
  const d = interpolate(p, [0, 1], [distance, 0]);
  return {
    opacity: p,
    transform: axis === "x" ? `translateX(${-d}px)` : `translateY(${d}px)`,
  } as React.CSSProperties;
};

/** Default entrance: fade in while sliding up (or in from the left with axis="x"). */
export const Appear = ({
  at,
  children,
  style,
  distance,
  axis,
}: {
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  distance?: number;
  axis?: "x" | "y";
}) => {
  const a = useAppear(at, distance, axis);
  return <div style={{ ...style, ...a }}>{children}</div>;
};

export const usePop = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 11, mass: 0.6, stiffness: 170 } });
  return {
    opacity: interpolate(frame, [at, at + 6], [0, 1], CLAMP),
    transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
  };
};

/** Bouncy scale-in for conclusions, numbers and badges. */
export const Pop = ({
  at,
  children,
  style,
}: {
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const a = usePop(at);
  return <div style={{ ...style, ...a }}>{children}</div>;
};

/**
 * Enlarges its child while the narration is about it (from..to) and dims it
 * afterwards. Pass `release` to bring it back to full opacity for a recap.
 */
export const Focus = ({
  from,
  to,
  release,
  children,
}: {
  from: number;
  to: number;
  release?: number;
  children: React.ReactNode;
}) => {
  const frame = useCurrentFrame();
  const active = interpolate(frame, [from, from + 8, to, to + 10], [0, 1, 1, 0], CLAMP);
  const released =
    release === undefined ? 0 : interpolate(frame, [release, release + 10], [0, 1], CLAMP);
  const dim = interpolate(frame, [to, to + 10], [0, 1], CLAMP) * (1 - released);
  return (
    <div
      style={{ height: "100%", transform: `scale(${1 + 0.02 * active})`, opacity: 1 - 0.5 * dim }}
    >
      {children}
    </div>
  );
};

/** Highlighter stroke sweeping under a keyword. */
export const Mark = ({
  at,
  color = C.green,
  children,
}: {
  at: number;
  color?: string;
  children: React.ReactNode;
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${color}59, ${color}59)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${p * 100}% 36%`,
        backgroundPosition: "0 90%",
        padding: "0 8px",
      }}
    >
      {children}
    </span>
  );
};

/** Three pulsing dots: "this thing is working". */
export const BusyDots = ({ phase = 0, color = "#ffffff" }: { phase?: number; color?: string }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: color,
            opacity: 0.35 + 0.65 * Math.max(0, Math.sin(frame / 5 - i * 0.9 + phase)),
          }}
        />
      ))}
    </div>
  );
};

/** Card surface: white-to-tint gradient, colored border, soft colored shadow. */
export const card = (color: string): React.CSSProperties => ({
  background: `linear-gradient(160deg, #ffffff 0%, ${color}12 100%)`,
  border: `3px solid ${color}`,
  borderRadius: 28,
  boxShadow: `0 10px 28px ${color}26`,
});

/** Rounded label. `solid` puts white text on the color, so pass a *Text shade. */
export const Pill = ({
  children,
  color,
  solid,
  size = 30,
}: {
  children: React.ReactNode;
  color: string;
  solid?: boolean;
  size?: number;
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 28px",
      borderRadius: 999,
      fontSize: size,
      fontWeight: 700,
      background: solid ? color : `${color}1c`,
      color: solid ? "#ffffff" : C.text,
      border: `2px solid ${color}`,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/**
 * Frame for every scene: white surface, two soft brand glows, the HAMi logo
 * top-left, the badge top-right and an optional centered title.
 * Keep scene content between y=110 (y=210 with a title) and y=900; subtitles
 * and the chapter bar sit below that.
 */
export const Scene = ({
  title,
  glow = [C.green, C.blue],
  children,
}: {
  title?: string;
  glow?: [string, string];
  children: React.ReactNode;
}) => {
  const frame = useCurrentFrame();
  const badge = React.useContext(Badge);
  const drift = Math.sin(frame / 90) * 30;
  const titleStyle = useAppear(0);
  return (
    <AbsoluteFill style={{ backgroundColor: C.surface, fontFamily: FONT_BODY, color: C.text }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -260 + drift,
          top: -380,
          background: `radial-gradient(circle, ${glow[0]}22 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          right: -320 - drift,
          bottom: -480,
          background: `radial-gradient(circle, ${glow[1]}1c 0%, transparent 65%)`,
        }}
      />
      <Img src={LOGO.horizontal} style={{ position: "absolute", left: 64, top: 30, height: 64 }} />
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 44,
          fontSize: 26,
          fontWeight: 600,
          color: C.muted,
          letterSpacing: 1,
        }}
      >
        {badge}
      </div>
      {title && (
        <div
          style={{
            position: "absolute",
            top: 108,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONT_DISPLAY,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.15,
            color: C.heading,
            ...titleStyle,
          }}
        >
          {title}
        </div>
      )}
      {children}
    </AbsoluteFill>
  );
};
