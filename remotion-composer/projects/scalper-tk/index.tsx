import React from "react";
import { Composition, registerRoot } from "remotion";
import { ScalperTK, TOTAL_SEC } from "./ScalperTK";

const FPS = 30;
const Root: React.FC = () => (
  <Composition id="ScalperTK" component={ScalperTK} width={1920} height={1080} fps={FPS} durationInFrames={Math.ceil(TOTAL_SEC * FPS)} />
);
registerRoot(Root);
