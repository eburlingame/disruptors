import { Box, VStack } from "@chakra-ui/layout";
import React from "react";
import { useSessionState } from "../hooks/session";
import { responsiveVisibiity } from "../responsiveUtils";
import { GameState } from "../state/atoms";
import { getRoomPlayer } from "../utils/utils";
import Bank from "./Bank";
import GameBoard from "./GameBoard";
import GameColumn from "./GameColumn";
import { GameViewState, GameStateContext } from "./GameView";
import Layout from "./Layout";
import Players from "./Players";
import TabContainer from "./TabContainer";
import TabSet from "./TabSet";

export default ({ gameState }: { gameState: GameState }) => {
  const { room } = useSessionState();

  const gameViewState: GameViewState = {
    gameState,
  };

  const players = gameState.state.players.map((player) => ({
    ...getRoomPlayer(room, player.playerId),
    ...player,
  }));

  const winner = players.find((player) => player.points >= 10);

  return (
    <GameStateContext.Provider value={gameViewState}>
      <Layout>
        <Box textAlign="center" fontWeight="bold" fontSize="xx-large">
          {winner?.name} won!
        </Box>

        <Box flex="1" display="flex">
          {/* Left columns */}
          <GameColumn flex="1" hiddenOn="sm">
            <TabContainer flex="1">
              <TabSet tabs={[{ name: "Players", content: Players }]} />
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
