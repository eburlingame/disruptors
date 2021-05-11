import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import Layout from "../components/Layout";
import { useJoinRoom } from "../hooks/join";
import { gameRoomAtom } from "../state/atoms";

const GamePage = ({}) => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const [gameRoomState, setGameRoomState] = useRecoilState(gameRoomAtom);

  const { joinRoom, joining } = useJoinRoom();

  useEffect(() => {

    if (
      !gameRoomState.gameRoomCode ||
      gameRoomState.gameRoomCode !== roomCode
    ) {
      joinRoom(roomCode);
    }
  }, [roomCode, gameRoomState.gameRoomCode]);

  return (
    <Layout title="Game">
      <Center mt="8">{roomCode}</Center>
    </Layout>
  );
};

export default GamePage;
