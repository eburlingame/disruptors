import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useRecoilState } from "recoil";
import Layout from "../components/Layout";
import { useJoinRoom } from "../hooks/join";
import { useLeaveRoom } from "../hooks/leave";
import { useSession } from "../hooks/session";
import { gameRoomAtom } from "../state/atoms";

const GamePage = ({}) => {
  const history = useHistory();

  const { isOpen } = useSession();
  const { roomCode } = useParams<{ roomCode: string }>();
  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);

  const { joinRoom, joining } = useJoinRoom();
  const { leaveRoom, leaving } = useLeaveRoom();

  useEffect(() => {
    if (isOpen) {
      if (
        gameRoomState.gameRoomCode === null ||
        gameRoomState.gameRoomCode !== roomCode
      ) {
        console.log("Attempting to join room " + roomCode);
        joinRoom(roomCode);
      }
    }
  }, [roomCode, gameRoomState.gameRoomCode, isOpen]);

  const onLeave = async () => {
    await leaveRoom();
    history.push("/");
  };

  if (joining) {
    return <Layout title="">Joining the game room...</Layout>;
  }

  return (
    <Layout title="Game">
      <Center mt="8">{roomCode}</Center>

      <Button onClick={onLeave}>Leave</Button>
    </Layout>
  );
};

export default GamePage;
