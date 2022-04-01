import breakpoints from "./breakpoints";
import typo from "./typography";

const base = {
  ...typo,
  ...breakpoints,
};

const colors = {
  primary: "#3469f0" || process.env.REACT_APP_PRIMARY_COLOR || "#68CA6D" || "#0095eb",
  board: "linear-gradient(to right, rgba(57,100,208,1) 0%, rgba(45,193,201,1) 100%)" || process.env.REACT_APP_BOARD_COLOR,
  chart: process.env.REACT_APP_CHART_COLOR || "#68CA6D",
  actionBg: "linear-gradient(to right, rgba(57,100,208,1) 0%, rgba(45,193,201,1) 100%)" || process.env.REACT_APP_ACTION_BG,
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
    bg: "rgb(8, 9, 27)",
    bgContrast: "rgb(16, 18, 45)",
    skeleton: "linear-gradient(-90deg, #2f3137 0%, #242526 50%, #2f3137 100%)",

    //computed
    actionBg: colors.actionBg || "#335C67",
    secondary: "#7B818E",
  },
};
