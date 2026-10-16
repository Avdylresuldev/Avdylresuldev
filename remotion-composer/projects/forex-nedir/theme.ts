import { Easing, interpolate } from "remotion";

// Warm "paper desk" palette: a friend sketching the market on a notepad,
// deliberately not the neon-on-black trading-terminal look.
export const C = {
  paper: "#F4EEE3",
  paperDeep: "#E9E0CF",
  ink: "#1C1B1A",
  inkSoft: "#5B564F",
  rule: "#D6CBB6",
  gain: "#1E8E4E",
  gainSoft: "#CFE9D9",
  loss: "#C93C3C",
  lossSoft: "#F3D3CF",
  gold: "#F0B93A",
  goldSoft: "#F8E2A6",
  sea: "#DCE6E4",
};

export const FONT_DISPLAY = "'Inter Display', 'Inter', sans-serif";
export const FONT_BODY = "'Inter', sans-serif";

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// Progress 0..1 of a beat placed at fractions of the scene duration, so the
// choreography stretches with whatever length the recorded narration has.
export const beat = (
  frame: number,
  dur: number,
  from: number,
  to: number,
  easing = EASE,
) =>
  interpolate(frame, [from * dur, Math.max(from * dur + 1, to * dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
