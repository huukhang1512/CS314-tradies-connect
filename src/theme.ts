import { type ChakraTheme, extendTheme } from "@chakra-ui/react";
const disabledStyles = {
  backgroundColor: "blue.05",
};

const components: ChakraTheme["components"] = {
  Button: {
    baseStyle: {
      fontSize: "sm",
      fontWeight: "medium",
    },
    variants: {
      primary: {
        bg: "button.primary",
        color: "white",
        _disabled: {
          ...disabledStyles,
        },
        _hover: {
          _disabled: {
            ...disabledStyles
          }
        }
      },
      secondary: {
        bg: "button.secondary",
        color: "blue.primary",
      },
      link: {
        color: "blue.primary",
      },
    },
  },
};
const colors: ChakraTheme["colors"] = {
  blue: {
    "01": "#EAEEFF",
    "02": "#C9D4FF",
    "03": "#B7C5FF",
    "04": "#94A9FF",
    "05": "#708CFF",
    primary: "#4C6FFF",
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
  "2xl": "28px",
};

const fontWeights: ChakraTheme["fontWeights"] = {
  regular: 400,
  medium: 500,
  semibold: 600,
};
const customTheme = extendTheme({
  components,
  colors,
  fonts,
  fontSizes,
  fontWeights,
});
export default customTheme;
