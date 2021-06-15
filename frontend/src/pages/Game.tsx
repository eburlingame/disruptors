import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import GameView from "../components/GameView";
import Lobby from "../components/Lobby";
import { useSessionLoadingState, useSessionState } from "../hooks/session";
import { RoomPhase } from "../state/atoms";

const GamePage = ({}) => {
  const sessionState = useSessionState();

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
