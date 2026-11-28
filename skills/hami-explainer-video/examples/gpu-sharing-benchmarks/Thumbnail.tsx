import { AbsoluteFill, Img } from "remotion";
import { LOGO, MASCOT } from "../../hami/assets";
import { HAMI as C } from "../../hami/brand";
import { FONT_BODY, FONT_DISPLAY } from "../../hami/fonts";
import { useL } from "../../hami/kit";

// Cover image. It is shown about 300px wide in feeds, so only oversized type survives.
export const Thumbnail = ({ aspectRatio }: { aspectRatio: "16:9" | "4:3" }) => {
  const compact = aspectRatio === "4:3";
  const L = useL();
  return (
    <AbsoluteFill style={{ background: C.surface, fontFamily: FONT_BODY, color: C.text }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 15% 10%, ${C.green}33 0%, transparent 55%), radial-gradient(circle at 90% 95%, ${C.blue}2e 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: compact ? 26 : 34,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Img src={LOGO.horizontal} style={{ height: compact ? 120 : 140 }} />
          <div
            style={{
              fontSize: compact ? 48 : 56,
              fontWeight: 800,
              color: "#ffffff",
              background: C.greenText,
              borderRadius: 999,
              padding: "14px 44px",
            }}
          >
            {L("社区实测", "Community test")}
          </div>
        </div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: compact ? 128 : 150,
            fontWeight: 900,
            lineHeight: 1.18,
            textAlign: "center",
            color: C.heading,
          }}
        >
          {L("一张", "One")} <span style={{ color: C.greenText }}>GPU</span>
          <br />
          {L("跑两个 AI 服务", "two AI services")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Img src={MASCOT.glasses} style={{ height: compact ? 190 : 220 }} />
          <div style={{ fontSize: compact ? 64 : 80, fontWeight: 800, lineHeight: 1.3 }}>
            <span style={{ color: C.blueText }}>{L("会变慢吗？", "Slower?")}</span>
            <br />
            <span style={{ color: C.dangerText }}>
              {L("会被连累吗？", "One crash, both down?")}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
