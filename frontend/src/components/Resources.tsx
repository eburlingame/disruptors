import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { useGameViewState } from "./GameView";
import CardCount from "./CardCount";
import { useSessionState } from "../hooks/session";
import gameTheme, { resources, ThemeResource } from "../utils/game_theme";
import { ResourceType } from "../state/game_types";

const Players = ({}) => {
  const { gameState } = useGameViewState();
  const { you } = gameState.state;

  return (
    <HStack alignItems="stretch" overflowY="scroll">
      {resources
        .map((name: ResourceType) => ({
          resource: gameTheme.resources[name],
          count: you.resources[name],
        }))
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
  );
};

export default Players;
