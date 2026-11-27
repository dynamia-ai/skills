/**
 * Example composition: "一张 GPU 跑两个 AI 服务：性能和故障影响有什么变化？"
 * Six scenes, one per [SECTION:name] in podcast.txt.
 *
 * One composition renders both languages: every at("marker") refers to a
 * {marker} tag in zh/podcast.txt and en/podcast.txt, and all on-screen text
 * goes through L(中文, English).
 */
import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import {
  BookOpen,
  CheckCircle2,
  Cpu,
  Gauge,
  Layers,
  PieChart,
  Share2,
  ShieldCheck,
  TriangleAlert,
  XCircle,
  Zap,
} from "lucide-react";
import { MASCOT } from "../../hami/assets";
import { HAMI as C } from "../../hami/brand";
import { ExplainerVideo } from "../../hami/chrome";
import { FONT_DISPLAY } from "../../hami/fonts";
import {
  Appear,
  BusyDots,
  CLAMP,
  Focus,
  Mark,
  Pill,
  Pop,
  Scene,
  card,
  useAppear,
  useAt,
  useL,
  usePop,
  useProgress,
} from "../../hami/kit";

const ServiceTile = ({
  label,
  color,
  style,
  busy,
}: {
  label: string;
  color: string;
  style?: React.CSSProperties;
  busy?: number;
}) => (
  <div
    style={{
      background: color,
      color: "#ffffff",
      borderRadius: 14,
      padding: "14px 0",
      fontSize: 26,
      fontWeight: 700,
      textAlign: "center",
      ...style,
    }}
  >
    {label}
    {busy !== undefined && <BusyDots phase={busy} />}
  </div>
);

// ---------- 1. hero ----------

