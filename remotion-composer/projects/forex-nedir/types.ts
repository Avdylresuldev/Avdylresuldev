export type Section = {
  id: string;
  durationSec: number;
  // Narration file for this section, relative to the project public dir.
  audio?: string;
  // Delay before the narration starts inside the section.
  audioOffsetSec?: number;
  // Spoken text, split into caption chunks timed by character length.
  captions: string[];
};

export type Labels = {
  sectionNames: string[];
  hook: {
    noteFrom: string;
    noteTo: string;
    board: string;
    title: string;
    subtitle: string;
  };
  what: {
    cities: string[];
    hours: string;
    players: string[];
    volumeValue: number;
    volumeDecimalSep: string;
    volumeUnit: string;
    volumeLabel: string;
    source: string;
  };
  pair: {
    base: string;
    quote: string;
    rate: string;
    baseCoin: string;
    quoteCoin: string;
    buy: string;
    buyHint: string;
    sell: string;
    sellHint: string;
  };
  leverage: {
    title: string;
    own: string;
    position: string;
    ownLabel: string;
    positionLabel: string;
    up: string;
    upResult: string;
    upLabel: string;
    down: string;
    downResult: string;
    downLabel: string;
  };
  close: {
    warning: string;
    checks: string[];
    disclaimer: string;
  };
};

export type ForexProps = {
  sections: Section[];
  labels: Labels;
  music?: string;
  musicVolume?: number;
  showCaptions?: boolean;
};
