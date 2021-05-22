import React, { createContext, useContext } from "react";
import { GameState } from "../state/atoms";
import GameLayout from "./GameLayout";
import Layout from "./Layout";

export type GameViewState = {
  gameState: GameState | null;
};

const GameStateContext = createContext<GameViewState>({
  gameState: null,
});

export const useGameViewState = () => {
  const { gameState } = useContext(GameStateContext);
  if (!gameState) throw new Error("Undefined game state");

  return { gameState };
};

const GameView = ({ gameState }: { gameState: GameState }) => {
  const gameViewState: GameViewState = {
    gameState,
  };

  return (
    <GameStateContext.Provider value={gameViewState}>
      <Layout title="Game">
        <GameLayout />
      </Layout>
    </GameStateContext.Provider>
  );
};

export default GameView;
