/**
 * Example image cards for the same content as the video: six cards that can be
 * read on a phone without sound. Rendered at 1080x1440 (小绿书) and 1080x1350
 * (LinkedIn), in both languages, by scripts/render_cards.py.
 */
import React from "react";
import { Img } from "remotion";
import {
  CheckCircle2,
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
import { CardFrame, CardLead, CardNote, CardPage, CardTitle } from "../../hami/cards";
import { FONT_DISPLAY } from "../../hami/fonts";
import { Pill, card, useL } from "../../hami/kit";

const Cover = () => {
  const L = useL();
  const { total } = React.useContext(CardPage);
  return (
    <CardFrame justify="center">
      <div>
        <Pill color={C.greenText} solid size={36}>
          {L("HAMi 社区实测", "Tested by the HAMi community")}
        </Pill>
      </div>
      <CardTitle size={L(108, 94)} style={{ marginTop: 36 }}>
        {L("一张 ", "Two AI services")}
        {L(<span style={{ color: C.greenText }}>GPU</span>, null)}
        <br />
        {L("跑两个 AI 服务", "on one ")}
        {L(null, <span style={{ color: C.greenText }}>GPU</span>)}
      </CardTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 56 }}>
        <div
          style={{
            ...card(C.blue),
            padding: "26px 34px",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Gauge size={64} color={C.blueText} />
          <span style={{ fontSize: 44, fontWeight: 700 }}>
            {L("速度会变慢吗？", "Do they slow each other down?")}
          </span>
        </div>
        <div
          style={{
            ...card(C.danger),
            padding: "26px 34px",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <TriangleAlert size={64} color={C.dangerText} />
          <span style={{ fontSize: 44, fontWeight: 700 }}>
            {L("一个出故障，另一个会被连累吗？", "If one crashes, is the other affected?")}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 56 }}>
        <Img src={MASCOT.glasses} style={{ height: 280 }} />
        <div style={{ fontSize: 44, fontWeight: 700, color: C.muted, lineHeight: 1.35 }}>
          {L(`实测结果，${total} 张图看懂`, `What we measured, in ${total} cards`)}
        </div>
      </div>
    </CardFrame>
  );
};

const Way = ({
  color,
  icon,
  name,
  desc,
}: {
  color: string;
  icon: React.ReactNode;
  name: string;
  desc: string;
}) => (
  <div
    style={{ ...card(color), padding: "32px 36px", display: "flex", alignItems: "center", gap: 32 }}
  >
    {icon}
    <div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 50, fontWeight: 800 }}>{name}</div>
      <div style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.4, marginTop: 8 }}>{desc}</div>
    </div>
  </div>
);

const Setup = () => {
  const L = useL();
  return (
    <CardFrame glow={[C.blue, C.green]}>
      <CardTitle>{L("先看怎么测", "How we tested")}</CardTitle>
      <CardLead>
        {L(
          "1 张 NVIDIA A100 · 2 个 Qwen3-4B 模型服务 · 3 种共用方式",
          "1 NVIDIA A100 · 2 Qwen3-4B services · 3 ways to share",
        )}
      </CardLead>
      <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 48 }}>
        <Way
          color={C.blue}
          icon={<Layers size={84} color={C.blueText} style={{ flexShrink: 0 }} />}
          name={L("原生共用", "Native sharing")}
          desc={L(
            "什么都不加，两个服务直接挤在一张卡上",
            "Nothing added. Both services just run on the same card.",
          )}
        />
        <Way
          color={C.green}
          icon={<PieChart size={84} color={C.greenText} style={{ flexShrink: 0 }} />}
          name="HAMi"
          desc={L(
            "给每个服务划好配额，各用各的显存和算力",
            "Each service gets its own quota of memory and compute.",
          )}
        />
        <Way
          color={C.purple}
          icon={<Share2 size={84} color={C.purpleText} style={{ flexShrink: 0 }} />}
          name="NVIDIA MPS"
          desc={L(
            "多个程序通过同一个共享服务来使用 GPU",
            "Programs reach the GPU through one shared service.",
          )}
        />
      </div>
    </CardFrame>
  );
};

const Bar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, height: 50 }}>
    <div style={{ width: 150, fontSize: 32, fontWeight: 700, textAlign: "right" }}>{label}</div>
    <div
      style={{ flex: 1, height: 36, background: C.canvas, borderRadius: 10, overflow: "hidden" }}
    >
      <div
        style={{
          width: `${(value / 460) * 100}%`,
          height: "100%",
          borderRadius: 10,
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
        }}
      />
    </div>
    <div style={{ width: 76, fontSize: 34, fontWeight: 800 }}>{value}</div>
  </div>
);

