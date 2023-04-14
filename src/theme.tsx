import { type ChakraTheme, extendTheme } from "@chakra-ui/react";

const colors: ChakraTheme["colors"] = {
  blue: {
    100: "#EAEEFF",
    200: "#C9D4FF",
    300: "#B7C5FF",
    400: "#94A9FF",
    500: "#708CFF",
    600: "#4C6FFF", // primary
  },
  background: {
    gray: "#F4F5FB",
  },
  text: {
    primary: "#2D303D",
    secondary: "#5A5F75",
    third: "#9EA3B1",
    disable: "#D8DAE2",
  },
  status: {
    error: "#F16063",
    success: "#66CB9F",
  },
  button: {
    primary: "#4C6FFF",
    secondary: "#E4ECF7",
  },
  measurement: {
    green: "#04CC88",
    orange: "#FF8C03",
    yellow: "#FFBD02",
    purple: "#8A5AFF",
    blue: "#68DBF2",
  },
};

const fonts: ChakraTheme["fonts"] = {
  body: "Rubik, sans-serif",
  heading: "Rubik, sans-serif",
};

const fontSizes: ChakraTheme["fontSizes"] = {
  sm: "14px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  xxl: "28px",
};

const fontWeight: ChakraTheme["fontWeight"] = {
  regular: 400,
  medium: 500,
  semibold: 600,
};
const customTheme = extendTheme({ colors, fonts, fontSizes, fontWeight });
export default customTheme;
