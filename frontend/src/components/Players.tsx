import React from "react";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
import { useGameViewState } from "./GameView";
import { useSessionState } from "../hooks/session";
import { FaUser } from "react-icons/fa";
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
    <VStack alignItems="stretch" overflowY="scroll">
      {players.map(
        ({
          roomPlayer,
          gamePlayer: {
            color,
            playerId,
            totalResourceCards,
            totalDevelopmentCards,
            points,
          },
        }) => (
          <HStack
            borderStyle="solid"
            rounded="md"
            p="2"
            justifyContent="space-between"
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
              <Tooltip label={"Bitcoin"}>
                <VStack>
                  <Box fontSize="xl">
                    <FaUser color={gameTheme.playerColors[color].primary} />
                  </Box>
                  <Box fontWeight="900" fontSize="xl" marginTop="2">
                    {roomPlayer?.name}
                  </Box>
                </VStack>
              </Tooltip>
            </HStack>

            <HStack>
              <CardCount
                icon={<gameTheme.victoryPoints.icon />}
                label={gameTheme.victoryPoints.label}
                count={points}
              />
              <CardCount
                icon={<gameTheme.resourceCards.icon />}
                label={gameTheme.resourceCards.label}
                count={totalResourceCards}
              />
              <CardCount
                icon={<gameTheme.developmentCards.icon />}
                label={gameTheme.developmentCards.label}
                count={totalDevelopmentCards}
              />
            </HStack>
          </HStack>
        )
      )}
    </VStack>
  );
};

export default Players;
