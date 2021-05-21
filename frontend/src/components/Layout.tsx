import { Box, HStack } from "@chakra-ui/layout";
import React, { ReactNode } from "react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const Layout = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDir="column"
      overflow="hidden"
    >
      <HStack bgColor="gray.700" justifyContent="flex-end" p={2}>
        <ColorModeSwitcher size="xs" />
      </HStack>
      <Box flex="1" display="flex" flexDir="column">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
