import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { useGameViewState } from "./GameView";
import { useSessionState } from "../hooks/session";
import { RoomPlayer } from "../state/atoms";
import { FaIdCard, FaQuestionCircle, FaSimCard, FaUser } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";
import CardCount from "./CardCount";
import { useColorModeValue } from "@chakra-ui/color-mode";

const Players = ({}) => {
  const { room } = useSessionState();
  const { gameState } = useGameViewState();

  const activeColor = useColorModeValue("blue.400", "blue.800");

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
          gamePlayer: { playerId, totalResourceCards, totalDevelopmentCards },
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
              <FaUser />
              <Box fontWeight="700">{roomPlayer?.name}</Box>
            </HStack>

            <HStack>
              <CardCount
                icon={<FaIdCard />}
                label="Resource cards"
                count={totalResourceCards}
              />
              <CardCount
                icon={<FaQuestionCircle />}
                label="Development cards"
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
