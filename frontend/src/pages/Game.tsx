import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Center } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useRecoilState } from "recoil";
import ErrorAlert from "../components/ErrorAlert";
import Layout from "../components/Layout";
import { useJoinRoom } from "../hooks/join";
import { useLeaveRoom } from "../hooks/leave";
import { useSession } from "../hooks/session";
import { gameRoomAtom } from "../state/atoms";

const GamePage = ({}) => {
  const history = useHistory();
  const errorModalDisclosure = useDisclosure();

  const { isOpen } = useSession();
  const { roomCode } = useParams<{ roomCode: string }>();
  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);

  const { joinRoom, joining, error: joinError } = useJoinRoom();
  const { leaveRoom, leaving } = useLeaveRoom();

  useEffect(() => {
    const attemptJoinRoom = async () => {
      console.log("Attempting to join room " + roomCode);
      await joinRoom(roomCode);
    };

    if (isOpen) {
      if (
        gameRoomState.gameRoomCode === null ||
        gameRoomState.gameRoomCode !== roomCode
      ) {
        attemptJoinRoom();
      }
    }
  }, [roomCode, gameRoomState.gameRoomCode, isOpen]);

  useEffect(() => {
    if (joinError) {
      errorModalDisclosure.onOpen();
    }
  }, [joinError]);

  const onLeave = async () => {
    await leaveRoom();
    history.push("/");
  };

  if (joining) {
    return <Layout title="">Joining the game room...</Layout>;
  }

  return (
    <Layout title="Game">
      <Center mt="8">
        {roomCode}
        <Button onClick={onLeave}>Leave</Button>
      </Center>

      <ErrorAlert
        title={"Error loading game"}
        body={joinError || ""}
        {...errorModalDisclosure}
      />
    </Layout>
  );
};

export default GamePage;
