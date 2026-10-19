import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import data from "./captions.json";

type Cap = { text: string; from: number; to: number };
type Sec = { start: number; end: number; captions: Cap[] };
const SECTIONS = (data as { total: number; sections: Sec[] }).sections;
export const TOTAL_SEC = (data as { total: number }).total + 1.2;

const C = {
  bg: "#07080B",
  panel: "rgba(255,255,255,0.045)",
  line: "rgba(255,255,255,0.10)",
  text: "#F4F2EC",
  mute: "#8E929B",
  gold: "#E8B64C",
  goldSoft: "rgba(232,182,76,0.16)",
  green: "#2FD27F",
  greenSoft: "rgba(47,210,127,0.15)",
  red: "#FF5263",
  redSoft: "rgba(255,82,99,0.15)",
  blue: "#4FA3FF",
};
const FD = "'Inter Display','Inter',sans-serif";
const FB = "'Inter',sans-serif";
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// Seconds since the scene started.
const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const prog = (t: number, at: number, dur = 0.6) =>
  interpolate(t, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const money = (n: number) => {
  const s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (n < 0 ? "−$" : "$") + s;
};

const In: React.FC<{ at: number; t: number; y?: number; x?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, t, y = 30, x = 0, style, children }) => {
  const k = prog(t, at);
  return <div style={{ opacity: k, transform: `translate(${mix(x, 0, k)}px, ${mix(y, 0, k)}px)`, ...style }}>{children}</div>;
};

const Panel: React.FC<{ style?: React.CSSProperties; children: React.ReactNode; tone?: string }> = ({ style, children, tone }) => (
  <div
    style={{
      background: tone ?? C.panel,
      border: `1.5px solid ${C.line}`,
      borderRadius: 28,
      padding: "28px 36px",
      boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Title: React.FC<{ t: number; at?: number; kicker?: string; children: React.ReactNode; color?: string }> = ({ t, at = 0, kicker, children, color }) => (
  <In at={at} t={t} style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center" }}>
    {kicker && (
      <div style={{ fontFamily: FB, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: color ?? C.gold, textTransform: "uppercase", marginBottom: 10 }}>{kicker}</div>
    )}
    <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 64, color: C.text, letterSpacing: -1 }}>{children}</div>
  </In>
);

const Big: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = C.text, size = 96, style }) => (
  <div style={{ fontFamily: FD, fontWeight: 900, fontSize: size, color, letterSpacing: -2, fontFeatureSettings: "'tnum'", lineHeight: 1, ...style }}>{children}</div>
);
const Small: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = C.mute, size = 30, style }) => (
  <div style={{ fontFamily: FB, fontWeight: 600, fontSize: size, color, ...style }}>{children}</div>
);

