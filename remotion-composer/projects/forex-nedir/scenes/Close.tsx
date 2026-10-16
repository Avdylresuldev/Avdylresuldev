import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { beat, C, FONT_BODY, FONT_DISPLAY, mix } from "../theme";
import type { Labels } from "../types";

export const Close: React.FC<{ dur: number; labels: Labels["close"] }> = ({ dur, labels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stamp = spring({ frame: frame - 4, fps, config: { damping: 10, mass: 0.8 } });
  const disclaimerIn = beat(frame, dur, 0.76, 0.86);

  return (
    <AbsoluteFill>
      {/* Warning stamp */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, stamp * 2),
          transform: `scale(${mix(1.6, 1, stamp)}) rotate(${mix(-8, -2, stamp)}deg)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            padding: "22px 48px",
            border: `7px solid ${C.loss}`,
            borderRadius: 20,
            color: C.loss,
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 84,
            background: C.lossSoft,
          }}
        >
          <svg width={90} height={80} viewBox="0 0 90 80">
            <path d="M45 4 L86 76 L4 76 Z" fill={C.loss} stroke={C.loss} strokeWidth={6} strokeLinejoin="round" />
            <rect x={41} y={26} width={8} height={28} rx={3} fill={C.lossSoft} />
            <circle cx={45} cy={64} r={5} fill={C.lossSoft} />
          </svg>
          {labels.warning}
        </div>
      </div>

      {/* Checklist */}
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        {labels.checks.map((item, i) => {
          const t = beat(frame, dur, 0.16 + i * 0.16, 0.24 + i * 0.16);
          const tick = beat(frame, dur, 0.22 + i * 0.16, 0.28 + i * 0.16);
          return (
            <div
              key={item}
              style={{
                width: 1100,
                display: "flex",
                alignItems: "center",
                gap: 34,
                opacity: t,
                transform: `translateX(${mix(-60, 0, t)}px)`,
              }}
            >
              <div
                style={{
                  width: 84,
                  height: 84,
                  flex: "none",
                  borderRadius: 18,
                  border: `5px solid ${C.ink}`,
                  background: tick > 0 ? C.gainSoft : C.paper,
                }}
              >
                <svg width={74} height={74} viewBox="0 0 74 74">
                  <path
                    d="M16 38 L31 53 L58 22"
                    fill="none"
                    stroke={C.gain}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={70}
                    strokeDashoffset={70 * (1 - tick)}
                  />
                </svg>
              </div>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 60, color: C.ink }}>{item}</div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div
        style={{
          position: "absolute",
          bottom: 190,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: disclaimerIn,
          transform: `translateY(${mix(30, 0, disclaimerIn)}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 40,
            color: C.paper,
            background: C.ink,
            padding: "16px 34px",
            borderRadius: 14,
          }}
        >
          {labels.disclaimer}
        </span>
      </div>
    </AbsoluteFill>
  );
};
