import React, { useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { useGameViewState } from "./GameView";
import CardCount from "./CardCount";
import gameTheme, { resources } from "../utils/game_theme";
import {
  DevelopmentCardType,
  GamePhase,
  PlayerTurnState,
  ResourceType,
  DiscardCardsAction,
  PlayDevCardAction,
} from "../state/game_types";
import { Button } from "@chakra-ui/button";
import { sum } from "lodash";
import { useGameAction } from "../hooks/game";

const emptyDiscardCounts = () =>
  Object.values(ResourceType).map((resource) => ({
    resource,
    count: 0,
  }));

const DiscardPicker = ({}) => {
  const { gameState } = useGameViewState();
  const { you } = gameState.state;

  const { performAction } = useGameAction();

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
          you.resources[count.resource] > count.count
        ) {
          return {
            ...count,
            count: count.count + 1,
          };
        }

        return count;
      })
    );

  const leftToPick =
    you.mustDiscard - sum(selectedForDiscard.map((d) => d.count));

  const resourceSelectedCount = (resource: ResourceType) =>
    selectedForDiscard.find((count) => count.resource === resource)?.count || 0;

  const onSubmitDiscard = async () => {
    if (leftToPick === 0) {
      const action: DiscardCardsAction = {
        name: "discardCards",
        discarding: selectedForDiscard,
      };

      await performAction(action);
    }
  };

  return (
    <Box>
      <HStack fontWeight="bold" marginBottom="4">
        <Box color="red.400">{`You must discard ${you.mustDiscard} cards.`}</Box>
        {leftToPick > 0 && (
          <Box color="red.400">{`Select ${leftToPick} cards:`}</Box>
        )}

        <Button onClick={reset}>Reset</Button>
        <Button
          disabled={leftToPick > 0}
          colorScheme="green"
          onClick={onSubmitDiscard}
        >
          Done
        </Button>
      </HStack>

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

  const { performAction } = useGameAction();
  const onPlayDevCard = (devCard: DevelopmentCardType) => async () => {
    if (yourTurn) {
      const action: PlayDevCardAction = {
        name: "playDevCard",
        card: devCard,
      };

      await performAction(action);
    }
  };

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
            devCard,
            cardTheme: gameTheme.developmentCards[devCard],
            count: you.developmentCards[devCard],
          }))
          .filter(({ count }) => count > 0)
          .map(({ devCard, cardTheme, count }) => {
            const IconComponent = cardTheme.icon;

            return (
              <VStack>
                <CardCount
                  icon={<IconComponent />}
                  label={cardTheme.label}
                  count={count}
                />
                {playingDevCard &&
                  devCard != DevelopmentCardType.VICTORY_POINT && (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={onPlayDevCard(devCard)}
                    >
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
