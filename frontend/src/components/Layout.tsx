import React, { ReactNode } from "react";
import { Button } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box, HStack } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { Spinner } from "@chakra-ui/react";
import { useHistory } from "react-router";
import { useLeaveRoom } from "../hooks/room";
import { useSessionLoadingState, useSessionState } from "../hooks/session";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { FaCircle } from "react-icons/fa";

const ConnectionStatus = ({}) => {
  const loading = useSessionLoadingState();

  if (loading.isLoading) {
    return (
      <Tooltip label="Reconnecting...">
        <Box>
          <Spinner maxH="10px" maxW="10px" color="yellow.300" />
        </Box>
      </Tooltip>
    );
  }

  if (loading.isOpen) {
    return (
      <Tooltip label="Connected">
        <Box fontSize="8px" color="green.400">
          <FaCircle />
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip label="Disconnected">
      <Box fontSize="8px" color="red.400">
        <FaCircle />
      </Box>
    </Tooltip>
  );
};

const Layout = ({
  children,
  showQuit = false,
  showLeave = false,
}: {
  children: ReactNode;
  showQuit?: boolean;
  showLeave?: boolean;
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

  const onLeave = async () => {
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
        <Box marginLeft="2">
          <ConnectionStatus />
        </Box>

        <HStack>
          {showQuit && (
            <Tooltip label="Quit">
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

          {showLeave && (
            <Tooltip label="Leave game">
              <Button
                variant="ghost"
                size="xs"
                onClick={onLeave}
                colorScheme="red"
              >
                Leave
              </Button>
            </Tooltip>
          )}

          <ColorModeSwitcher size="xs" />
        </HStack>
      </HStack>
      <Box flex="1" display="flex" flexDir="column">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
