import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { beat, C, FONT_BODY, FONT_DISPLAY, mix } from "../theme";
import type { Labels } from "../types";

// Deterministic, gently rising price path for the chart.
const N = 60;
const PRICES = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1);
  return 0.35 + 0.35 * t + 0.08 * Math.sin(i * 0.9) + 0.05 * Math.sin(i * 2.3 + 1);
});

const Coin: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div
    style={{
      width: 170,
      height: 170,
      borderRadius: "50%",
      background: color,
      border: `5px solid ${C.ink}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT_DISPLAY,
      fontWeight: 900,
      fontSize: 50,
      color: C.ink,
      fontFeatureSettings: "'tnum'",
    }}
  >
    {label}
  </div>
);

export const Pair: React.FC<{ dur: number; labels: Labels["pair"] }> = ({ dur, labels }) => {
  const frame = useCurrentFrame();

  const headIn = beat(frame, dur, 0, 0.1);
  const scaleIn = beat(frame, dur, 0.12, 0.26);
  // Beam wobbles then settles level: one euro "weighs" 1.08 dollars.
  const settle = beat(frame, dur, 0.18, 0.42);
  const tilt = Math.sin(frame / 6) * 9 * (1 - settle);
  const toChart = beat(frame, dur, 0.46, 0.56);
  const draw = beat(frame, dur, 0.5, 0.8);
  const buyIn = beat(frame, dur, 0.66, 0.74);
  const sellIn = beat(frame, dur, 0.78, 0.86);

  const W = 1100;
  const H = 420;
  const pts = PRICES.map((p, i) => [(i / (N - 1)) * W, H - p * H] as const);
  const shown = Math.max(2, Math.round(draw * N));
  const d = pts.slice(0, shown).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[shown - 1];

  return (
    <AbsoluteFill>
      {/* Pair header */}
      <div
        style={{
          position: "absolute",
          top: mix(150, 90, toChart),
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 34,
          fontFamily: FONT_DISPLAY,
          color: C.ink,
          opacity: headIn,
          transform: `scale(${mix(1, 0.62, toChart)})`,
        }}
      >
        <span style={{ fontSize: 150, fontWeight: 900, letterSpacing: -4 }}>
          {labels.base}
          <span style={{ color: C.inkSoft, fontWeight: 300 }}> / </span>
          {labels.quote}
        </span>
        <span
          style={{
            fontSize: 150,
            fontWeight: 900,
            background: C.gold,
            padding: "0 26px",
            borderRadius: 18,
            fontFeatureSettings: "'tnum'",
          }}
        >
          {labels.rate}
        </span>
      </div>

      {/* Balance scale */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 470,
          width: 800,
          height: 520,
          opacity: scaleIn * (1 - toChart),
          transform: `translateY(${mix(80, 0, scaleIn)}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 390, top: 120, width: 20, height: 330, background: C.ink, borderRadius: 10 }} />
        <div style={{ position: "absolute", left: 300, top: 440, width: 200, height: 26, background: C.ink, borderRadius: 13 }} />
        <div style={{ position: "absolute", left: 0, top: 110, width: 800, height: 0, transform: `rotate(${tilt}deg)` }}>
          <div style={{ position: "absolute", left: 40, top: 0, width: 720, height: 18, background: C.ink, borderRadius: 9 }} />
          <div style={{ position: "absolute", left: -15, top: -180, transform: `rotate(${-tilt}deg)` }}>
            <Coin label={labels.baseCoin} color={C.goldSoft} />
          </div>
          <div style={{ position: "absolute", left: 645, top: -180, transform: `rotate(${-tilt}deg)` }}>
            <Coin label={labels.quoteCoin} color={C.gainSoft} />
          </div>
        </div>
      </div>

      {/* Price chart */}
      <div style={{ position: "absolute", left: 140, top: 330, opacity: toChart }}>
        <svg width={W + 40} height={H + 40}>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke={C.rule} strokeWidth={2} strokeDasharray="8 10" />
          ))}
          <path d={d} fill="none" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
          {last && <circle cx={last[0]} cy={last[1]} r={13} fill={C.gold} stroke={C.ink} strokeWidth={4} />}
        </svg>
      </div>

      {/* Buy / sell cards */}
      {[
        { t: buyIn, label: labels.buy, hint: labels.buyHint, color: C.gain, soft: C.gainSoft, arrow: "↑", top: 320 },
        { t: sellIn, label: labels.sell, hint: labels.sellHint, color: C.loss, soft: C.lossSoft, arrow: "↓", top: 580 },
      ].map((c) => (
        <div
          key={c.label}
          style={{
            position: "absolute",
            right: 110,
            top: c.top,
            width: 470,
            padding: "26px 32px",
            borderRadius: 22,
            background: c.soft,
            border: `4px solid ${c.color}`,
            opacity: c.t,
            transform: `translateX(${mix(80, 0, c.t)}px)`,
            fontFamily: FONT_BODY,
            color: C.ink,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 64, color: c.color }}>
            <span>{c.arrow}</span>
            <span>{c.label}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 500, marginTop: 6 }}>{c.hint}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