const SpeedPanel = ({
  color,
  icon,
  mode,
  hint,
  values,
  takeaway,
}: {
  color: string;
  icon: React.ReactNode;
  mode: string;
  hint: string;
  values: [number, number, number];
  takeaway: string;
}) => {
  const L = useL();
  return (
    <div style={{ ...card(color), padding: "26px 34px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
        {icon}
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 46, fontWeight: 800 }}>{mode}</span>
        <span style={{ fontSize: 30, fontWeight: 600, color: C.muted }}>{hint}</span>
      </div>
      <Bar label={L("原生共用", "Native")} value={values[0]} color={C.blue} />
      <Bar label="HAMi" value={values[1]} color={C.green} />
      <Bar label="MPS" value={values[2]} color={C.purple} />
      <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.35, marginTop: 14 }}>
        {takeaway}
      </div>
    </div>
  );
};

const Speed = () => {
  const L = useL();
  return (
    <CardFrame glow={[C.purple, C.green]}>
      <CardTitle size={L(76, 68)}>{L("比速度：看运行方式", "Speed depends on run mode")}</CardTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 36 }}>
        <SpeedPanel
          color={C.purple}
          icon={<Zap size={52} color={C.purpleText} />}
          mode={L("Graph 模式", "Graph mode")}
          hint={L("步骤录好后回放", "record once, replay")}
          values={[336, 336, 449]}
          takeaway={L(
            "MPS 比原生共用高约 25%～38%，HAMi 基本持平",
            "MPS: about 25–38% above native. HAMi: about the same.",
          )}
        />
        <SpeedPanel
          color={C.blue}
          icon={<Gauge size={52} color={C.blueText} />}
          mode={L("Eager 模式", "Eager mode")}
          hint={L("一步一步提交", "one step at a time")}
          values={[186, 182, 189]}
          takeaway={L(
            "MPS 与原生共用接近，HAMi 有约 2%～8% 的开销",
            "MPS: close to native. HAMi: roughly 2–8% overhead.",
          )}
        />
      </div>
      <div style={{ marginTop: 26 }}>
        <CardNote>
          {L(
            "柱状图：固定缓存测试，两个服务合计每秒生成 token 数。百分比综合两组测试结果。",
            "Bars: fixed-cache test, output tokens per second for both services combined. Percentages span both test groups.",
          )}
        </CardNote>
      </div>
    </CardFrame>
  );
};

const FAULTS = [
  ["显存超额申请", "Memory over-request", true],
  ["非法写入显存", "Illegal memory write", false],
  ["GPU 异常指令", "GPU trap", false],
  ["强制杀掉进程", "Force-killed process", false],
] as const;

const Result = ({ ok }: { ok: boolean }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
    {ok ? (
      <CheckCircle2 size={46} color={C.greenText} />
    ) : (
      <XCircle size={46} color={C.dangerText} />
    )}
    <span style={{ fontSize: 36, fontWeight: 800, color: ok ? C.greenText : C.dangerText }}>
      {ok ? "2/2" : "0/2"}
    </span>
  </div>
);

const Fault = () => {
  const L = useL();
  const cols = "1fr 170px 170px 170px";
  const head = (label: string, color: string) => (
    <div style={{ fontSize: 32, fontWeight: 800, color, textAlign: "center" }}>{label}</div>
  );
  return (
    <CardFrame glow={[C.danger, C.green]}>
      <CardTitle size={L(76, 68)}>{L("一个崩了，另一个呢？", "One crashes. The other?")}</CardTitle>
      <CardLead>
        {L(
          "同卡的健康程序是否保持正常？每种故障测 2 次",
          "Did the healthy program on the same card stay correct? 2 runs each.",
        )}
      </CardLead>
      <div
        style={{
          ...card(C.border),
          boxShadow: "0 10px 28px rgba(17,31,44,0.08)",
          padding: "14px 30px 6px",
          marginTop: 28,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            alignItems: "center",
            height: 76,
            borderBottom: `3px solid ${C.border}`,
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 700, color: C.muted }}>
            {L("故意制造的故障", "Failure we triggered")}
          </div>
          {head(L("原生共用", "Native"), C.blueText)}
          {head("HAMi", C.greenText)}
          {head("MPS v3", C.purpleText)}
        </div>
        {FAULTS.map(([zh, en, mpsOk], i) => (
          <div
            key={zh}
            style={{
              display: "grid",
              gridTemplateColumns: cols,
              alignItems: "center",
              height: 92,
              borderBottom: i < FAULTS.length - 1 ? `2px solid ${C.canvas}` : undefined,
            }}
          >
            <div style={{ fontSize: 38, fontWeight: 700 }}>{L(zh, en)}</div>
            <Result ok />
            <Result ok />
            <Result ok={mpsOk} />
          </div>
        ))}
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginTop: 26 }}
      >
        <span style={{ fontSize: 34, fontWeight: 700, color: C.muted, width: "100%" }}>
          {L("三类严重故障，共 6 次：", "Three severe failures, 6 runs:")}
        </span>
        <Pill color={C.blue} size={34}>
          {L("原生共用 6/6", "Native 6/6")}
        </Pill>
        <Pill color={C.greenText} size={34} solid>
          <ShieldCheck size={40} color="#ffffff" />
          HAMi 6/6
        </Pill>
        <Pill color={C.danger} size={34}>
          MPS v3 0/6
        </Pill>
      </div>
      <div style={{ marginTop: 22 }}>
        <CardNote>
          {L(
            "仅代表这几种指定故障。程序正常退出时，MPS 不会影响其他程序。",
            "This covers only these specific failures. When a program exits normally, MPS does not affect the others.",
          )}
        </CardNote>
      </div>
    </CardFrame>
  );
};

