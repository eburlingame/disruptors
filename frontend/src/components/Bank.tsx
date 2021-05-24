import React from "react";
import { Box, HStack } from "@chakra-ui/layout";
import Icon from "@chakra-ui/icon";
import theme, { resources, ThemeResource } from "../utils/game_theme";
import { ResourceType } from "../state/game_types";
import { Tooltip } from "@chakra-ui/tooltip";
import CardCount from "./CardCount";

const Bank = ({}) => {
  return (
    <HStack justifyContent="center">
      {resources
        .map((name: ResourceType) => theme.resources[name])
        .map((resource: ThemeResource) => {
          const IconComponent = resource.icon;

          return (
            <CardCount
              icon={<IconComponent />}
              label={resource.label}
              count={19}
            />
          );
        })}
    </HStack>
  );
};

export default Bank;
