import breakpoints from "./breakpoints";
import typo from "./typography";

const base = {
  ...typo,
  ...breakpoints,
};

const colors = {
  primary: process.env.REACT_APP_PRIMARY_COLOR,
  board: process.env.REACT_APP_BOARD_COLOR,
  chart: process.env.REACT_APP_CHART_COLOR || "#68CA6D",
  actionBg: process.env.REACT_APP_ACTION_BG,
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
    secondary: "#EBEBEB",
  },
};

export const dark = {
  ...base,
  colors: {
    ...colors,
    text: "#fff",
    invertText: "#000",
    bg: "#242526",
    bgImage: "#242526",
    bgContrast: "#2F3137",
    skeleton: "linear-gradient(-90deg, #2f3137 0%, #242526 50%, #2f3137 100%)",

    //computed
    actionBg: colors.actionBg || "#335C67",
    secondary: "#7B818E",
  },
};
