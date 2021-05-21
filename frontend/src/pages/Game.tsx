import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import GameBoard from "../components/GameBoard";
import Lobby from "../components/Lobby";
import { useSessionLoadingState, useSessionState } from "../hooks/session";
import { RoomPhase } from "../state/atoms";

const GamePage = ({}) => {
  const history = useHistory();

  const { isOpen } = useSessionLoadingState();
  const { roomCode } = useParams<{ roomCode: string }>();
  const sessionState = useSessionState();

  if (
    sessionState.room &&
    sessionState.room.phase === RoomPhase.PLAYING &&
    sessionState.room.gameState
  ) {
    return <GameBoard gameState={sessionState.room.gameState} />;
  }

  return <Lobby sessionState={sessionState} />;
};

export default GamePage;
