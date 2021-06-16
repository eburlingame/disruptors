import { Button } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box, HStack } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { exit } from "node:process";
import React, { ReactNode } from "react";
import { useHistory } from "react-router";
import { useLeaveRoom } from "../hooks/room";
import { useSessionState } from "../hooks/session";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const Layout = ({
  children,
  hideQuit = false,
}: {
  children: ReactNode;
  hideQuit?: boolean;
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

  const backgroundColor = useColorModeValue("gray.700", "gray.700");
  const color = useColorModeValue("gray.400", "gray.300");

  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDir="column"
      overflow="hidden"
    >
      <HStack
        bgColor={backgroundColor}
        color={color}
        justifyContent="space-between"
        p={2}
      >
        <ColorModeSwitcher size="xs" />
        {!hideQuit && (
          <Tooltip label="Leave game">
            <Button
              variant="ghost"
              size="xs"
              onClick={onExit}
              colorScheme="red"
            >
              Quit
            </Button>
          </Tooltip>
        )}
      </HStack>
      <Box flex="1" display="flex" flexDir="column">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
