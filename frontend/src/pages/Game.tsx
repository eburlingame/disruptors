import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, VStack } from "@chakra-ui/layout";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../components/ErrorAlert";
import Layout from "../components/Layout";
import { useSessionLoadingState, useSessionState } from "../hooks/session";

import { useJoinRoom, useLeaveRoom } from "../hooks/room";

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

  useEffect(() => {
    if (joinError) {
      errorModalDisclosure.onOpen();
    }
  }, [joinError]);

  const onLeave = async () => {
    await leaveRoom();
    history.push("/");
  };

  console.log(sessionState);

  if (joining) {
    return <Layout title="">Joining the game room...</Layout>;
  }

  return (
    <Layout title="Game">
      <VStack mt="8">
        <Box>{roomCode}</Box>
        <Button onClick={onLeave}>Leave</Button>
        <Box>
          {sessionState.room?.players.map((p) => (
            <Box>{p.playerId}</Box>
          ))}
        </Box>
      </VStack>

      <ErrorAlert
        title={"Error loading game"}
        body={joinError || ""}
        {...errorModalDisclosure}
      />
    </Layout>
  );
};

export default GamePage;
