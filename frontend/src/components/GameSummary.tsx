import { Box, HStack } from "@chakra-ui/layout";
import React from "react";
import { useSessionState } from "../hooks/session";
import { responsiveVisibiity } from "../responsiveUtils";
import { GameState } from "../state/atoms";
import { useFinishGame } from "../hooks/room";
import { CatanGameSummary } from "../state/game_types";
import { getRoomPlayer } from "../utils/utils";
import GameBoard from "./GameBoard";
import GameColumn from "./GameColumn";
import { GameViewState, GameStateContext } from "./GameView";
import Layout from "./Layout";
import Players from "./Players";
import TabContainer from "./TabContainer";
import TabSet from "./TabSet";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Button } from "@chakra-ui/button";

const DiceChart = ({ diceFrequencies }: { diceFrequencies: number[] }) => {
  const data = diceFrequencies.map((value, index) => ({
    name: index.toString(),
    dice: value,
  }));

  return (
    <BarChart width={730} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" label="Frequency" color="#aaa" min={1} max={12} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="dice" fill="#8884d8" />
    </BarChart>
  );
};

export default ({ gameState }: { gameState: GameState }) => {
  const { room, you } = useSessionState();
  const { finishGame } = useFinishGame();

  const gameViewState: GameViewState = { gameState };

  if (!room || !room.gameSummary) {
    return <Layout>Invalid game summary</Layout>;
  }

  const gameSummary = room.gameSummary as CatanGameSummary;

  const players = gameSummary.players.map((player) => ({
    ...getRoomPlayer(room, player.playerId),
    ...player,
  }));

  const winner = players.find(
    (player) => player.playerId === gameSummary.winner
  );

  const onFinishGame = async () => {
    await finishGame();
  };

  return (
    <GameStateContext.Provider value={gameViewState}>
      <Layout>
        <HStack justifyContent="space-between" marginY="2" p="2">
          {you?.isHost && (
            <Box>
              <Button colorScheme="green" onClick={onFinishGame}>
                Done
              </Button>
            </Box>
          )}
          <Box textAlign="center" fontWeight="bold" fontSize="xx-large">
            {winner?.name} won!
          </Box>
          <Box></Box>
        </HStack>

        <Box flex="1" display="flex">
          {/* Left columns */}
          <GameColumn flex="1" hiddenOn="sm">
            <TabContainer flex="1">
              <TabSet
                tabs={[
                  { name: "Players", content: Players },
                  {
                    name: "Dice Rolls",
                    content: () => (
                      <DiceChart
                        diceFrequencies={gameSummary.diceFrequencies}
                      />
                    ),
                  },
                ]}
              />
            </TabContainer>
          </GameColumn>

          {/* Middle column */}
          <GameColumn flex="1">
            <TabContainer flex="1">
              <TabSet
                tabs={[
                  {
                    name: "Board",
                    content: () => (
                      <Box
                        bgColor="blue.800"
                        alignSelf="stretch"
                        display={responsiveVisibiity(
                          "xs",
                          "none",
                          "inherit",
                          "none"
                        )}
                        flex="1 1 auto"
                        height="0px"
                        overflowY="hidden"
                      >
                        <GameBoard />
                      </Box>
                    ),
                  },
                ]}
              />
            </TabContainer>
          </GameColumn>
        </Box>
      </Layout>
    </GameStateContext.Provider>
  );
};
