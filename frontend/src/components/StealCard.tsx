import React, { useState } from "react";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
import { StealCardAction } from "../state/game_types";
import { useGameViewState } from "./GameView";
import { Button, IconButton } from "@chakra-ui/button";
import { useGameAction } from "../hooks/game";
import { useSessionState } from "../hooks/session";
import { getRoomPlayer } from "../utils/utils";
import gameTheme from "../utils/game_theme";

const StealCard = ({}) => {
  const { room } = useSessionState();

  const {
    gameState: { state },
  } = useGameViewState();

  const { performAction } = useGameAction();

  const onSelect = (playerId: string) => async () => {
    const action: StealCardAction = {
      name: "stealCard",
      stealFrom: playerId,
    };

    await performAction(action);
  };

  return (
    <VStack alignItems="stretch">
      {state.players
        .filter((player) => player.playerId !== state.you.playerId)
        .map((player) => ({
          ...player,
          ...getRoomPlayer(room, player.playerId),
        }))
        .map(({ name, color, playerId }) => (
          <Box>
            <HStack justifyContent="space-between">
              <Box color={gameTheme.playerColors[color].primary}>{name}</Box>
              <Button onClick={onSelect(playerId)}>Steal a card</Button>
            </HStack>
          </Box>
        ))}
    </VStack>
  );
};

export default StealCard;
