import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { exit } from "node:process";
import React, { ReactNode } from "react";
import { useHistory } from "react-router";
import { useLeaveRoom } from "../hooks/room";
import { useSessionState } from "../hooks/session";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const Layout = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const history = useHistory();
  const sessionState = useSessionState();
  const { leaveRoom } = useLeaveRoom();

  const onExit = async () => {
    if (sessionState.room) {
      await leaveRoom();
    }
    history.push("/");
  };

  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDir="column"
      overflow="hidden"
    >
      <HStack bgColor="gray.700" justifyContent="flex-end" p={2}>
        <Button variant="ghost" size="xs" onClick={onExit}>
          Exit
        </Button>
        <ColorModeSwitcher size="xs" />
      </HStack>
      <Box flex="1" display="flex" flexDir="column">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
