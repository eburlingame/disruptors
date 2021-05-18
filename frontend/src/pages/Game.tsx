import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../components/ErrorAlert";
import Layout from "../components/Layout";
import { useSessionLoadingState, useSessionState } from "../hooks/session";

import {
  GameConfig,
  useConfigureGame,
  useConfigurePlayer,
  useJoinRoom,
  useLeaveRoom,
} from "../hooks/room";
import { Input } from "@chakra-ui/input";
import { Select } from "@chakra-ui/select";

const GamePage = ({}) => {
  const history = useHistory();
  const errorModalDisclosure = useDisclosure();

  const { isOpen } = useSessionLoadingState();
  const { roomCode } = useParams<{ roomCode: string }>();
  const sessionState = useSessionState();

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
    const result = await configurePlayer(draftPlayerName);
  };

  const { configureGame, error: configGameError } = useConfigureGame();
  const [draftGameConfig, setDraftGameConfig] = useState<GameConfig>(
    sessionState.room?.gameConfig
  );

  const changeGameConfig = async (updatedConfig: Partial<GameConfig>) => {
    const newConfig = { ...draftGameConfig, ...updatedConfig };
    setDraftGameConfig(newConfig);
    const reuslt = await configureGame(newConfig);
  };

  useEffect(() => {
    /// Open error modal if new error is encountered
    if (joinError || configGameError || configPlayerError) {
      errorModalDisclosure.onOpen();
    }
  }, [joinError, configGameError, configPlayerError]);

  if (joining) {
    return <Layout title="">Joining the game room...</Layout>;
  }

  return (
    <Layout title="Game">
      <VStack mt="8" maxWidth="60ch" marginX="auto">
        <Box>Room Code: {roomCode}</Box>

        <VStack>
          <Box>Game configuration:</Box>
          {sessionState.you?.isHost && (
            <Box>
              <HStack>
                <Box>Card Discard Limit:</Box>
                <Select
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
              </HStack>
            </Box>
          )}
          {!sessionState.you?.isHost && (
            <HStack>
              <Box>Card Discard Limit:</Box>
              <Box>{sessionState.room?.gameConfig.cardDiscardLimit}</Box>
            </HStack>
          )}
        </VStack>

        <HStack>
          <Box>Your name:</Box>
          <Input
            flex={1}
            value={draftPlayerName}
            onChange={(e) => setDraftPlayerName(e.target.value)}
          />
          <Button onClick={changeName}>Change Name</Button>
        </HStack>

        <Box>
          <Box>Players:</Box>
          {sessionState.room?.players
            .filter((player) => player.playerId !== sessionState.you?.playerId)
            .map((p) => (
              <li>{p.name}</li>
            ))}
        </Box>

        <Button onClick={onLeave}>Leave Game</Button>
      </VStack>

      <ErrorAlert
        title={"Error"}
        body={joinError || configPlayerError || configGameError || ""}
        {...errorModalDisclosure}
      />
    </Layout>
  );
};

export default GamePage;