const Hero = () => {
  const at = useAt();
  const L = useL();
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 25) * 8;
  return (
    <Scene glow={[C.green, C.blue]}>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 190,
          width: 1010,
          height: 660,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Appear
          at={0}
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 100,
            fontWeight: 800,
            lineHeight: 1.2,
            color: C.heading,
          }}
        >
          {L("一张", "One")}{" "}
          <Mark at={16} color={C.green}>
            <span style={{ color: C.greenText }}>GPU</span>
          </Mark>
          <br />
          {L("跑两个 AI 服务", "two AI services")}
        </Appear>
        <Appear at={at("q-speed")} axis="x" distance={60} style={{ marginTop: 48 }}>
          <div
            style={{
              ...card(C.blue),
              padding: "24px 36px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <Gauge size={60} color={C.blueText} />
            <span style={{ fontSize: 42, fontWeight: 700 }}>
              {L("速度会变慢吗？", "Do they slow each other down?")}
            </span>
          </div>
        </Appear>
        <Appear at={at("q-fault")} axis="x" distance={60} style={{ marginTop: 28 }}>
          <div
            style={{
              ...card(C.danger),
              padding: "24px 36px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <TriangleAlert size={60} color={C.dangerText} />
            <span style={{ fontSize: 42, fontWeight: 700 }}>
              {L("一个出故障，另一个会被连累吗？", "If one crashes, is the other affected?")}
            </span>
          </div>
        </Appear>
      </div>

      <Appear at={8} style={{ position: "absolute", left: 1210, top: 250, width: 590 }}>
        <div
          style={{
            ...card(C.green),
            padding: "36px 40px 44px",
            transform: `translateY(${float}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
            <Cpu size={64} color={C.greenText} />
            <span style={{ fontSize: 44, fontWeight: 800 }}>{L("一张 GPU", "One GPU")}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <ServiceTile
              label={L("AI 服务 A", "AI service A")}
              color={C.blueText}
              style={{ padding: "34px 0 30px", fontSize: 34 }}
              busy={0}
            />
            <ServiceTile
              label={L("AI 服务 B", "AI service B")}
              color={C.purpleText}
              style={{ padding: "34px 0 30px", fontSize: 34 }}
              busy={2}
            />
          </div>
        </div>
      </Appear>
      <Appear
        at={at("intro-hami")}
        style={{
          position: "absolute",
          left: 1210,
          top: 640,
          width: 590,
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        <Img src={MASCOT.glasses} style={{ height: 210 }} />
        <div>
          <div
            style={{ fontSize: L(44, 38), fontWeight: 800, lineHeight: 1.2, color: C.greenDeep }}
          >
            {L("HAMi 社区实测", "Tested by the HAMi community")}
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: C.muted, marginTop: 10 }}>
            {L("3 分钟讲明白", "Explained in 3 minutes")}
          </div>
        </div>
      </Appear>
    </Scene>
  );
};

// ---------- 2. setup ----------

const DiagramBox = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      height: 210,
      borderRadius: 20,
      border: `3px dashed ${C.border}`,
      background: "#ffffff",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 12,
      position: "relative",
    }}
  >
    {children}
  </div>
);

const GpuBar = () => (
  <div
    style={{
      background: C.text,
      color: "#ffffff",
      borderRadius: 12,
      padding: "10px 0",
      fontSize: 24,
      fontWeight: 700,
      textAlign: "center",
      letterSpacing: 2,
    }}
  >
    GPU
  </div>
);

const MethodCard = ({
  at,
  until,
  index,
  color,
  icon,
  title,
  titleSize,
  desc,
  children,
}: {
  at: number;
  until: number;
  index: number;
  color: string;
  icon: React.ReactNode;
  title: string;
  titleSize: number;
  desc: string;
  children: React.ReactNode;
}) => (
  <Focus from={at} to={until}>
    <Appear
      at={at}
      style={{ ...card(color), padding: "34px 40px 36px", height: "100%", boxSizing: "border-box" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
        {icon}
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: titleSize, fontWeight: 800 }}>
          {title}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 40, fontWeight: 800, color, opacity: 0.9 }}>
          0{index}
        </span>
      </div>
      {children}
      <div
        style={{ fontSize: 33, fontWeight: 600, lineHeight: 1.45, marginTop: 26, color: C.text }}
      >
        {desc}
      </div>
    </Appear>
  </Focus>
);

const QUOTA: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: C.greenDeep,
  textAlign: "center",
  marginTop: 8,
};

const Setup = () => {
  const at = useAt();
  const L = useL();
  const frame = useCurrentFrame();
  // Native sharing: the driver time-slices, so the two services take turns.
  const turn = (Math.sin(frame / 7) + 1) / 2;
  return (
    <Scene title={L("先看怎么测", "How we tested")} glow={[C.blue, C.green]}>
      <div
        style={{
          position: "absolute",
          top: 218,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <Pop at={at("gpu")}>
          <Pill color={C.green}>{L("1 张 NVIDIA A100", "1 × NVIDIA A100")}</Pill>
        </Pop>
        <Pop at={at("models")}>
          <Pill color={C.blue}>{L("2 个 Qwen3-4B 模型服务", "2 × Qwen3-4B services")}</Pill>
        </Pop>
        <Pop at={at("methods")}>
          <Pill color={C.purple}>{L("3 种共用方式", "3 ways to share")}</Pill>
        </Pop>
      </div>
      <div
        style={{
          position: "absolute",
          top: 318,
          left: 110,
          width: 1700,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 36,
        }}
      >
        <MethodCard
          at={at("native")}
          until={at("hami")}
          index={1}
          titleSize={L(46, 38)}
          color={C.blue}
          icon={<Layers size={60} color={C.blueText} />}
          title={L("原生共用", "Native sharing")}
          desc={L(
            "什么都不加，两个服务直接挤在一张卡上",
            "Nothing added. Both services just run on the same card.",
          )}
        >
          <DiagramBox>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ServiceTile
                label={L("服务 A", "Service A")}
                color={C.blueText}
                style={{ width: 230, opacity: 0.45 + 0.55 * turn }}
              />
              <ServiceTile
                label={L("服务 B", "Service B")}
                color={C.purpleText}
                style={{
                  width: 230,
                  marginLeft: -40,
                  marginTop: 22,
                  opacity: 0.45 + 0.55 * (1 - turn),
                }}
              />
            </div>
            <GpuBar />
          </DiagramBox>
        </MethodCard>
        <MethodCard
          at={at("hami")}
          until={at("mps")}
          index={2}
          titleSize={L(46, 38)}
          color={C.green}
          icon={<PieChart size={60} color={C.greenText} />}
          title="HAMi"
          desc={L(
            "给每个服务划好配额，各用各的显存和算力",
            "Each service gets its own quota of memory and compute.",
          )}
        >
          <DiagramBox>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <div style={{ paddingRight: 12, borderRight: `4px solid ${C.green}` }}>
                <ServiceTile label={L("服务 A", "Service A")} color={C.blueText} />
                <Pop at={at("quota")} style={QUOTA}>
                  {L("配额 50%", "50% quota")}
                </Pop>
              </div>
              <div style={{ paddingLeft: 12 }}>
                <ServiceTile label={L("服务 B", "Service B")} color={C.purpleText} />
                <Pop at={at("quota") + 5} style={QUOTA}>
                  {L("配额 50%", "50% quota")}
                </Pop>
              </div>
            </div>
            <GpuBar />
          </DiagramBox>
        </MethodCard>
        <MethodCard
          at={at("mps")}
          until={at("mps") + 9000}
          index={3}
          titleSize={L(46, 38)}
          color={C.purple}
          icon={<Share2 size={60} color={C.purpleText} />}
          title="NVIDIA MPS"
          desc={L(
            "多个程序通过同一个共享服务来使用 GPU",
            "Programs reach the GPU through one shared service.",
          )}
        >
          <DiagramBox>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ServiceTile
                label={L("服务 A", "Service A")}
                color={C.blueText}
                style={{ padding: "8px 0" }}
              />
              <ServiceTile
                label={L("服务 B", "Service B")}
                color={C.purpleText}
                style={{ padding: "8px 0" }}
              />
            </div>
            <div
              style={{
                border: `3px solid ${C.purple}`,
                backgroundColor: `${C.purple}22`,
                backgroundImage: `linear-gradient(90deg, transparent, ${C.purple}77, transparent)`,
                backgroundSize: "45% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: `${((frame * 3) % 190) - 45}% 0`,
                borderRadius: 12,
                padding: "6px 0",
                fontSize: 24,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {L("MPS 共享服务", "MPS shared service")}
            </div>
            <GpuBar />
          </DiagramBox>
        </MethodCard>
      </div>
    </Scene>
  );
};

// ---------- 3. speed ----------

const BAR_MAX = 460;

const Bar = ({
  label,
  value,
  color,
  at,
  winnerAt,
}: {
  label: string;
  value: number;
  color: string;
  at: number;
  winnerAt?: number;
}) => {
  const frame = useCurrentFrame();
  const p = useProgress(at, 36);
  const win =
    winnerAt === undefined ? 0 : interpolate(frame, [winnerAt, winnerAt + 10], [0, 1], CLAMP);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        height: 62,
        margin: "0 -14px",
        padding: "0 14px",
        borderRadius: 16,
        background: win > 0 ? `rgba(124, 140, 255, ${0.16 * win})` : undefined,
      }}
    >
      <div style={{ width: 150, fontSize: 30, fontWeight: 700, textAlign: "right" }}>{label}</div>
      <div
        style={{ flex: 1, height: 46, background: C.canvas, borderRadius: 12, overflow: "hidden" }}
      >
        <div
          style={{
            width: `${(value / BAR_MAX) * 100 * p}%`,
            height: "100%",
            borderRadius: 12,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
          }}
        />
      </div>
      <div
        style={{ width: 84, fontSize: 32 + 6 * win, fontWeight: 800, color: C.text, opacity: p }}
      >
        {Math.round(value * p)}
      </div>
    </div>
  );
};

/** Tiny demo of how each mode runs: record-then-replay vs one step at a time. */
const StepsDemo = ({
  mode,
  start,
  replayAt = 0,
  end,
  color,
}: {
  mode: "replay" | "step";
  start: number;
  replayAt?: number;
  end: number;
  color: string;
}) => {
  const L = useL();
  const frame = useCurrentFrame();
  const visible = interpolate(frame, [start, start + 8, end - 10, end], [0, 1, 1, 0], CLAMP);
  if (visible <= 0) return null;
  const replaying = mode === "replay" && frame >= replayAt;
  const caption =
    mode === "step"
      ? L("每一步都要单独提交", "Every step is submitted separately")
      : replaying
        ? L("② 之后直接回放", "② Then replay them")
        : L("① 提前把步骤录好", "① Record the steps once");
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 44, opacity: visible }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: C.muted, marginBottom: 16 }}>
        {caption}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[0, 1, 2, 3].map((i) => {
          let shown = 1;
          let lit = false;
          if (mode === "replay") {
            shown = interpolate(frame, [start + 10 + i * 17, start + 18 + i * 17], [0, 1], CLAMP);
            const t = (frame - replayAt - i * 4 + 400) % 28;
            lit = replaying && t >= 0 && t < 9;
          } else {
            const t = frame - (start + 12 + i * 16);
            lit = t >= 0 && t < 16;
          }
          return (
            <div
              key={i}
              style={{
                height: 72,
                borderRadius: 16,
                border: `3px solid ${color}`,
                background: lit ? color : `${color}1c`,
                color: lit ? "#ffffff" : C.text,
                fontSize: 28,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: shown,
                transform: `scale(${lit ? 1.05 : 1})`,
              }}
            >
              {L("步骤", "Step")} {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SpeedPanel = ({
  at,
  until,
  release,
  barsAt,
  winnerAt,
  color,
  icon,
  mode,
  hint,
  nativeLabel,
  values,
  demo,
  children,
}: {
  at: number;
  until: number;
  release?: number;
  barsAt: number;
  winnerAt?: number;
  color: string;
  icon: React.ReactNode;
  mode: string;
  hint: string;
  nativeLabel: string;
  values: [number, number, number];
  demo: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Focus from={at} to={until} release={release}>
    <Appear
      at={at}
      style={{ ...card(color), padding: "30px 40px 32px", height: 548, position: "relative" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {icon}
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 800 }}>{mode}</span>
        <span style={{ fontSize: 30, fontWeight: 600, color: C.muted, marginLeft: 8 }}>{hint}</span>
      </div>
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
        <Bar label={nativeLabel} value={values[0]} color={C.blue} at={barsAt} />
        <Bar label="HAMi" value={values[1]} color={C.green} at={barsAt + 5} />
        <Bar label="MPS" value={values[2]} color={C.purple} at={barsAt + 10} winnerAt={winnerAt} />
      </div>
      <div
        style={{
          marginTop: 26,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        {children}
      </div>
      {demo}
    </Appear>
  </Focus>
);

const Speed = () => {
  const at = useAt();
  const L = useL();
  return (
    <Scene title={L("先比速度", "Speed first")} glow={[C.purple, C.green]}>
      <div
        style={{
          position: "absolute",
          top: 216,
          left: 110,
          width: 1700,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
        }}
      >
        <SpeedPanel
          at={at("graph")}
          until={at("eager")}
          release={at("speed-takeaway")}
          barsAt={at("graph-result")}
          winnerAt={at("mps-faster")}
          color={C.purple}
          icon={<Zap size={60} color={C.purpleText} />}
          mode={L("Graph 模式", "Graph mode")}
          hint={L("步骤提前录好，直接回放", "record once, then replay")}
          nativeLabel={L("原生共用", "Native")}
          values={[336, 336, 449]}
          demo={
            <StepsDemo
              mode="replay"
              start={at("record")}
              replayAt={at("replay")}
              end={at("graph-gain") - 8}
              color={C.purple}
            />
          }
        >
          <Pop at={at("graph-gain")} style={{ transformOrigin: "left center" }}>
            <Pill color={C.purple} size={32}>
              {L("MPS 比原生共用高约 25%～38%", "MPS: about 25–38% above native")}
            </Pill>
          </Pop>
          <Pop at={at("graph-hami")} style={{ transformOrigin: "left center" }}>
            <Pill color={C.green} size={32}>
              {L("HAMi 与原生共用基本持平", "HAMi: about the same as native")}
            </Pill>
          </Pop>
        </SpeedPanel>
        <SpeedPanel
          at={at("eager")}
          until={at("eager") + 9000}
          barsAt={at("eager-result")}
          color={C.blue}
          icon={<Gauge size={60} color={C.blueText} />}
          mode={L("Eager 模式", "Eager mode")}
          hint={L("一步一步提交计算", "one step at a time")}
          nativeLabel={L("原生共用", "Native")}
          values={[186, 182, 189]}
          demo={
            <StepsDemo
              mode="step"
              start={at("eager") + 14}
              end={at("eager-mps") - 9}
              color={C.blue}
            />
          }
        >
          <Pop at={at("eager-mps")} style={{ transformOrigin: "left center" }}>
            <Pill color={C.purple} size={32}>
              {L("MPS 与原生共用很接近", "MPS: close to native")}
            </Pill>
          </Pop>
          <Pop at={at("eager-hami")} style={{ transformOrigin: "left center" }}>
            <Pill color={C.green} size={32}>
              {L("HAMi 有约 2%～8% 的开销", "HAMi: roughly 2–8% overhead")}
            </Pill>
          </Pop>
        </SpeedPanel>
      </div>
      <Appear
        at={at("speed-takeaway")}
        style={{
          position: "absolute",
          top: 784,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 44,
          fontWeight: 800,
        }}
      >
        {L("谁快谁慢，和", "Which is faster depends on ")}
        <Mark at={at("run-mode")} color={C.green}>
          <span style={{ color: C.greenText }}>{L("程序的运行方式", "how your program runs")}</span>
        </Mark>
        {L("关系很大", "")}
      </Appear>
      <Appear
        at={at("graph-result")}
        distance={0}
        style={{
          position: "absolute",
          top: 858,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 24,
          fontWeight: 500,
          color: C.muted,
        }}
      >
        {L(
          "柱状图：固定缓存测试，两个服务合计每秒生成 token 数 · 百分比综合两组测试结果",
          "Bars: fixed-cache test, output tokens per second for both services combined · Percentages span both test groups",
        )}
      </Appear>
    </Scene>
  );
};

// ---------- 4. fault ----------

const FAULTS = [
  ["显存超额申请", "Memory over-request"],
  ["非法写入显存", "Illegal memory write"],
  ["GPU 异常指令", "GPU trap"],
  ["强制杀掉进程", "Force-killed process"],
] as const;

const Cell = ({ ok, at }: { ok: boolean; at: number }) => {
  const L = useL();
  const frame = useCurrentFrame();
  const pop = usePop(at);
  const shake = ok
    ? 0
    : Math.sin((frame - at) * 1.5) * interpolate(frame, [at, at + 18], [8, 0], CLAMP);
  const color = ok ? C.greenText : C.dangerText;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: pop.opacity,
        transform: `translateX(${shake}px) ${pop.transform}`,
      }}
    >
      {ok ? <CheckCircle2 size={56} color={color} /> : <XCircle size={56} color={color} />}
      <span style={{ fontSize: 34, fontWeight: 800, color }}>
        {ok ? L("2/2 正常", "2/2 OK") : L("0/2 受影响", "0/2 affected")}
      </span>
    </div>
  );
};

const Ring = ({ at }: { at: number }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 28], [0, 1], CLAMP);
  if (p <= 0 || p >= 1) return null;
  const size = 140 + p * 420;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "40%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        border: `6px solid ${C.danger}`,
        opacity: (1 - p) * 0.7,
      }}
    />
  );
};

const FaultStory = () => {
  const at = useAt();
  const L = useL();
  const frame = useCurrentFrame();
  const crash = useProgress(at("crash"), 12);
  const out = interpolate(frame, [at("faults") - 13, at("faults") - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = crash > 0 && crash < 1 ? Math.sin(frame * 2.2) * 8 : 0;
  return (
    <div style={{ position: "absolute", top: 230, left: 260, width: 1400, opacity: out }}>
      <Appear at={at("story")} style={{ ...card(C.green), padding: "36px 48px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
          <Cpu size={64} color={C.greenText} />
          <span style={{ fontSize: 44, fontWeight: 800 }}>{L("同一张 GPU", "The same GPU")}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div
            style={{
              borderRadius: 24,
              padding: "36px 40px",
              height: 360,
              background: crash > 0.5 ? `${C.danger}1f` : `${C.blue}1c`,
              border: `4px solid ${crash > 0.5 ? C.danger : C.blue}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              transform: `translateX(${shake}px)`,
              position: "relative",
            }}
          >
            <Ring at={at("crash")} />
            <Ring at={at("crash") + 9} />
            {crash > 0.5 ? (
              <XCircle size={130} color={C.dangerText} />
            ) : (
              <BookOpen size={130} color={C.blueText} />
            )}
            <div style={{ fontSize: 46, fontWeight: 800 }}>
              {L("知识助手", "Knowledge assistant")}
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.dangerText, opacity: crash }}>
              {L("崩了！", "Crashed!")}
            </div>
          </div>
          <div
            style={{
              borderRadius: 24,
              padding: "36px 40px",
              height: 360,
              background: `${C.green}1c`,
              border: `4px solid ${C.green}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <Img src={MASCOT.service} style={{ height: 150 }} />
            <div style={{ fontSize: 46, fontWeight: 800 }}>{L("在线客服", "Customer service")}</div>
            <Appear
              at={at("still-ok")}
              style={{ fontSize: 34, fontWeight: 700, color: C.greenDeep }}
            >
              {L("还能正常工作吗？", "Still working?")}
            </Appear>
          </div>
        </div>
      </Appear>
    </div>
  );
};

const FaultTable = () => {
  const at = useAt();
  const L = useL();
  const frame = useCurrentFrame();
  const tableIn = useAppear(at("faults"));
  const spot = [
    [at("f1"), at("serious") - 6],
    [at("f2"), at("f3")],
    [at("f3"), at("f4")],
    [at("f4"), at("pass") - 15],
  ].map(([a, b]) => interpolate(frame, [a, a + 6, b, b + 8], [0, 1, 1, 0], CLAMP));
  const rowAt = [at("f1"), at("f2"), at("f3"), at("f4")];
  const cols = "520px 1fr 1fr 1fr";
  const head = (label: string, color: string) => (
    <div style={{ fontSize: 36, fontWeight: 800, color, textAlign: "center" }}>{label}</div>
  );
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 214,
          left: 110,
          width: 1700,
          ...card(C.border),
          boxShadow: "0 10px 28px rgba(17,31,44,0.08)",
          padding: "20px 36px 14px",
          ...tableIn,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            alignItems: "center",
            height: 70,
            borderBottom: `3px solid ${C.border}`,
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 700, color: C.muted }}>
            {L("故意制造的故障", "Failure we triggered")}
          </div>
          {head(L("原生共用", "Native sharing"), C.blueText)}
          {head("HAMi", C.greenText)}
          {head("MPS v3", C.purpleText)}
        </div>
        {FAULTS.map(([zh, en], i) => (
          <div
            key={zh}
            style={{
              display: "grid",
              gridTemplateColumns: cols,
              alignItems: "center",
              height: 92,
              borderBottom: i < FAULTS.length - 1 ? `2px solid ${C.canvas}` : undefined,
              margin: "0 -18px",
              padding: "0 18px",
              borderRadius: 18,
              background:
                i === 0
                  ? `rgba(245, 185, 66, ${0.2 * spot[i]})`
                  : `rgba(255, 92, 122, ${0.14 * spot[i]})`,
            }}
          >
            <Appear
              at={rowAt[i]}
              distance={12}
              style={{ display: "flex", alignItems: "center", gap: 20 }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: i === 0 ? C.warn : C.danger,
                  color: "#ffffff",
                  fontSize: 30,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 38, fontWeight: 700 }}>{L(zh, en)}</span>
            </Appear>
            <Cell ok at={i === 0 ? at("f1-ok") : at("pass") + (i - 1) * 6} />
            <Cell ok at={i === 0 ? at("f1-ok") + 5 : at("pass") + 3 + (i - 1) * 6} />
            <Cell ok={i === 0} at={i === 0 ? at("f1-ok") + 10 : at("mps-result") + (i - 1) * 6} />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 716,
          left: 110,
          width: 1700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <Appear at={at("pass-all")} style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>
          {L("三类严重故障，共 6 次：", "Three severe failures, 6 runs:")}
        </Appear>
        <Pop at={at("pass-all")}>
          <Pill color={C.blue} size={34}>
            {L("原生共用 6/6", "Native 6/6")}
          </Pill>
        </Pop>
        <Pop at={at("pass-all") + 5}>
          <Pill color={C.greenText} size={34} solid>
            <ShieldCheck size={40} color="#ffffff" />
            HAMi 6/6
          </Pill>
        </Pop>
        <Pop at={at("mps-all")}>
          <Pill color={C.danger} size={34}>
            MPS v3 0/6
          </Pill>
        </Pop>
      </div>
      <Appear
        at={at("caveat")}
        style={{
          position: "absolute",
          top: 808,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 32,
          fontWeight: 600,
          color: C.muted,
        }}
      >
        {L(
          "仅代表这几种指定故障 · 程序正常退出时，MPS 不会影响其他程序",
          "Only these specific failures · When a program exits normally, MPS does not affect the others",
        )}
      </Appear>
    </>
  );
};

const Fault = () => {
  const L = useL();
  return (
    <Scene title={L("再看故障", "Now, failures")} glow={[C.danger, C.green]}>
      <FaultStory />
      <FaultTable />
    </Scene>
  );
};

// ---------- 5. choose ----------

const ChoiceCard = ({
  at,
  until,
  release,
  resultAt,
  color,
  deep,
  icon,
  ifYou,
  lines,
  result,
}: {
  at: number;
  until: number;
  release?: number;
  resultAt: number;
  color: string;
  deep: string;
  icon: React.ReactNode;
  ifYou: string;
  lines: string[];
  result: string;
}) => (
  <Focus from={at} to={until} release={release}>
    <Appear at={at} style={{ ...card(color), padding: "36px 48px 40px", height: 392 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 22 }}>
        {icon}
        <span style={{ fontSize: 30, fontWeight: 700, color: C.muted }}>{ifYou}</span>
      </div>
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.4 }}>
          {l}
        </div>
      ))}
      <Pop
        at={resultAt}
        style={{ marginTop: 28, transformOrigin: "left center", display: "inline-block" }}
      >
        <Pill color={deep} solid size={38}>
          {result}
        </Pill>
      </Pop>
    </Appear>
  </Focus>
);

const Choose = () => {
  const at = useAt();
  const L = useL();
  const frame = useCurrentFrame();
  const shine = interpolate(frame, [at("both") + 7, at("both") + 7 + 34], [-260, 1800], CLAMP);
  return (
    <Scene title={L("那该怎么选？", "So how do you choose?")} glow={[C.green, C.purple]}>
      <div
        style={{
          position: "absolute",
          top: 216,
          left: 110,
          width: 1700,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
        }}
      >
        <ChoiceCard
          at={at("if-speed")}
          until={at("if-quota")}
          release={at("both")}
          resultAt={at("pick-mps")}
          color={C.purple}
          deep={C.purpleText}
          icon={<Zap size={72} color={C.purpleText} />}
          ifYou={L("如果你", "If you")}
          lines={L(
            ["更看重速度", "能接受故障时互相影响"],
            ["put speed first", "can accept failures spreading"],
          )}
          result={L("→ 重点评估 MPS", "→ Take a close look at MPS")}
        />
        <ChoiceCard
          at={at("if-quota")}
          until={at("if-quota") + 9000}
          resultAt={at("pick-hami")}
          color={C.green}
          deep={C.greenText}
          icon={<ShieldCheck size={72} color={C.greenText} />}
          ifYou={L("如果你", "If you")}
          lines={L(
            ["需要管理资源配额", "希望故障时互不牵连"],
            ["need resource quotas", "want failures kept apart"],
          )}
          result={L("→ 评估 HAMi", "→ Evaluate HAMi")}
        />
      </div>
      <Appear
        at={at("both")}
        style={{
          position: "absolute",
          top: 640,
          left: 110,
          width: 1700,
          height: 112,
          borderRadius: 28,
          background: `linear-gradient(90deg, ${C.greenText}, ${C.purpleText})`,
          boxShadow: `0 10px 28px ${C.green}33`,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: shine,
            width: 220,
            transform: "skewX(-20deg)",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />
        <span style={{ fontSize: 44, fontWeight: 800 }}>{L("不是二选一", "Not either-or")}</span>
        <Appear at={at("plan")} distance={0} style={{ fontSize: 38, fontWeight: 700 }}>
          {L(
            "HAMi 计划在 2.12 版本集成 MPS v3，按需灵活选择",
            "HAMi plans to add MPS v3 in 2.12: choose per workload",
          )}
        </Appear>
      </Appear>
      <Appear
        at={at("limits")}
        style={{
          position: "absolute",
          top: 782,
          left: 110,
          width: 1700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          padding: "18px 0",
          borderRadius: 24,
          background: `${C.warn}22`,
          border: `3px solid ${C.warn}`,
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        <TriangleAlert size={56} color={C.warnText} />
        {L(
          "结果仅对应特定硬件、模型和版本，选型请结合自己的业务实测",
          "Results cover specific hardware, models and versions. Test with your own workload.",
        )}
      </Appear>
    </Scene>
  );
};

// ---------- 6. outro ----------

const Outro = () => {
  const at = useAt();
  const L = useL();
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 22) * 8;
  return (
    <Scene glow={[C.green, C.blue]}>
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          height: 760,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Appear
          at={0}
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 80,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.25,
            color: C.heading,
          }}
        >
          {L("报告、脚本、数据", "Report, scripts, data:")}{" "}
          <Mark at={at("open")} color={C.green}>
            <span style={{ color: C.greenText }}>{L("全部开源", "all open source")}</span>
          </Mark>
        </Appear>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            marginTop: 48,
          }}
        >
          <Pop at={at("links")}>
            <Pill color={C.green} size={40}>
              project-hami.io
            </Pill>
          </Pop>
          <Pop at={at("links") + 8}>
            <Pill color={C.blue} size={36}>
              github.com/Project-HAMi/gpu-sharing-benchmarks
            </Pill>
          </Pop>
        </div>
        <Appear
          at={at("follow")}
          style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 56 }}
        >
          <Img src={MASCOT.balloon} style={{ height: 230, transform: `translateY(${float}px)` }} />
          <div>
            <div style={{ fontSize: 60, fontWeight: 800 }}>
              {L("关注 ", "Follow the ")}
              <span style={{ color: C.greenText }}>{L("HAMi 社区", "HAMi community")}</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 600, color: C.muted, marginTop: 8 }}>
              {L("我们下期见", "See you next time")}
            </div>
          </div>
        </Appear>
      </div>
    </Scene>
  );
};

// ---------- composition ----------

export const Video = () => (
  <ExplainerVideo
    badge={{ zh: "GPU 共享实测", en: "GPU sharing, tested" }}
    scenes={{ hero: Hero, setup: Setup, speed: Speed, fault: Fault, choose: Choose, outro: Outro }}
    chapters={{
      zh: {
        hero: "问题",
        setup: "怎么测",
        speed: "比速度",
        fault: "看故障",
        choose: "怎么选",
        outro: "了解更多",
      },
      en: {
        hero: "Question",
        setup: "Setup",
        speed: "Speed",
        fault: "Failures",
        choose: "Choosing",
        outro: "More",
      },
    }}
  />
);
