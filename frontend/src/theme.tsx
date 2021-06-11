import { createBreakpoints } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: mode("white", "gray.900")(props),
      },
    }),
  },
  fonts: {
    heading: "Lato",
    body: "Lato",
  },
  breakpoints: createBreakpoints({
    sm: "42em",
    md: "60em",
    lg: "80em",
    xl: "95em",
    "2xl": "110em",
  }),
  colors: {
    gray: {
      // 900: "#1F1F1F",
      // 800: "#333333",
      // 700: "#474747",
      // 600: "#5C5C5C",
      // 500: "#7A7A7A",
      // 400: "#999999",
      // 300: "#B8B8B8",
      // 200: "#D6D6D6",
      // 100: "#F5F5F5",
    },
  },
});

export default theme;
