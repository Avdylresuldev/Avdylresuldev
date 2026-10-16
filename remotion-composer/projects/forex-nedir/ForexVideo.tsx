import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_BODY, mix } from "./theme";
import type { ForexProps, Section } from "./types";
import { Hook } from "./scenes/Hook";
import { WhatIs } from "./scenes/WhatIs";
import { Pair } from "./scenes/Pair";
import { Leverage } from "./scenes/Leverage";
import { Close } from "./scenes/Close";

const PaperBackground: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    {/* faint notepad grid */}
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.rule}55 2px, transparent 2px), linear-gradient(90deg, ${C.rule}55 2px, transparent 2px)`,
        backgroundSize: "64px 64px",
        opacity: 0.6,
      }}
    />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(120,96,60,0.18)" }} />
  </AbsoluteFill>
);

// Scene wrapper: soft rise-in, fade-out.
const SceneShell: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outT = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: Math.min(inT, outT), transform: `translateY(${mix(30, 0, inT)}px)` }}>{children}</AbsoluteFill>
  );
};

const Captions: React.FC<{ section: Section; dur: number }> = ({ section, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = (section.audioOffsetSec ?? 0.3) * fps;
  const span = Math.max(1, section.audioDurationSec ? section.audioDurationSec * fps : dur - start - 0.5 * fps);
  const total = section.captions.reduce((n, c) => n + c.length, 0) || 1;
  let acc = 0;
  const chunks = section.captions.map((text) => {
    const from = start + (acc / total) * span;
    acc += text.length;
    return { text, from, to: start + (acc / total) * span };
  });
  const cur = chunks.find((c) => frame >= c.from && frame < c.to);
  if (!cur) return null;
  const t = interpolate(frame, [cur.from, cur.from + 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: 58, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 1500,
          textAlign: "center",
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 42,
          lineHeight: 1.3,
          color: C.paper,
          background: "rgba(28,27,26,0.88)",
          padding: "14px 30px",
          borderRadius: 14,
          opacity: t,
          transform: `translateY(${mix(12, 0, t)}px)`,
        }}
      >
        {cur.text}
      </div>
    </div>
  );
};

const Chrome: React.FC<{ names: string[]; starts: number[]; total: number }> = ({ names, starts, total }) => {
  const frame = useCurrentFrame();
  const idx = starts.reduce((acc, s, i) => (frame >= s ? i : acc), 0);
  return (
    <>
      <div style={{ position: "absolute", top: 44, left: 56, display: "flex", alignItems: "center", gap: 16, fontFamily: FONT_BODY }}>
        <div style={{ display: "flex", gap: 8 }}>
          {names.map((_, i) => (
            <div key={i} style={{ width: i === idx ? 44 : 14, height: 14, borderRadius: 7, background: i <= idx ? C.ink : C.rule }} />
          ))}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.inkSoft, letterSpacing: 1 }}>{names[idx]}</div>
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(frame / total) * 100}%`, background: C.gold }} />
    </>
  );
};

export const ForexVideo: React.FC<ForexProps> = ({ sections, labels, music, musicVolume = 0.12, showCaptions = true }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const durs = sections.map((s) => Math.round(s.durationSec * fps));
  const starts = durs.map((_, i) => durs.slice(0, i).reduce((a, b) => a + b, 0));

  const scenes = [
    (d: number) => <Hook dur={d} labels={labels.hook} />,
    (d: number) => <WhatIs dur={d} labels={labels.what} />,
    (d: number) => <Pair dur={d} labels={labels.pair} />,
    (d: number) => <Leverage dur={d} labels={labels.leverage} />,
    (d: number) => <Close dur={d} labels={labels.close} />,
  ];

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <PaperBackground />
      {sections.map((s, i) => (
        <Sequence key={s.id} from={starts[i]} durationInFrames={durs[i]} name={s.id}>
          <SceneShell dur={durs[i]}>{scenes[i]?.(durs[i])}</SceneShell>
          {s.audio && (
            <Sequence from={Math.round((s.audioOffsetSec ?? 0.3) * fps)} name={`${s.id}-voice`}>
              <Audio src={staticFile(s.audio)} />
            </Sequence>
          )}
          {showCaptions && <Captions section={s} dur={durs[i]} />}
        </Sequence>
      ))}
      <Chrome names={labels.sectionNames} starts={starts} total={durationInFrames} />
      {music && (
        <Audio
          src={staticFile(music)}
          volume={(f) =>
            musicVolume *
            interpolate(f, [0, fps, durationInFrames - 2 * fps, durationInFrames], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      )}
    </AbsoluteFill>
  );
};

