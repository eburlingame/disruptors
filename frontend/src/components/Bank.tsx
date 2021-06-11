import React from "react";
import { Box, HStack } from "@chakra-ui/layout";
import Icon from "@chakra-ui/icon";
import gameTheme, { resources, ThemeResource } from "../utils/game_theme";
import { ResourceType } from "../state/game_types";
import { Tooltip } from "@chakra-ui/tooltip";
import CardCount from "./CardCount";
import { useGameViewState } from "./GameView";
import { FaCreditCard } from "react-icons/fa";
import { sum } from "lodash";

const Bank = ({}) => {
  const { gameState } = useGameViewState();
  const { bank } = gameState.state;

  return (
    <HStack justifyContent="center">
      {resources
        .map((name: ResourceType) => ({
          resource: gameTheme.resources[name],
          count: bank[name],
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

      <CardCount
        icon={<FaCreditCard />}
        label={"Development cards"}
        count={sum(Object.values(bank.developmentCards))}
      />
    </HStack>
  );
};

export default Bank;
