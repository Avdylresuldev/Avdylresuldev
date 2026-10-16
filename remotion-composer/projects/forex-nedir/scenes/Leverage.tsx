import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { beat, C, FONT_BODY, FONT_DISPLAY, mix } from "../theme";
import type { Labels } from "../types";

const Block: React.FC<{ w: number; h: number; label: string; sub: string; bg: string }> = ({ w, h, label, sub, bg }) => (
  <div
    style={{
      width: w,
      height: h,
      background: bg,
      border: `5px solid ${C.ink}`,
      borderRadius: 18,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT_DISPLAY,
      color: C.ink,
    }}
  >
    <div style={{ fontWeight: 900, fontSize: Math.min(h > 200 ? 76 : 48, (w - 40) / (label.length * 0.62)), whiteSpace: "nowrap", fontFeatureSettings: "'tnum'" }}>{label}</div>
    <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: h > 200 ? 30 : 24, color: C.inkSoft }}>{sub}</div>
  </div>
);

const Outcome: React.FC<{
  t: number;
  fill: number;
  color: string;
  soft: string;
  move: string;
  result: string;
  caption: string;
}> = ({ t, fill, color, soft, move, result, caption }) => {
  const BAR = 360;
  return (
    <div style={{ width: 600, display: "flex", flexDirection: "column", alignItems: "center", opacity: t, transform: `translateY(${mix(60, 0, t)}px)` }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 72, color }}>{move}</div>
      <div style={{ position: "relative", width: 200, height: BAR, marginTop: 20, border: `5px solid ${C.ink}`, borderRadius: 16, background: C.paper, overflow: "hidden" }}>
        {/* half-line marks the 100 starting stake */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: BAR / 2, borderTop: `3px dashed ${C.inkSoft}` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: fill * BAR, background: soft, borderTop: `6px solid ${color}` }} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 90, color: C.ink, marginTop: 18, fontFeatureSettings: "'tnum'" }}>{result}</div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 36, color, marginTop: 2 }}>{caption}</div>
    </div>
  );
};

export const Leverage: React.FC<{ dur: number; labels: Labels["leverage"] }> = ({ dur, labels }) => {
  const frame = useCurrentFrame();

  const titleIn = beat(frame, dur, 0, 0.08);
  const leverIn = beat(frame, dur, 0.06, 0.16);
  const lift = beat(frame, dur, 0.18, 0.36);
  const toOutcomes = beat(frame, dur, 0.4, 0.5);
  const upIn = beat(frame, dur, 0.48, 0.56);
  const upFill = mix(0.5, 1, beat(frame, dur, 0.56, 0.68));
  const downIn = beat(frame, dur, 0.66, 0.74);
  const downFill = mix(0.5, 0, beat(frame, dur, 0.74, 0.88));

  // Seesaw: small stake pushes its end down and lifts the big position.
  const angle = mix(-12, 12, lift);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_DISPLAY,
          fontWeight: 900,
          fontSize: 120,
          letterSpacing: -3,
          color: C.ink,
          opacity: titleIn,
          transform: `scale(${mix(1, 0.7, toOutcomes)}) translateY(${mix(0, -30, toOutcomes)}px)`,
        }}
      >
        <span style={{ background: C.gold, padding: "0 30px", borderRadius: 18 }}>{labels.title}</span>
      </div>

      {/* Seesaw */}
      <div style={{ position: "absolute", left: 360, top: 330, width: 1200, height: 600, opacity: leverIn * (1 - toOutcomes) }}>
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 330,
            width: 0,
            height: 0,
            borderLeft: "60px solid transparent",
            borderRight: "60px solid transparent",
            borderBottom: `150px solid ${C.ink}`,
          }}
        />
        <div style={{ position: "absolute", left: 0, top: 316, width: 1200, height: 0, transform: `rotate(${angle}deg)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 22, background: C.ink, borderRadius: 11 }} />
          <div style={{ position: "absolute", left: 930, top: -150, transform: `rotate(${-angle}deg)`, transformOrigin: "center bottom" }}>
            <Block w={250} h={150} label={labels.own} sub={labels.ownLabel} bg={C.gainSoft} />
          </div>
          <div style={{ position: "absolute", left: 10, top: -270, transform: `rotate(${-angle}deg)`, transformOrigin: "center bottom" }}>
            <Block w={420} h={270} label={labels.position} sub={labels.positionLabel} bg={C.goldSoft} />
          </div>
        </div>
      </div>

      {/* Outcomes */}
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 160 }}>
        <Outcome t={upIn} fill={upFill} color={C.gain} soft={C.gainSoft} move={labels.up} result={labels.upResult} caption={labels.upLabel} />
        <Outcome t={downIn} fill={downFill} color={C.loss} soft={C.lossSoft} move={labels.down} result={labels.downResult} caption={labels.downLabel} />
      </div>
    </AbsoluteFill>
  );
};
