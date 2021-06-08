import React from "react";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
import { useGameViewState } from "./GameView";
import CardCount from "./CardCount";
import { useSessionState } from "../hooks/session";
import gameTheme, { resources, ThemeResource } from "../utils/game_theme";
import {
  DevelopmentCardType,
  PlayerTurnState,
  ResourceType,
} from "../state/game_types";
import { Button } from "@chakra-ui/button";

const Players = ({}) => {
  const { gameState } = useGameViewState();
  const { you } = gameState.state;

  const yourTurn = gameState.state.activePlayerId === you.playerId;
  const playingDevCard =
    yourTurn &&
    gameState.state.activePlayerTurnState === PlayerTurnState.PLAYING_DEV_CARD;

  return (
    <HStack justifyContent="space-between">
      <HStack alignItems="stretch" overflowY="scroll">
        {resources
          .map((name: ResourceType) => ({
            resource: gameTheme.resources[name],
            count: you.resources[name],
          }))
          .filter(({ count }) => count > 0)
          .map(({ resource, count }) => {
            const IconComponent = resource.icon;

            return (
              <CardCount
                icon={<IconComponent />}
                label={resource.label}
                count={count}
              />
            );
          })}
      </HStack>

      <HStack alignItems="stretch" overflowY="scroll">
        {Object.values(DevelopmentCardType)
          .map((devCard: DevelopmentCardType) => ({
            resource: gameTheme.developmentCards[devCard],
            count: you.developmentCards[devCard],
          }))
          .filter(({ count }) => count > 0)
          .map(({ resource, count }) => {
            const IconComponent = resource.icon;

            return (
              <VStack>
                <CardCount
                  icon={<IconComponent />}
                  label={resource.label}
                  count={count}
                />
                {playingDevCard && (
                  <Button size="sm" colorScheme="green">
                    Play
                  </Button>
                )}
              </VStack>
            );
          })}
      </HStack>
    </HStack>
  );
};

export default Players;
