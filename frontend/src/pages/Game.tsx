import React, { useEffect } from "react";
import { useParams } from "react-router";
import GameView from "../components/GameView";
import Lobby from "../components/Lobby";
import { useJoinRoom } from "../hooks/room";
import { useSessionState } from "../hooks/session";
import { RoomPhase } from "../state/atoms";
import Loading from "./Loading";

const GamePage = ({}) => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const sessionState = useSessionState();

  const { joinRoom, joining } = useJoinRoom();

  useEffect(() => {
    const rejoinCorrectRoom = async () => {
      if (
        sessionState.room?.roomCode &&
        sessionState.room?.roomCode !== roomCode
      ) {
        await joinRoom(roomCode);
      }
    };

    rejoinCorrectRoom();
  }, [sessionState, roomCode]);

  if (joining) {
    return <Loading />;
  }

  if (
    sessionState.room &&
    sessionState.room.phase === RoomPhase.PLAYING &&
    sessionState.room.gameState
  ) {
    return <GameView gameState={sessionState.room.gameState} />;
  }

  return <Lobby sessionState={sessionState} />;
};

export default GamePage;
