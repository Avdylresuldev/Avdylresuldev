import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import land110 from "world-atlas/land-110m.json";
import { beat, C, FONT_BODY, FONT_DISPLAY, mix } from "../theme";
import type { Labels } from "../types";

// Trading sessions in the order the market "wakes up" over a day.
const CITY_COORDS: [number, number][] = [
  [151.2, -33.9], // Sydney
  [139.7, 35.7], // Tokyo
  [-0.1, 51.5], // London
  [-74.0, 40.7], // New York
];

const SIZE = 760;

export const WhatIs: React.FC<{ dur: number; labels: Labels["what"] }> = ({ dur, labels }) => {
  const frame = useCurrentFrame();

  const land = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => feature(land110 as any, (land110 as any).objects.land),
    [],
  );

  const globeIn = beat(frame, dur, 0, 0.12);
  // Spin westward from Sydney round to New York over the first ~60% of the scene.
  const spin = interpolate(frame, [0, 0.62 * dur], [165, -55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const projection = geoOrthographic()
    .scale(SIZE / 2 - 6)
    .translate([SIZE / 2, SIZE / 2])
    .rotate([-spin, -18])
    .clipAngle(90);
  const path = geoPath(projection);

  const shift = beat(frame, dur, 0.55, 0.68);
  const counter = beat(frame, dur, 0.62, 0.85);
  const value = (labels.volumeValue * counter).toFixed(1).replace(".", labels.volumeDecimalSep);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: mix(580, 170, shift),
          top: 150,
          width: SIZE,
          height: SIZE,
          opacity: globeIn,
          transform: `scale(${mix(0.85, 1, globeIn)})`,
        }}
      >
        <svg width={SIZE} height={SIZE}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 6} fill={C.sea} stroke={C.ink} strokeWidth={4} />
          <path d={path(geoGraticule10()) ?? ""} fill="none" stroke={C.rule} strokeWidth={1.2} />
          <path d={path(land) ?? ""} fill={C.paperDeep} stroke={C.ink} strokeWidth={2} />
          {CITY_COORDS.map((coord, i) => {
            const p = projection(coord);
            const visible = path({ type: "Point", coordinates: coord }) !== null;
            if (!p || !visible) return null;
            const lit = beat(frame, dur, 0.1 + i * 0.11, 0.16 + i * 0.11);
            const pulse = (frame / 20 + i) % 1;
            return (
              <g key={i} opacity={lit}>
                <circle cx={p[0]} cy={p[1]} r={14 + pulse * 30} fill="none" stroke={C.gold} strokeWidth={4} opacity={1 - pulse} />
                <circle cx={p[0]} cy={p[1]} r={14} fill={C.gold} stroke={C.ink} strokeWidth={3} />
                <text
                  x={p[0]}
                  y={p[1] - 30}
                  textAnchor="middle"
                  fontFamily={FONT_BODY}
                  fontWeight={700}
                  fontSize={30}
                  fill={C.ink}
                  stroke={C.paper}
                  strokeWidth={8}
                  paintOrder="stroke"
                >
                  {labels.cities[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 24h badge */}
      <div
        style={{
          position: "absolute",
          left: mix(1360, 990, shift),
          top: 180,
          padding: "18px 30px",
          borderRadius: 999,
          background: C.ink,
          color: C.paper,
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 34,
          opacity: beat(frame, dur, 0.18, 0.28),
        }}
      >
        {labels.hours}
      </div>

      {/* Market players */}
      <div style={{ position: "absolute", left: mix(1360, 990, shift), top: 290, display: "flex", flexDirection: "column", gap: 18 }}>
        {labels.players.map((p, i) => {
          const t = beat(frame, dur, 0.3 + i * 0.06, 0.38 + i * 0.06);
          return (
            <div
              key={p}
              style={{
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: 40,
                color: C.ink,
                padding: "14px 26px",
                background: C.paper,
                border: `3px solid ${C.ink}`,
                borderRadius: 16,
                opacity: t,
                transform: `translateX(${mix(50, 0, t)}px)`,
                width: "fit-content",
              }}
            >
              {p}
            </div>
          );
        })}
      </div>

      {/* Daily volume */}
      <div
        style={{
          position: "absolute",
          left: 990,
          top: 640,
          opacity: beat(frame, dur, 0.6, 0.68),
          fontFamily: FONT_DISPLAY,
          color: C.ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontSize: 170, fontWeight: 900, letterSpacing: -6, fontFeatureSettings: "'tnum'" }}>{value}</span>
          <span style={{ fontSize: 60, fontWeight: 800 }}>{labels.volumeUnit}</span>
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 38, fontWeight: 500, color: C.inkSoft, marginTop: -6 }}>
          {labels.volumeLabel}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 22, color: C.inkSoft, marginTop: 14, opacity: 0.8 }}>{labels.source}</div>
      </div>
    </AbsoluteFill>
  );
};