const Choice = ({
  color,
  deep,
  icon,
  lines,
  result,
}: {
  color: string;
  deep: string;
  icon: React.ReactNode;
  lines: string[];
  result: string;
}) => {
  const L = useL();
  return (
    <div style={{ ...card(color), padding: "24px 34px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 12 }}>
        {icon}
        <span style={{ fontSize: 32, fontWeight: 700, color: C.muted }}>
          {L("如果你", "If you")}
        </span>
      </div>
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.35 }}>
          {l}
        </div>
      ))}
      <div style={{ marginTop: 16 }}>
        <Pill color={deep} solid size={36}>
          {result}
        </Pill>
      </div>
    </div>
  );
};

const Choose = () => {
  const L = useL();
  return (
    <CardFrame glow={[C.green, C.purple]}>
      <CardTitle>{L("那该怎么选？", "So how do you choose?")}</CardTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 30 }}>
        <Choice
          color={C.purple}
          deep={C.purpleText}
          icon={<Zap size={64} color={C.purpleText} />}
          lines={L(
            ["更看重速度", "能接受故障时互相影响"],
            ["put speed first", "can accept failures spreading"],
          )}
          result={L("→ 重点评估 MPS", "→ Take a close look at MPS")}
        />
        <Choice
          color={C.green}
          deep={C.greenText}
          icon={<ShieldCheck size={64} color={C.greenText} />}
          lines={L(
            ["需要管理资源配额", "希望故障时互不牵连"],
            ["need resource quotas", "want failures kept apart"],
          )}
          result={L("→ 评估 HAMi", "→ Evaluate HAMi")}
        />
      </div>
      <div
        style={{
          marginTop: 22,
          padding: "20px 30px",
          borderRadius: 28,
          background: `linear-gradient(90deg, ${C.greenText}, ${C.purpleText})`,
          color: "#ffffff",
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1.35,
        }}
      >
        {L(
          "不是二选一：HAMi 计划在 2.12 版本集成 MPS v3",
          "Not either-or: HAMi plans to add MPS v3 in 2.12",
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        <CardNote>
          {L(
            "结果仅对应特定硬件、模型和版本，选型请结合自己的业务实测。",
            "Results cover specific hardware, models and versions. Test with your own workload.",
          )}
        </CardNote>
      </div>
    </CardFrame>
  );
};

const Closing = () => {
  const L = useL();
  return (
    <CardFrame justify="center" footer="github.com/Project-HAMi/HAMi">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <CardTitle size={L(92, 84)}>
          {L("报告、脚本、数据", "Report, scripts, data:")}
          <br />
          <span style={{ color: C.greenText }}>{L("全部开源", "all open source")}</span>
        </CardTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            marginTop: 52,
          }}
        >
          <Pill color={C.green} size={42}>
            project-hami.io
          </Pill>
          <Pill color={C.blue} size={34}>
            github.com/Project-HAMi/gpu-sharing-benchmarks
          </Pill>
        </div>
        <Img src={MASCOT.balloon} style={{ height: 340, marginTop: 56 }} />
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 60, fontWeight: 800, marginTop: 28 }}>
          {L("关注 ", "Follow the ")}
          <span style={{ color: C.greenText }}>{L("HAMi 社区", "HAMi community")}</span>
        </div>
        <div style={{ fontSize: 38, fontWeight: 600, color: C.muted, marginTop: 10 }}>
          {L("欢迎一起复现和验证", "Reproduce the results and tell us what you find")}
        </div>
      </div>
    </CardFrame>
  );
};

export const cards: React.FC[] = [Cover, Setup, Speed, Fault, Choose, Closing];
