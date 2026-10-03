export type LinkTreeTheme = {
  colors: {
    bg: string;
    bgGlow: string;
    card: string;
    ink: string;
    title: string;
    dim: string;
    line: string;
    gold: string;
    lilac: string;
  };
  // Gradient pairs for cards that have no illustration yet.
  artFallbacks: [string, string][];
};

export const theme: LinkTreeTheme = {
  colors: {
    bg: "#0C0F24",
    bgGlow: "rgba(110,125,230,0.38)",
    card: "#151936",
    ink: "#EDEBFA",
    title: "#F7E7C4",
    dim: "#9EA3C6",
    line: "rgba(255,255,255,0.10)",
    gold: "#F2C879",
    lilac: "#A9B8E8"
  },
  artFallbacks: [
    ["#1A1F45", "#3A4290"],
    ["#1B2A4A", "#2F5F8A"],
    ["#2A1F45", "#5A3F8A"],
    ["#1F3340", "#2F6A6F"],
    ["#33264A", "#7A5A9A"]
  ]
};
