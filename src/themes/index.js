import breakpoints from "./breakpoints";
import typo from "./typography";

const base = {
  ...typo,
  ...breakpoints,
};

const colors = {
  primary: "#0887f2",
  board: "#0887f2" || "#05AAC5" || process.env.REACT_APP_BOARD_COLOR,
  chart: "#68CA6D",
  actionBg: "#101420" || process.env.REACT_APP_ACTION_BG,
  danger: "#FF4747",
  success: "#09c064" || "#68CA6D",
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
    secondary: "#09c064" || "#EBEBEB",
    banner: "#101420",
    wallet: "#f0f0f0"
  },
};

export const dark = {
  ...base,
  colors: {
    ...colors,
    text: "#fff",
    invertText: "#000",
    bg: "#101420" || "#242526",
    bgContrast: "#1b2433" || "#2F3137",
    skeleton: "linear-gradient(-90deg, #2f3137 0%, #242526 50%, #2f3137 100%)",

    //computed
    actionBg: colors.actionBg || "#335C67",
    secondary: "#09c064" || "#7B818E",
    banner: "#0887f2",
    wallet: "#222a3e"
  },
};
