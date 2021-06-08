import React, { useState } from "react";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
import { useGameViewState } from "./GameView";
import CardCount from "./CardCount";
import { useSessionState } from "../hooks/session";
import gameTheme, { resources, ThemeResource } from "../utils/game_theme";
import {
  DevelopmentCardType,
  GamePhase,
  PlayerTurnState,
  ResourceType,
} from "../state/game_types";
import { Button } from "@chakra-ui/button";
import { sum } from "lodash";

const emptyDiscardCounts = () =>
  Object.values(ResourceType).map((resource) => ({
    resource,
    discardCount: 0,
  }));

const DiscardPicker = ({}) => {
  const { gameState } = useGameViewState();
  const { you } = gameState.state;

  const mustDiscard =
    gameState.state.phase === GamePhase.ROBBER_ROLLER && you.mustDiscard > 0;

  const [selectedForDiscard, setSelectedForDiscard] = useState(
    emptyDiscardCounts()
  );

  const reset = () => setSelectedForDiscard(emptyDiscardCounts());

  const selectForDiscard = (resource: string) => () =>
    setSelectedForDiscard((selected) =>
      selected.map((count) => {
        if (
          count.resource === resource &&
          you.resources[count.resource] > count.discardCount
        ) {
          return {
            ...count,
            discardCount: count.discardCount + 1,
          };
        }

        return count;
      })
    );

  const leftToPick =
    you.mustDiscard - sum(selectedForDiscard.map((d) => d.discardCount));

  const resourceSelectedCount = (resource: ResourceType) =>
    selectedForDiscard.find((count) => count.resource === resource)
      ?.discardCount || 0;

  return (
    <Box>
      {mustDiscard && (
        <HStack fontWeight="bold" marginBottom="4">
          <Box color="red.400">{`You must discard ${you.mustDiscard} cards.`}</Box>
          {leftToPick > 0 && (
            <Box color="red.400">{`Select ${leftToPick} cards:`}</Box>
          )}

          <Button onClick={reset}>Reset</Button>
          <Button disabled={leftToPick > 0} colorScheme="green">
            Done
          </Button>
        </HStack>
      )}

      <HStack justifyContent="space-between">
        <HStack alignItems="stretch" overflowY="scroll">
          {resources
            .map((name: ResourceType) => ({
              name: name,
              resource: gameTheme.resources[name],
              initialCount: you.resources[name],
              count: you.resources[name] - resourceSelectedCount(name),
            }))
            .filter(({ initialCount }) => initialCount > 0)
            .map(({ name, resource, count }) => {
              const IconComponent = resource.icon;

              return (
                <VStack>
                  <CardCount
                    icon={<IconComponent />}
                    label={resource.label}
                    count={count}
                  />

                  {mustDiscard && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={selectForDiscard(name)}
                    >
                      Discard
                    </Button>
                  )}
                </VStack>
              );
            })}
        </HStack>
      </HStack>
    </Box>
  );
};

const Players = ({}) => {
  const { gameState } = useGameViewState();
  const { you } = gameState.state;

  const yourTurn = gameState.state.activePlayerId === you.playerId;
  const playingDevCard =
    yourTurn &&
    gameState.state.activePlayerTurnState === PlayerTurnState.PLAYING_DEV_CARD;

  const mustDiscard =
    gameState.state.phase === GamePhase.ROBBER_ROLLER && you.mustDiscard > 0;

  if (mustDiscard) {
    return <DiscardPicker />;
  }

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
