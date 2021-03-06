import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../components/ErrorAlert";
import Layout from "../components/Layout";
import { useSessionLoadingState, useSessionState } from "../hooks/session";

import {
  useConfigureGame,
  useConfigurePlayer,
  useJoinRoom,
  useLeaveRoom,
  useStartGame,
} from "../hooks/room";
import { Input } from "@chakra-ui/input";
import { Select } from "@chakra-ui/select";
import { SessionState } from "../state/atoms";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { BoardType, CatanConfig } from "../state/game_types";

const boardTypeOptions = [
  {
    value: BoardType.STATIC_SMALL,
    label: "Small board (fixed)",
  },

  {
    value: BoardType.VARIABLE_SMALL,
    label: "Small board (random)",
  },

  {
    value: BoardType.STATIC_LARGE,
    label: "Large board (fixed)",
  },

  {
    value: BoardType.VARIABLE_LARGE,
    label: "Large board (random)",
  },
];

const Lobby = ({ sessionState }: { sessionState: SessionState }) => {
  const history = useHistory();
  const errorModalDisclosure = useDisclosure();

  const { isOpen } = useSessionLoadingState();
  const { roomCode } = useParams<{ roomCode: string }>();

  const [adhocError, setAdhocError] = useState<string | null>(null);
  const { joinRoom, joining, error: joinError } = useJoinRoom();
  const { leaveRoom, leaving } = useLeaveRoom();

  useEffect(() => {
    const attemptJoinRoom = async () => {
      console.log("Attempting to join room " + roomCode);
      await joinRoom(roomCode);
    };

    if (isOpen) {
      if (!sessionState.room || sessionState.room.roomCode !== roomCode) {
        attemptJoinRoom();
      }
    }
  }, [roomCode, sessionState.room, isOpen]);

  const onLeave = async () => {
    await leaveRoom();
    history.push("/");
  };

  const [draftPlayerName, setDraftPlayerName] = useState(
    (sessionState.you && sessionState.you.name) || ""
  );

  const { configurePlayer, error: configPlayerError } = useConfigurePlayer();
  const changeName = async () => {
    setAdhocError(null);

    const newName = draftPlayerName.trim();

    if (newName.length === 0) {
      setAdhocError("Name cannot be empty");
      return;
    }

    if (newName.length > 20) {
      setAdhocError("Name must be less than 20 chars");
      return;
    }

    await configurePlayer(newName);
    setDraftPlayerName(newName);
  };

  const { configureGame, error: configGameError } = useConfigureGame();
  const [draftGameConfig, setDraftGameConfig] = useState<CatanConfig>(
    sessionState.room?.gameConfig
  );

  const changeGameConfig = async (updatedConfig: Partial<CatanConfig>) => {
    const newConfig = { ...draftGameConfig, ...updatedConfig };
    setDraftGameConfig(newConfig);
    await configureGame(newConfig);
  };

  const { startGame, error: startError } = useStartGame();

  useEffect(() => {
    /// Open error modal if new error is encountered
    if (
      joinError ||
      configGameError ||
      configPlayerError ||
      startError ||
      adhocError
    ) {
      errorModalDisclosure.onOpen();
    }
  }, [joinError, configGameError, configPlayerError, startError, adhocError]);

  const borderColor = useColorModeValue("gray.100", "gray.700");

  if (joining) {
    return <Layout>Joining the game room...</Layout>;
  }

  return (
    <Layout>
      <Box mt="8" maxWidth="60ch" marginX="auto" textAlign="center" p="2">
        <Box fontWeight="extrabold" fontSize="2xl" marginBottom="4">
          Game Lobby
        </Box>

        <HStack marginTop="8">
          <Box>Your name:</Box>

          <Input
            flex={1}
            value={draftPlayerName}
            onChange={(e) => setDraftPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && changeName()}
          />
          <Button onClick={changeName}>Set Name</Button>
        </HStack>

        <HStack width="100%" marginTop="8" alignItems="stretch">
          <VStack
            borderWidth="thin"
            rounded="md"
            borderColor={borderColor}
            p={2}
            flex="1"
          >
            <Box fontSize="lg" fontWeight="medium" marginBottom="2">
              Players
            </Box>

            {sessionState.room?.players.map((p) => (
              <HStack>
                <Box>{p.name === "" ? "No name" : p.name}</Box>
                {sessionState.you?.playerId === p.playerId && <Box>(You)</Box>}
              </HStack>
            ))}
          </VStack>

          <Box
            borderWidth="thin"
            rounded="md"
            borderColor={borderColor}
            p={2}
            flex="1"
          >
            <Box fontSize="lg" fontWeight="medium" marginBottom="2">
              Game Code
            </Box>
            <Box fontWeight="extrabold" fontSize="3xl">
              {roomCode}
            </Box>
          </Box>
        </HStack>

        <VStack
          borderWidth="thin"
          rounded="md"
          borderColor={borderColor}
          p={4}
          width="100%"
          marginTop="4"
        >
          <Box fontSize="lg" fontWeight="medium">
            Game Options
          </Box>

          {sessionState.you?.isHost && (
            <>
              <HStack width="100%" justifyContent="space-between">
                <Box>Board Type:</Box>

                <Box>
                  <Select
                    width="inherit"
                    value={draftGameConfig.boardType}
                    onChange={(e) =>
                      changeGameConfig({
                        boardType: e.target.value as BoardType,
                      })
                    }
                  >
                    {boardTypeOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Box>
              </HStack>
              <HStack width="100%" justifyContent="space-between">
                <Box>Card Discard Limit:</Box>

                <Box>
                  <Select
                    width="inherit"
                    value={draftGameConfig.cardDiscardLimit}
                    onChange={(e) =>
                      changeGameConfig({
                        cardDiscardLimit: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="7">7 cards</option>
                    <option value="10">10 cards</option>
                  </Select>
                </Box>
              </HStack>
            </>
          )}

          {!sessionState.you?.isHost && (
            <>
              <HStack width="100%" justifyContent="space-between">
                <Box>Board Type:</Box>

                <Box fontWeight="bold">
                  {boardTypeOptions.find(
                    (option) =>
                      option.value === sessionState.room?.gameConfig.boardType
                  )?.label || "Unknown"}
                </Box>
              </HStack>
              <HStack width="100%" justifyContent="space-between">
                <Box>Card Discard Limit:</Box>

                <Box fontWeight="bold">
                  {sessionState.room?.gameConfig.cardDiscardLimit}
                </Box>
              </HStack>
            </>
          )}
        </VStack>

        <VStack marginTop="8">
          {sessionState.you?.isHost && (
            <Button onClick={() => startGame()} colorScheme="green">
              Start Game
            </Button>
          )}

          <Button
            onClick={onLeave}
            variant="outline"
            colorScheme="red"
            size="sm"
          >
            Leave Game
          </Button>
        </VStack>
      </Box>

      <ErrorAlert
        title={"Error"}
        body={
          joinError || configPlayerError || configGameError || adhocError || ""
        }
        {...errorModalDisclosure}
      />
    </Layout>
  );
};

export default Lobby;
