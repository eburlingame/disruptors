import { Box } from "@chakra-ui/layout";
import React, { ReactNode } from "react";
import { responsiveVisibiity } from "../responsiveUtils";

export default ({
  flex,
  minWidth = "inherit",
  children,
  hiddenOn = "none",
  shownOn = "none",
}: {
  flex: string;
  minWidth?: string;
  hiddenOn?: string;
  shownOn?: string;
  children: ReactNode;
}) => (
  <Box
    flex={flex}
    minW={minWidth}
    alignSelf="stretch"
    display={responsiveVisibiity(hiddenOn, shownOn, "flex", "none")}
    flexDir="column"
    p="1"
  >
    {children}
  </Box>
);
