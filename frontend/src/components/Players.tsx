import React from "react";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
import { useGameViewState } from "./GameView";
import { useSessionState } from "../hooks/session";
import { FaCreditCard, FaUser } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";
import CardCount from "./CardCount";
import { useColorModeValue } from "@chakra-ui/color-mode";
import gameTheme from "../utils/game_theme";

const Players = ({}) => {
  const { room } = useSessionState();
  const { gameState } = useGameViewState();

  const activeColor = useColorModeValue("blue.400", "blue.600");

  if (!room) {
    return <Box>Invalid players</Box>;
  }
  const { players: roomPlayers } = room;

  /// Combine the room players with the game players
  const players = gameState.state.players.map((gamePlayer) => ({
    roomPlayer: roomPlayers.find(
      (roomPlayer) => gamePlayer.playerId === roomPlayer.playerId
    ),
    gamePlayer: gamePlayer,
  }));

  return (
    <VStack
      alignItems="stretch"
      flex="1 1 auto"
      height="0px"
      overflowY="scroll"
    >
      {players.map(
        ({
          roomPlayer,
          gamePlayer: {
            color,
            playerId,
            totalResourceCards,
            totalDevelopmentCards,
            longestRoad,
            robberDeployCount,
            points,
          },
        }) => (
          <VStack
            borderStyle="solid"
            rounded="md"
            p="2"
            justifyContent="space-between"
            alignItems="flex-start"
            borderColor={
              gameState.state.activePlayerId === playerId
                ? activeColor
                : "inherit"
            }
            borderWidth={
              gameState.state.activePlayerId === playerId ? "2px" : "0.5px"
            }
          >
            <HStack marginLeft="2">
              <Box fontSize="xl">
                <FaUser color={gameTheme.playerColors[color].primary} />
              </Box>
              <Box fontWeight="900" fontSize="xl" marginTop="4" marginLeft="2">
                {roomPlayer?.name}
              </Box>
            </HStack>

            <HStack justifyContent="center" width="100%">
              <CardCount
                icon={<gameTheme.victoryPoints.icon />}
                label={gameTheme.victoryPoints.label}
                count={points}
              />
              <CardCount
                icon={<gameTheme.buildings.road.icon />}
                label={gameTheme.buildings.road.label}
                count={longestRoad}
              />
              <CardCount
                icon={<gameTheme.robber.icon />}
                label={gameTheme.robber.label + " uses"}
                count={robberDeployCount}
              />
              <CardCount
                icon={<gameTheme.resourceCards.icon />}
                label={gameTheme.resourceCards.label}
                count={totalResourceCards}
              />
              <CardCount
                icon={<FaCreditCard />}
                label={"Development cards"}
                count={totalDevelopmentCards}
              />
            </HStack>
          </VStack>
        )
      )}
    </VStack>
  );
};

export default Players;
