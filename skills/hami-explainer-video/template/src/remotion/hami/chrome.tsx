/**
 * The parts every explainer shares: timing loader, chapter bar, subtitles,
 * chapter wipe and the ExplainerVideo shell that cuts scenes to narration.
 * Reads timing.json, cues.json, marks.json and podcast_audio.wav from --public-dir,
 * which is the language folder of a video: videos/<name>/<lang>/.
 */
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HAMI as C } from "./brand";
import { FONT_BODY } from "./fonts";
import { Badge, CLAMP, FPS, LangContext, Marks, T0 } from "./kit";
import type { Lang } from "./kit";

export interface TimingSection {
  name: string;
  label: string;
  start_time: number;
  start_frame: number;
  duration_frames: number;
}
export interface Timing {
  lang: Lang;
  total_frames: number;
  sections: TimingSection[];
}
interface Cue {
  start: number;
  end: number;
  text: string;
}

const pending = new Map<string, Promise<unknown>>();
const loaded = new Map<string, unknown>();

const loadJson = <T,>(file: string): Promise<T> => {
  const url = staticFile(file);
  if (!pending.has(url)) {
    pending.set(
      url,
      fetch(url)
        .then((r) => {
          if (!r.ok)
            throw new Error(`${file}: HTTP ${r.status}. Is --public-dir set to the video folder?`);
          return r.json();
        })
        .then((data) => {
          loaded.set(url, data);
          return data;
        }),
    );
  }
  return pending.get(url) as Promise<T>;
};

const useJson = <T,>(file: string): T | null => {
  const url = staticFile(file);
  const [data, setData] = useState<T | null>(() => (loaded.get(url) as T | undefined) ?? null);
  const [handle] = useState(() => delayRender(`Loading ${file}`));
  useEffect(() => {
    loadJson<T>(file)
      .then((d) => {
        setData(d);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [file, handle]);
  return data;
};

export const loadTiming = () => loadJson<Timing>("timing.json");

const ChapterBar = ({ timing, labels }: { timing: Timing; labels: Record<string, string> }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 65,
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 30px",
        fontFamily: FONT_BODY,
      }}
    >
      {timing.sections.map((s) => {
        const end = s.start_frame + s.duration_frames;
        const active = frame >= s.start_frame && frame < end;
        const past = frame >= end;
        return (
          <div
            key={s.name}
            style={{
              flex: s.duration_frames,
              height: 38,
              borderRadius: 19,
              position: "relative",
              overflow: "hidden",
              background: active ? C.greenText : C.canvas,
              border: active ? "none" : `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {active && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${((frame - s.start_frame) / s.duration_frames) * 100}%`,
                  background: "rgba(255,255,255,0.25)",
                }}
              />
            )}
            <span
              style={{
                position: "relative",
                fontSize: 19,
                fontWeight: active ? 700 : 500,
                color: active ? "#ffffff" : past ? C.text : C.muted,
                whiteSpace: "nowrap",
              }}
            >
              {labels[s.name] ?? s.label}
            </span>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 3,
          width: `${(frame / timing.total_frames) * 100}%`,
          background: C.green,
        }}
      />
    </div>
  );
};

const Subtitles = ({ cues }: { cues: Cue[] }) => {
  const t = useCurrentFrame() / FPS;
  const cue = cues.find((c) => t >= c.start && t <= c.end);
  if (!cue) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 83,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1700,
          padding: "7px 24px",
          borderRadius: 12,
          background: "rgba(255, 255, 255, 0.94)",
          fontFamily: FONT_BODY,
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1.4,
          color: C.text,
          textAlign: "center",
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};

/** Brand-green wipe that fully covers the frame exactly at each chapter cut. */
const Wipe = ({ cuts }: { cuts: number[] }) => {
  const frame = useCurrentFrame();
  const cut = cuts.find((c) => Math.abs(frame - c) <= 13);
  if (cut === undefined) return null;
  const p = interpolate(frame, [cut - 13, cut + 13], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "-20%",
        width: "140%",
        transform: `translateX(${interpolate(p, [0, 1], [-125, 125])}%)`,
        background: `linear-gradient(90deg, ${C.green}, ${C.greenText} 50%, ${C.green})`,
      }}
    />
  );
};

const MissingScene = ({ name }: { name: string }) => (
  <AbsoluteFill
    style={{
      background: C.danger,
      color: "#ffffff",
      fontFamily: FONT_BODY,
      fontSize: 60,
      fontWeight: 700,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    No scene for [SECTION:{name}]
  </AbsoluteFill>
);

/**
 * One scene per [SECTION:name] in podcast.txt, cut to the narration. The same
 * composition renders every language: pass text for each with useL().
 * `scenes` and `chapters` are keyed by section name; `badge` is the short
 * label shown top-right on every scene.
 */
export const ExplainerVideo = ({
  scenes,
  chapters,
  badge,
}: {
  scenes: Record<string, React.FC>;
  chapters: Record<Lang, Record<string, string>>;
  badge: Record<Lang, string>;
}) => {
  const { width } = useVideoConfig();
  const timing = useJson<Timing>("timing.json");
  const cues = useJson<Cue[]>("cues.json");
  const marks = useJson<Record<string, number>>("marks.json");
  if (!timing || !cues || !marks) return null;

  return (
    <AbsoluteFill style={{ backgroundColor: C.surface }}>
      <AbsoluteFill style={{ transform: `scale(${width / 1920})`, transformOrigin: "top left" }}>
        <div style={{ width: 1920, height: 1080, position: "relative", overflow: "hidden" }}>
          <LangContext.Provider value={timing.lang ?? "zh"}>
            <Marks.Provider value={marks}>
              <Badge.Provider value={badge[timing.lang ?? "zh"]}>
                {timing.sections.map((s) => {
                  const SceneComponent = scenes[s.name];
                  return (
                    <Sequence
                      key={s.name}
                      from={s.start_frame}
                      durationInFrames={s.duration_frames}
                    >
                      <T0.Provider value={s.start_frame / FPS}>
                        {SceneComponent ? <SceneComponent /> : <MissingScene name={s.name} />}
                      </T0.Provider>
                    </Sequence>
                  );
                })}
              </Badge.Provider>
            </Marks.Provider>
          </LangContext.Provider>
          <Wipe cuts={timing.sections.slice(1).map((s) => s.start_frame)} />
          <Subtitles cues={cues} />
          <ChapterBar timing={timing} labels={chapters[timing.lang ?? "zh"]} />
        </div>
      </AbsoluteFill>
      <Audio src={staticFile("podcast_audio.wav")} />
    </AbsoluteFill>
  );
};
