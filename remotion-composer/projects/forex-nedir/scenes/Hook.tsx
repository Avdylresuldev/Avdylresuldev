import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { beat, C, FONT_BODY, FONT_DISPLAY, mix } from "../theme";
import type { Labels } from "../types";

const Banknote: React.FC<{ label: string; tint: string; edge: string }> = ({ label, tint, edge }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 22,
      background: tint,
      border: `4px solid ${edge}`,
      boxShadow: "0 30px 60px rgba(28,27,26,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backfaceVisibility: "hidden",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 18,
        borderRadius: 14,
        border: `2px dashed ${edge}`,
        opacity: 0.55,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 40,
        top: "50%",
        width: 120,
        height: 120,
        marginTop: -60,
        borderRadius: "50%",
        border: `3px solid ${edge}`,
        opacity: 0.35,
      }}
    />
    <span
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 800,
        fontSize: 92,
        color: C.ink,
        letterSpacing: -2,
        fontFeatureSettings: "'tnum'",
      }}
    >
      {label}
    </span>
  </div>
);

export const Hook: React.FC<{ dur: number; labels: Labels["hook"] }> = ({ dur, labels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const noteIn = spring({ frame, fps, config: { damping: 16, mass: 0.9 } });
  const flip = beat(frame, dur, 0.28, 0.42);
  const boardIn = beat(frame, dur, 0.06, 0.2);
  const stageOut = beat(frame, dur, 0.55, 0.66);
  const titleStart = 0.6 * dur;

  // Rate on the exchange board jitters like a live quote.
  const wobble = Math.sin(frame / 7) * 0.004 + Math.sin(frame / 3.1) * 0.002;
  const title = labels.title.split("");

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Exchange-office moment */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - stageOut,
          transform: `scale(${mix(1, 0.86, stageOut)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 230,
            top: 330,
            width: 720,
            height: 380,
            perspective: 1600,
            transform: `translateX(${mix(-900, 0, noteIn)}px) rotate(${mix(-14, -3, noteIn)}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transform: `rotateY(${flip * 180}deg)`,
            }}
          >
            <Banknote label={labels.noteFrom} tint={C.gainSoft} edge={C.gain} />
            <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
              <Banknote label={labels.noteTo} tint={C.goldSoft} edge={C.gold} />
            </div>
          </div>
        </div>

        {/* Exchange board */}
        <div
          style={{
            position: "absolute",
            right: 220,
            top: 300,
            width: 600,
            padding: "34px 40px",
            borderRadius: 24,
            background: C.ink,
            color: C.paper,
            opacity: boardIn,
            transform: `translateY(${mix(60, 0, boardIn)}px)`,
            fontFamily: FONT_BODY,
          }}
        >
          <div style={{ fontSize: 26, letterSpacing: 6, fontWeight: 600, color: C.gold }}>{labels.board}</div>
          {[
            ["EUR / USD", 1.08 + wobble],
            ["GBP / USD", 1.27 - wobble],
          ].map(([pair, value], i) => (
            <div
              key={pair as string}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 26,
                paddingTop: i ? 22 : 0,
                borderTop: i ? `1px solid rgba(244,238,227,0.18)` : "none",
                fontSize: 54,
                fontWeight: 700,
                fontFeatureSettings: "'tnum'",
              }}
            >
              <span>{pair as string}</span>
              <span style={{ color: i ? C.paper : C.gold }}>{(value as number).toFixed(2).replace(".", ",")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOREX stamp */}
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          {title.map((ch, i) => {
            const s = spring({ frame: frame - titleStart - i * 4, fps, config: { damping: 11, mass: 0.7 } });
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 900,
                  fontSize: 300,
                  lineHeight: 1,
                  color: C.ink,
                  letterSpacing: -10,
                  display: "inline-block",
                  opacity: interpolate(s, [0, 0.2], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateY(${mix(140, 0, s)}px) scale(${mix(1.4, 1, s)})`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div
          style={{
            height: 26,
            marginTop: -12,
            background: C.gold,
            alignSelf: "stretch",
            transformOrigin: "left center",
            transform: `scaleX(${beat(frame, dur, 0.72, 0.84)})`,
          }}
        />
        <div
          style={{
            marginTop: 34,
            fontFamily: FONT_BODY,
            fontSize: 48,
            fontWeight: 500,
            color: C.inkSoft,
            opacity: beat(frame, dur, 0.78, 0.9),
          }}
        >
          {labels.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
