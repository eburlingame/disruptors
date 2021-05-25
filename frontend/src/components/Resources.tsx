import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { useGameViewState } from "./GameView";
import CardCount from "./CardCount";
import { useSessionState } from "../hooks/session";
import gameTheme, { resources, ThemeResource } from "../utils/game_theme";
import { ResourceType } from "../state/game_types";

const Players = ({}) => {
  const { you } = useSessionState();
  const { gameState } = useGameViewState();

  const player = gameState.state.players.find(
    ({ playerId }) => playerId === you?.playerId
  );
  if (!player) return <Box>Invalid player</Box>;

  return (
    <HStack alignItems="stretch" overflowY="scroll">
      {resources
        .map((name: ResourceType) => ({
          resource: gameTheme.resources[name],
          count: player.resources[name],
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
