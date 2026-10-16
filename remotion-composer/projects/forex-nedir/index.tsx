import React from "react";
import { Composition, registerRoot } from "remotion";
import { ForexVideo } from "./ForexVideo";
import type { ForexProps } from "./types";
import propsTr from "./props-tr.json";
import propsTk from "./props-tk.json";

const FPS = 30;

const metadata = ({ props }: { props: Record<string, unknown> }) => {
  const p = props as unknown as ForexProps;
  const frames = p.sections.reduce((n, s) => n + Math.round(s.durationSec * FPS), 0);
  return { durationInFrames: Math.max(1, frames) };
};

const Root: React.FC = () => (
  <>
    {[
      { id: "ForexNedir", props: propsTr },
      { id: "ForexNedirTK", props: propsTk },
    ].map(({ id, props }) => (
      <Composition
        key={id}
        id={id}
        component={ForexVideo as unknown as React.FC<Record<string, unknown>>}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={FPS * 90}
        defaultProps={props as unknown as Record<string, unknown>}
        calculateMetadata={metadata}
      />
    ))}
  </>
);

registerRoot(Root);
