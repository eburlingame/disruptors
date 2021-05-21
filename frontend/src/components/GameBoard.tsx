import React from "react";
import { GameState } from "../state/atoms";
import GameLayout from "./GameLayout";
import Layout from "./Layout";

const GameBoard = ({ gameState }: { gameState: GameState }) => {
  return (
    <Layout title="Game">
      <GameLayout />
    </Layout>
  );
};

export default GameBoard;
