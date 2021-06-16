import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/layout";
import { responsiveVisibiity } from "../responsiveUtils";

export default ({
  children,
  flex = "initial",
  hiddenOn = "none",
  shownOn = "none",
}: {
  children: ReactNode;
  flex?: string;
  hiddenOn?: string;
  shownOn?: string;
}) => (
  <Box
    p={1}
    flex={flex}
    flexDir="column"
    display={responsiveVisibiity(hiddenOn, shownOn, "flex", "none")}
  >
    {children}
  </Box>
);