const Logo: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.22 }}>
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6D27A" />
          <stop offset="1" stopColor="#C8922A" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="24" fill="url(#lg)" />
      <path d="M22 66 L40 48 L52 58 L76 30" stroke="#07080B" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="76" cy="30" r="7" fill="#07080B" />
    </svg>
    <div style={{ fontFamily: FD, fontWeight: 900, fontSize: size * 0.62, color: C.text, letterSpacing: -1.5 }}>
      ScalperResss <span style={{ color: C.gold }}>AI</span>
    </div>
  </div>
);

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.25,
          transform: `translateY(${-(f * 0.15) % 80}px)`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(1100px 650px at 50% 35%, rgba(232,182,76,0.13), transparent 70%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------- scenes ----------
type SP = { cue: number[] };

const S1: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const pulse = 0.5 + 0.5 * Math.sin(t * 5);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 120, alignItems: "center" }}>
        <In at={0.1} t={t}>
          <div style={{ textAlign: "center" }}>
            <svg width="120" height="120" viewBox="0 0 100 100" style={{ marginBottom: 10 }}>
              <path d="M62 12a38 38 0 1 0 26 52A30 30 0 0 1 62 12z" fill={C.gold} />
            </svg>
            <Big size={190}>03:00</Big>
            <Small size={34} style={{ marginTop: 14 }}>Gije</Small>
          </div>
        </In>
        <In at={1.4} t={t} x={60} y={0}>
          <div style={{ width: 430, height: 560, borderRadius: 56, border: `3px solid ${C.line}`, background: "#101218", padding: 26, boxSizing: "border-box" }}>
            <Small size={24} style={{ textAlign: "center", marginBottom: 26 }}>03:00</Small>
            <div style={{ background: "#1A1D25", borderRadius: 24, padding: 22, border: `2px solid ${C.gold}`, boxShadow: `0 0 ${30 * pulse}px ${C.goldSoft}` }}>
              <Small size={22} color={C.gold}>📩 TÄZE SIGNAL</Small>
              <Big size={46} style={{ marginTop: 10 }}>XAUUSD</Big>
              <Small size={26} color={C.green} style={{ marginTop: 6 }}>SATYN AL · Altyn</Small>
            </div>
          </div>
        </In>
      </div>
      <In at={cue[1]} t={t} style={{ position: "absolute", top: 770, left: 0, right: 0, textAlign: "center" }}>
        <Small size={44} color={C.text}>Ahmet ukuda 😴 <span style={{ color: C.mute }}>z z z</span></Small>
      </In>
    </AbsoluteFill>
  );
};

const S2: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const draw = prog(t, cue[1], 6);
  const late = prog(t, cue[3], 0.8);
  const loss = prog(t, cue[4], 0.8);
  // price path: signal at x=200, rises to x=900, Ahmet buys at top, then pullback
  const pts = [
    [0, 360], [200, 330], [320, 300], [440, 250], [560, 200], [680, 150], [800, 120], [900, 110], [1000, 160], [1100, 200], [1200, 230],
  ];
  const visible = Math.max(2, Math.round(mix(2, pts.length, Math.min(1, draw + late + loss))));
  const path = pts.slice(0, visible).map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  return (
    <AbsoluteFill>
      <In at={0} t={t} style={{ position: "absolute", top: 70, left: 110 }}>
        <Panel>
          <Small size={24}>Ahmediň hasaby</Small>
          <Big size={72} color={C.gold}>$100 000</Big>
        </Panel>
      </In>
      <svg width="1300" height="420" viewBox="0 0 1300 420" style={{ position: "absolute", left: 310, top: 330 }}>
        <path d={path} stroke={C.gold} strokeWidth="7" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <g opacity={prog(t, cue[1])}>
          <circle cx="200" cy="330" r="16" fill={C.green} />
          <text x="200" y="395" textAnchor="middle" fill={C.green} fontFamily="Inter" fontWeight="800" fontSize="30">03:00 · Signal</text>
        </g>
        <g opacity={late}>
          <circle cx="900" cy="110" r="16" fill={C.red} />
          <text x="900" y="62" textAnchor="middle" fill={C.red} fontFamily="Inter" fontWeight="800" fontSize="30">08:30 · Ahmet girýär</text>
        </g>
        <g opacity={loss}>
          <text x="1200" y="300" textAnchor="middle" fill={C.red} fontFamily="Inter" fontWeight="900" fontSize="44">Zyýan</text>
        </g>
      </svg>
      <In at={cue[2]} t={t} style={{ position: "absolute", top: 90, right: 120 }}>
        <Panel tone={C.redSoft}>
          <Small size={30} color={C.text}>😴 Ahmet ukuda</Small>
        </Panel>
      </In>
    </AbsoluteFill>
  );
};

