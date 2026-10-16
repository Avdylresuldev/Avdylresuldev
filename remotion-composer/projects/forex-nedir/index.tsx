import React from "react";
import { Composition, registerRoot } from "remotion";
import { ForexVideo } from "./ForexVideo";
import type { ForexProps } from "./types";
import defaultProps from "./props-tr.json";

const FPS = 30;

const Root: React.FC = () => (
  <Composition
    id="ForexNedir"
    component={ForexVideo as unknown as React.FC<Record<string, unknown>>}
    width={1920}
    height={1080}
    fps={FPS}
    durationInFrames={FPS * 90}
    defaultProps={defaultProps as unknown as Record<string, unknown>}
    calculateMetadata={({ props }) => {
      const p = props as unknown as ForexProps;
      const frames = p.sections.reduce((n, s) => n + Math.round(s.durationSec * FPS), 0);
      return { durationInFrames: Math.max(1, frames) };
    }}
  />
);

registerRoot(Root);
