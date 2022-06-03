import breakpoints from "./breakpoints";
import typo from "./typography";

const base = {
  ...typo,
  ...breakpoints,
};

const colors = {
  primary: "linear-gradient(90deg,#00ce7c,#4ac1e0)" || "#122a4d" || process.env.REACT_APP_PRIMARY_COLOR || "#68CA6D" || "#0095eb",
  board: "linear-gradient(125deg,#131e29,#003f58 99%)" || "#122a4d" || process.env.REACT_APP_BOARD_COLOR,
  chart: process.env.REACT_APP_CHART_COLOR || "#68CA6D",
  actionBg: "#003f58" || "#204274" || process.env.REACT_APP_ACTION_BG,
  danger: "#FF4747",
  success: "#68CA6D",
};

export const light = {
  ...base,
  colors: {
    ...colors,
    text: "#141414",
    invertText: "#fff",
    bg: "#f0f0f0",
    bgContrast: "white",
    skeleton: "linear-gradient(-90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%)",

    //computed
    actionBg: colors.actionBg || "#383B42",
    secondary: "#4ac1e0" || "#1A2C79",
  },
};

export const dark = {
  ...base,
  colors: {
    ...colors,
    text: "#fff",
    invertText: "#000",
    bg: "#242526",
    bgContrast: "#2F3137",
    skeleton: "linear-gradient(-90deg, #2f3137 0%, #242526 50%, #2f3137 100%)",

    //computed
    actionBg: colors.actionBg || "#383B42",
    secondary: "#1A2C79",
  },
};