const S3: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const drop = prog(t, cue[5], 1.6);
  const bar = prog(t, cue[6], 1.2);
  return (
    <AbsoluteFill>
      <Title t={t} kicker="2-nji ýalňyşlyk" color={C.red}>Nädogry lot</Title>
      <div style={{ position: "absolute", top: 260, left: 140, display: "flex", flexDirection: "column", gap: 26 }}>
        <In at={cue[1]} t={t} x={-40} y={0}>
          <Panel style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Big size={80}>20 LOT</Big>
            <div style={{ background: C.red, color: "#fff", fontFamily: FB, fontWeight: 800, fontSize: 26, padding: "10px 18px", borderRadius: 12 }}>STOP-LOSS ÝOK</div>
          </Panel>
        </In>
        <In at={cue[2]} t={t} x={-40} y={0}>
          <Panel>
            <Small size={34} color={C.text}>1 lot = 100 unsiýa</Small>
          </Panel>
        </In>
        <In at={cue[3]} t={t} x={-40} y={0}>
          <Panel>
            <Small size={34} color={C.text}>
              Baha <b style={{ color: C.gold }}>$1</b> üýtgese → hasap <b style={{ color: C.gold }}>$2 000</b>
            </Small>
          </Panel>
        </In>
        <In at={cue[4]} t={t} x={-40} y={0}>
          <Panel tone={C.redSoft}>
            <Small size={34} color={C.text}>
              Altyn <b style={{ color: C.red }}>−$30</b> düşýär ↓
            </Small>
          </Panel>
        </In>
      </div>
      <div style={{ position: "absolute", top: 270, right: 150, width: 620, textAlign: "center" }}>
        <In at={cue[5]} t={t}>
          <Small size={30}>Netije</Small>
          <Big size={120} color={C.red} style={{ marginTop: 10 }}>{money(-60000 * drop)}</Big>
        </In>
        <In at={cue[6]} t={t} style={{ marginTop: 50 }}>
          <div style={{ height: 46, borderRadius: 23, background: C.panel, border: `1.5px solid ${C.line}`, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${mix(100, 40, bar)}%`, background: C.gold }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <Small size={28}>{money(mix(100000, 40000, bar))}</Small>
            <Big size={56} color={C.red}>−60%</Big>
          </div>
        </In>
      </div>
    </AbsoluteFill>
  );
};

const S4: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const k = prog(t, cue[3], 1.2);
  return (
    <AbsoluteFill>
      <Title t={t} kicker="3-nji ýalňyşlyk" color={C.red}>Duýgular</Title>
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        <In at={cue[1]} t={t}>
          <Panel tone={C.redSoft} style={{ width: 620 }}>
            <Small size={28} color={C.red}>ZYÝANDA</Small>
            <Big size={52} style={{ marginTop: 12 }}>⏳ Garaşýar</Big>
            <Small size={30} style={{ marginTop: 12 }}>«Yzyna gaýdar...»</Small>
          </Panel>
        </In>
        <In at={cue[2]} t={t}>
          <Panel tone={C.greenSoft} style={{ width: 620 }}>
            <Small size={28} color={C.green}>PEÝDADA</Small>
            <Big size={52} style={{ marginTop: 12 }}>✋ Ir ýapýar</Big>
            <Small size={30} style={{ marginTop: 12 }}>«Gorkup...»</Small>
          </Panel>
        </In>
      </div>
      <In at={cue[3]} t={t} style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 80, alignItems: "flex-end" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 200, height: 200 * k, background: C.red, borderRadius: 14, margin: "0 auto" }} />
          <Small size={28} style={{ marginTop: 10 }}>Zyýanlar: uly</Small>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 200, height: 50 * k, background: C.green, borderRadius: 14, margin: "0 auto" }} />
          <Small size={28} style={{ marginTop: 10 }}>Peýdalar: kiçi</Small>
        </div>
      </In>
    </AbsoluteFill>
  );
};

const Node: React.FC<{ label: string; sub: string; icon: string; hl?: boolean }> = ({ label, sub, icon, hl }) => (
  <Panel tone={hl ? C.goldSoft : C.panel} style={{ width: 380, textAlign: "center", border: hl ? `2px solid ${C.gold}` : undefined }}>
    <div style={{ fontSize: 64 }}>{icon}</div>
    <Big size={40} style={{ marginTop: 10 }}>{label}</Big>
    <Small size={24} style={{ marginTop: 8 }}>{sub}</Small>
  </Panel>
);

const S5: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const flow = prog(t, cue[2], 1.2);
  const dot = (t * 0.6) % 1;
  return (
    <AbsoluteFill>
      <In at={0} t={t} style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Logo size={130} />
      </In>
      <In at={cue[1]} t={t} style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center" }}>
        <Small size={36} color={C.text}>MetaTrader 5 · awtomatik söwda boty</Small>
      </In>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 70, opacity: flow }}>
        <Node icon="✈️" label="Telegram" sub="Signal kanaly" />
        <div style={{ width: 90, height: 6, background: C.gold, borderRadius: 3, position: "relative" }}>
          <div style={{ position: "absolute", top: -7, left: `${dot * 100}%`, width: 20, height: 20, borderRadius: 10, background: "#fff" }} />
        </div>
        <Node icon="🤖" label="ScalperResss AI" sub="Ýerine ýetirýär" hl />
        <div style={{ width: 90, height: 6, background: C.gold, borderRadius: 3, position: "relative" }}>
          <div style={{ position: "absolute", top: -7, left: `${((dot + 0.5) % 1) * 100}%`, width: 20, height: 20, borderRadius: 10, background: "#fff" }} />
        </div>
        <Node icon="📈" label="MetaTrader 5" sub="Söwda açylýar" />
      </div>
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 50 }}>
        <In at={cue[3]} t={t}>
          <Panel><Small size={30} color={C.text}>Signaly <b style={{ color: C.gold }}>kanal</b> berýär</Small></Panel>
        </In>
        <In at={cue[4]} t={t}>
          <Panel><Small size={30} color={C.text}>Bot: <b style={{ color: C.green }}>tiz · dogry · howpsuz</b></Small></Panel>
        </In>
      </div>
    </AbsoluteFill>
  );
};

const S6: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const timer = Math.min(1.2, Math.max(0, t - 0.3));
  const calc = t >= cue[2] - 0.2;
  return (
    <AbsoluteFill>
      {!calc && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - prog(t, cue[2] - 0.6, 0.4) }}>
          <In at={0} t={t} style={{ textAlign: "center" }}>
            <Small size={34} color={C.gold}>⚡ SIGNAL → SÖWDA</Small>
            <Big size={200} style={{ marginTop: 10 }}>{timer.toFixed(1)} sek</Big>
            <In at={1.6} t={t}>
              <Small size={40} color={C.green} style={{ marginTop: 18 }}>✓ Söwda açyldy</Small>
            </In>
            <In at={cue[1]} t={t}>
              <Small size={36} color={C.text} style={{ marginTop: 18 }}>🌙 Sen ukuda bolsaň hem</Small>
            </In>
          </In>
        </AbsoluteFill>
      )}
      {calc && (
        <AbsoluteFill>
          <Title t={t} at={cue[2] - 0.2} kicker="Lot hasaby">Balansyňa görä, awtomatik</Title>
          <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <In at={cue[3]} t={t}>
              <Panel style={{ display: "flex", gap: 28, alignItems: "center" }}>
                <Small size={26}>Deňagramly</Small>
                <Big size={60}>$100 000 × 1% = <span style={{ color: C.gold }}>$1 000</span></Big>
              </Panel>
            </In>
            <In at={cue[5]} t={t}>
              <Panel style={{ display: "flex", gap: 28, alignItems: "center" }}>
                <Small size={26}>Stop $5 aralykda</Small>
                <Big size={60}>$5 × 100 unsiýa = $500 / lot</Big>
              </Panel>
            </In>
            <In at={cue[5] + 1.6} t={t}>
              <Panel tone={C.goldSoft} style={{ border: `2px solid ${C.gold}` }}>
                <Big size={76}>$1 000 ÷ $500 = <span style={{ color: C.gold }}>2,00 lot</span></Big>
              </Panel>
            </In>
            <div style={{ display: "flex", gap: 40, marginTop: 10 }}>
              <In at={cue[6]} t={t}>
                <Panel tone={C.greenSoft}>
                  <Small size={24} color={C.green}>Iň erbet ýagdaý</Small>
                  <Big size={64} color={C.green}>−$1 000</Big>
                </Panel>
              </In>
              <In at={cue[7]} t={t}>
                <Panel tone={C.redSoft} style={{ position: "relative" }}>
                  <Small size={24} color={C.red}>Ahmet</Small>
                  <Big size={64} color={C.red}>−$60 000</Big>
                  <div style={{ position: "absolute", left: 20, right: 20, top: "55%", height: 6, background: C.text, transform: "rotate(-8deg)" }} />
                </Panel>
              </In>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const S7: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const modes = [
    { name: "Ygtybarly", pct: "0,5%", usd: "$500", at: cue[1] },
    { name: "Deňagramly", pct: "1%", usd: "$1 000", at: cue[2], hl: true },
    { name: "Agressiw", pct: "1,5%", usd: "$1 500", at: cue[3] },
  ];
  return (
    <AbsoluteFill>
      <Title t={t} kicker="Režimler">3 režim</Title>
      <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 50 }}>
        {modes.map((m) => (
          <In key={m.name} at={m.at} t={t}>
            <Panel tone={m.hl ? C.goldSoft : C.panel} style={{ width: 460, textAlign: "center", border: m.hl ? `2px solid ${C.gold}` : undefined }}>
              <Small size={32} color={m.hl ? C.gold : C.text}>{m.name}</Small>
              <Big size={110} style={{ marginTop: 16 }}>{m.pct}</Big>
              <Small size={30} style={{ marginTop: 14 }}>her signala</Small>
              <Big size={56} color={C.gold} style={{ marginTop: 10 }}>{m.usd}</Big>
            </Panel>
          </In>
        ))}
      </div>
      <In at={cue[4]} t={t} style={{ position: "absolute", top: 770, left: 0, right: 0, textAlign: "center" }}>
        <Small size={36} color={C.text}>Saýlamak – seniň islegiňe bagly</Small>
      </In>
    </AbsoluteFill>
  );
};

const S8: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const s = prog(t, 0.1, 0.9);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
        <svg width="260" height="300" viewBox="0 0 100 116" style={{ transform: `scale(${mix(0.6, 1, s)})`, opacity: s }}>
          <path d="M50 4 L92 20 V56 C92 84 72 104 50 112 C28 104 8 84 8 56 V20 Z" fill={C.goldSoft} stroke={C.gold} strokeWidth="5" />
          <path d="M30 58 L45 73 L72 43" stroke={C.green} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70" strokeDashoffset={70 * (1 - prog(t, 0.8, 0.8))} />
        </svg>
        <In at={0.3} t={t} x={40} y={0}>
          <Small size={30} color={C.gold}>IŇ GÜÝÇLI TARAPY</Small>
          <Big size={96} style={{ marginTop: 10 }}>HER SÖWDADA</Big>
          <Big size={96} color={C.gold}>STOP-LOSS</Big>
        </In>
      </div>
      <div style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
        <In at={cue[1]} t={t}>
          <Panel style={{ width: 520 }}>
            <Small size={26}>Stop-loss-syz söwda</Small>
            <Big size={80} color={C.green}>0</Big>
          </Panel>
        </In>
        <In at={cue[2]} t={t}>
          <Panel style={{ width: 520 }}>
            <Small size={26}>Gözegçiliksiz zyýan</Small>
            <Big size={80} color={C.green}>ÝOK</Big>
          </Panel>
        </In>
      </div>
      <In at={cue[3]} t={t} style={{ position: "absolute", top: 730, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Panel tone="rgba(232,182,76,0.10)" style={{ padding: "18px 32px" }}>
          <Small size={26} color={C.text}>⚠️ Güýçli täzeliklerde baha stopdan böküp geçip biler – 100% kepil ýok</Small>
        </Panel>
      </In>
    </AbsoluteFill>
  );
};

const S9: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const H = 520;
  const lv = { stop: 470, entry: 380, tp1: 290, tp2: 180, tp3: 70 };
  const rise = prog(t, cue[1], (cue[4] - cue[1]) + 0.5);
  const priceY = mix(lv.entry, lv.tp2 - 20, rise);
  const be = prog(t, cue[4], 1);
  const stopY = mix(lv.stop, lv.entry, be);
  const parts = [
    { k: "A", lot: "0,80", pct: 40, tgt: "TP1 · 1R", at: cue[1], c: C.green },
    { k: "B", lot: "0,70", pct: 35, tgt: "TP2", at: cue[2], c: C.blue },
    { k: "C", lot: "0,50", pct: 25, tgt: "TP3", at: cue[3], c: C.gold },
  ];
  const Lvl: React.FC<{ y: number; label: string; color: string; dash?: boolean }> = ({ y, label, color, dash }) => (
    <g>
      <line x1="0" x2="640" y1={y} y2={y} stroke={color} strokeWidth="3" strokeDasharray={dash ? "12 10" : undefined} />
      <text x="660" y={y + 10} fill={color} fontFamily="Inter" fontWeight="800" fontSize="28">{label}</text>
    </g>
  );
  return (
    <AbsoluteFill>
      <Title t={t} kicker="3 maksat">2,00 lot – üç bölege</Title>
      <div style={{ position: "absolute", top: 260, left: 120, display: "flex", flexDirection: "column", gap: 24, width: 640 }}>
        {parts.map((p) => (
          <In key={p.k} at={p.at} t={t} x={-40} y={0}>
            <Panel style={{ display: "flex", alignItems: "center", gap: 26, padding: "20px 28px" }}>
              <Big size={60} color={p.c}>{p.k}</Big>
              <div style={{ flex: 1 }}>
                <Big size={44}>{p.lot} lot</Big>
                <div style={{ height: 12, background: C.line, borderRadius: 6, marginTop: 10 }}>
                  <div style={{ width: `${p.pct * 2.5}%`, height: 12, background: p.c, borderRadius: 6 }} />
                </div>
              </div>
              <Small size={30} color={C.text}>→ {p.tgt}</Small>
            </Panel>
          </In>
        ))}
        <In at={cue[6]} t={t}>
          <Small size={30} color={C.text}>⚙️ Maksatlary özüň sazla</Small>
        </In>
      </div>
      <svg width="900" height={H} viewBox={`0 0 900 ${H}`} style={{ position: "absolute", right: 60, top: 270, opacity: prog(t, cue[0]) }}>
        <Lvl y={lv.tp3} label="TP3" color={C.gold} dash />
        <Lvl y={lv.tp2} label="TP2" color={C.blue} dash />
        <Lvl y={lv.tp1} label="TP1 (1R)" color={C.green} dash />
        <Lvl y={lv.entry} label={be > 0.5 ? "" : "Giriş"} color={C.text} />
        <Lvl y={stopY} label={be > 0.5 ? "Stop = giriş" : "Stop-loss"} color={C.red} />
        <circle cx="320" cy={priceY} r="18" fill="#fff" />
        <circle cx="320" cy={priceY} r="30" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="4" />
      </svg>
      <In at={cue[5]} t={t} style={{ position: "absolute", top: 800, right: 110 }}>
        <Panel tone={C.greenSoft} style={{ padding: "16px 28px" }}>
          <Small size={30} color={C.green}>✓ Galan söwda töwekgelçiliksiz</Small>
        </Panel>
      </In>
    </AbsoluteFill>
  );
};

const S10: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const fill = prog(t, cue[4], 2.2);
  const rows = [
    { icon: "🕑", a: "2 minutdan köne signal", b: "açylmaýar", at: cue[1] },
    { icon: "🔁", a: "Şol bir signal", b: "2 gezek açylmaýar", at: cue[2] },
  ];
  return (
    <AbsoluteFill>
      <Title t={t} kicker="Goşmaça gorag">Goşmaça goraglar</Title>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {rows.map((r) => (
          <In key={r.a} at={r.at} t={t}>
            <Panel style={{ width: 1200, display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ fontSize: 56 }}>{r.icon}</div>
              <Small size={40} color={C.text} style={{ flex: 1 }}>{r.a}</Small>
              <Small size={40} color={C.green}>✓ {r.b}</Small>
            </Panel>
          </In>
        ))}
        <In at={cue[3]} t={t}>
          <Panel style={{ width: 1200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ fontSize: 56 }}>🛑</div>
              <Small size={40} color={C.text} style={{ flex: 1 }}>Gündelik zyýan çägi</Small>
              <Big size={56} color={C.gold}>3,5% = $3 500</Big>
            </div>
            <div style={{ height: 22, background: C.line, borderRadius: 11, marginTop: 22, overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: 22, background: fill >= 0.99 ? C.red : C.gold, borderRadius: 11 }} />
            </div>
            <In at={cue[5]} t={t}>
              <Small size={32} color={C.red} style={{ marginTop: 16 }}>Çäk doldy → bot şol gün täze söwda açmaýar</Small>
            </In>
          </Panel>
        </In>
      </div>
    </AbsoluteFill>
  );
};

const S11: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const rows = [
    ["XAUUSD", "SATYN AL", "0,80", "TP1", "✓ Alyndy", C.green],
    ["XAUUSD", "SATYN AL", "0,70", "TP2", "✓ Alyndy", C.green],
    ["XAUUSD", "SATYN AL", "0,50", "TP3", "● Açyk", C.gold],
  ] as const;
  return (
    <AbsoluteFill>
      <Title t={t} kicker="Agza paneli">Ähli söwdalar – bir ýerde</Title>
      <In at={0.3} t={t} style={{ position: "absolute", top: 270, left: 260, right: 260 }}>
        <Panel style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 34px", borderBottom: `1.5px solid ${C.line}` }}>
            <Logo size={50} />
            <div style={{ background: C.goldSoft, color: C.gold, fontFamily: FB, fontWeight: 800, fontSize: 22, padding: "8px 16px", borderRadius: 10 }}>MYSAL</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr 1.2fr", padding: "16px 34px", fontFamily: FB, fontWeight: 700, fontSize: 24, color: C.mute }}>
            <div>Söwda</div><div>Ugur</div><div>Lot</div><div>Maksat</div><div>Ýagdaý</div>
          </div>
          {rows.map((r, i) => (
            <In key={i} at={cue[1] + i * 0.5} t={t} y={14}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr 1.2fr", padding: "20px 34px", borderTop: `1.5px solid ${C.line}`, fontFamily: FB, fontWeight: 700, fontSize: 32, color: C.text }}>
                <div>{r[0]}</div><div style={{ color: C.green }}>{r[1]}</div><div>{r[2]}</div><div>{r[3]}</div><div style={{ color: r[5] }}>{r[4]}</div>
              </div>
            </In>
          ))}
        </Panel>
      </In>
    </AbsoluteFill>
  );
};

const S12: React.FC<SP> = ({ cue }) => {
  const t = useT();
  const k = prog(t, 0.2, 1.2);
  const end = t >= cue[4] - 0.2;
  return (
    <AbsoluteFill>
      {!end && (
        <AbsoluteFill style={{ opacity: 1 - prog(t, cue[4] - 0.6, 0.4) }}>
          <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 160, alignItems: "flex-end", height: 420 }}>
            <div style={{ textAlign: "center" }}>
              <Big size={80} color={C.red}>−60%</Big>
              <div style={{ width: 220, height: 300 * k, background: C.red, borderRadius: 16, margin: "18px auto 0" }} />
              <Small size={32} color={C.text} style={{ marginTop: 14 }}>Ahmet</Small>
            </div>
            <In at={cue[1]} t={t} style={{ textAlign: "center" }}>
              <Big size={80} color={C.green}>−1%</Big>
              <div style={{ width: 220, height: 6 * prog(t, cue[1], 1) + 4, background: C.green, borderRadius: 4, margin: "18px auto 0" }} />
              <Small size={32} color={C.text} style={{ marginTop: 14 }}>ScalperResss AI · iň erbet ýagdaý</Small>
            </In>
          </div>
          <In at={cue[2]} t={t} style={{ position: "absolute", top: 660, left: 0, right: 0, textAlign: "center" }}>
            <Big size={80}>Tertip · Tizlik · <span style={{ color: C.gold }}>Gorag</span></Big>
          </In>
        </AbsoluteFill>
      )}
      {end && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <In at={cue[4] - 0.2} t={t} style={{ textAlign: "center", marginTop: -120 }}>
            <Logo size={150} />
          </In>
          <In at={cue[4]} t={t} style={{ marginTop: 50 }}>
            <Panel style={{ width: 1300, textAlign: "center" }}>
              <Small size={34} color={C.gold}>⚠️ Üns beriň</Small>
              <Small size={32} color={C.text} style={{ marginTop: 12 }}>Bu maýa goýum maslahaty däl. Foreks ýokary töwekgelçilikli, zyýan çekip bilersiňiz.</Small>
              <Small size={28} style={{ marginTop: 12 }}>Mysallar diňe düşündirmek üçin berildi.</Small>
            </Panel>
          </In>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

const Shell: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 10, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: a }}>{children}</AbsoluteFill>;
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  let cur: Cap | undefined;
  for (const s of SECTIONS) for (const c of s.captions) if (t >= c.from && t < c.to + 0.15) cur = c;
  if (!cur) return null;
  const k = prog(t, cur.from, 0.25);
  return (
    <div style={{ position: "absolute", bottom: 58, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 1560,
          textAlign: "center",
          fontFamily: FB,
          fontWeight: 650,
          fontSize: 40,
          lineHeight: 1.3,
          color: C.text,
          background: "rgba(7,8,11,0.82)",
          border: `1.5px solid ${C.line}`,
          padding: "14px 32px",
          borderRadius: 16,
          opacity: k,
          transform: `translateY(${mix(10, 0, k)}px)`,
        }}
      >
        {cur.text}
      </div>
    </div>
  );
};

const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const idx = SECTIONS.reduce((acc, s, i) => (t >= s.start ? i : acc), 0);
  return (
    <>
      <div style={{ position: "absolute", top: 36, left: 44, opacity: 0.85 }}>
        <Logo size={40} />
      </div>
      <div style={{ position: "absolute", top: 50, right: 48, display: "flex", gap: 8 }}>
        {SECTIONS.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 34 : 10, height: 10, borderRadius: 5, background: i <= idx ? C.gold : C.line }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${(f / durationInFrames) * 100}%`, background: C.gold }} />
    </>
  );
};

export const ScalperTK: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Bg />
      {SECTIONS.map((s, i) => {
        const from = Math.round(s.start * fps);
        const next = i + 1 < SECTIONS.length ? Math.round(SECTIONS[i + 1].start * fps) : durationInFrames;
        const Scene = SCENES[i];
        const cue = s.captions.map((c) => Math.max(0, c.from - s.start));
        return (
          <Sequence key={i} from={from} durationInFrames={next - from} name={`S${i + 1}`}>
            <Shell dur={next - from}>
              <Scene cue={cue} />
            </Shell>
          </Sequence>
        );
      })}
      <Captions />
      <Chrome />
      <Audio src={staticFile("voice.wav")} />
      <Audio
        src={staticFile("music.wav")}
        volume={(f) =>
          0.07 *
          interpolate(f, [0, fps * 1.5, durationInFrames - fps * 3, durationInFrames], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};
