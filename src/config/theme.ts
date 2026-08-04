export type PillColor = {
  bg: string;
  fg: string;
};

export type LinkTreeTheme = {
  colors: {
    cream: string;
    ink: string;
    dim: string;
    rose: string;
    brown: string;
    denim: string;
    latte: string;
    border: string;
    scrollTrack: string;
    scrollThumb: string;
    scrollThumbHover: string;
    spiralFront: string;
  };
  pillColors: PillColor[];
};

export const theme: LinkTreeTheme = {
  colors: {
    cream: "#F4F2F8",
    ink: "#3B3A45",
    dim: "#86838F",
    rose: "#E7C6DC",
    brown: "#5D5A6B",
    denim: "#9BB4D4",
    latte: "#CFE0D6",
    border: "rgba(93,90,107,0.15)",
    scrollTrack: "rgba(155,180,212,0.20)",
    scrollThumb: "linear-gradient(180deg, rgba(93,90,107,0.60), rgba(155,180,212,0.55))",
    scrollThumbHover: "linear-gradient(180deg, rgba(59,58,69,0.72), rgba(155,180,212,0.70))",
    spiralFront: "#A9B8E8"
  },
  pillColors: [
    { bg: "#E7C6DC", fg: "#3B3A45" },
    { bg: "#CFE0D6", fg: "#3B3A45" },
    { bg: "#9BB4D4", fg: "#2B2A33" },
    { bg: "#F0E0BC", fg: "#3B3A45" }
  ]
};
