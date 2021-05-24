import { createBreakpoints } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
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
});

export default theme;
