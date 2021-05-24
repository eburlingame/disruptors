import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { useGameViewState } from "./GameView";
import { useSessionState } from "../hooks/session";
import { RoomPlayer } from "../state/atoms";
import { FaIdCard, FaQuestionCircle, FaSimCard, FaUser } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";
import CardCount from "./CardCount";

const Players = ({}) => {
  const { room } = useSessionState();
  const { gameState } = useGameViewState();

  if (!room) {
    return <Box>Invalid players</Box>;
  }
  const { players: roomPlayers } = room;

  /// Combine the room players with the game players
  const players: RoomPlayer[] = gameState.state.players
    .map(({ playerId }) =>
      roomPlayers.find((roomPlayer) => playerId === roomPlayer.playerId)
    )
    .filter((player) => !!player)
    .map((player) => player as RoomPlayer);

  return (
    <VStack alignItems="stretch" overflowY="scroll">
      {players.map(({ name }) => (
        <HStack
          borderWidth="0.5px"
          borderStyle="solid"
          rounded="md"
          p="2"
          justifyContent="space-between"
        >
          <HStack>
            <FaUser />
            <Box fontWeight="700">{name}</Box>
          </HStack>

          <HStack>
            <CardCount icon={<FaIdCard />} label="Resource cards" count={4} />
            <CardCount
              icon={<FaQuestionCircle />}
              label="Development cards"
              count={4}
            />
          </HStack>
        </HStack>
      ))}
    </VStack>
  );
};

export default Players;
