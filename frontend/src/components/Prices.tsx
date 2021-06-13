import React from "react";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
import Icon from "@chakra-ui/icon";
import gameTheme, { resources, ThemeResource } from "../utils/game_theme";
import { ResourceType } from "../state/game_types";
import { Tooltip } from "@chakra-ui/tooltip";
import CardCount from "./CardCount";
import { useGameViewState } from "./GameView";
import { FaCreditCard, FaEquals, FaPlus } from "react-icons/fa";

const Prices = ({}) => {
  const { gameState } = useGameViewState();

  return (
    <VStack alignItems="flex-start" fontSize="xl">
      <HStack>
        <Tooltip label={`One piece of ${gameTheme.buildings.road.name}`}>
          <Center minW="40px" minH="40px">
            <gameTheme.buildings.road.icon />
          </Center>
        </Tooltip>
        <Box>
          <FaEquals />
        </Box>

        <Tooltip label={`One ${gameTheme.resources.brick.name}`}>
          <Box>
            <gameTheme.resources.brick.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.wood.name}`}>
          <Box>
            <gameTheme.resources.wood.icon />
          </Box>
        </Tooltip>
      </HStack>

      <HStack>
        <Tooltip label={`One ${gameTheme.buildings.settlement.name}`}>
          <Box>
            <gameTheme.buildings.settlement.icon />
          </Box>
        </Tooltip>

        <Box>
          <FaEquals />
        </Box>

        <Tooltip label={`One ${gameTheme.resources.brick.name}`}>
          <Box>
            <gameTheme.resources.brick.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.wood.name}`}>
          <Box>
            <gameTheme.resources.wood.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.sheep.name}`}>
          <Box>
            <gameTheme.resources.sheep.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.wheat.name}`}>
          <Box>
            <gameTheme.resources.wheat.icon />
          </Box>
        </Tooltip>
      </HStack>

      <HStack>
        <Tooltip label={`One ${gameTheme.buildings.city.name}`}>
          <Box>
            <gameTheme.buildings.city.icon />
          </Box>
        </Tooltip>

        <Box>
          <FaEquals />
        </Box>

        <Tooltip label={`One ${gameTheme.resources.ore.name}`}>
          <Box>
            <gameTheme.resources.ore.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.ore.name}`}>
          <Box>
            <gameTheme.resources.ore.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.ore.name}`}>
          <Box>
            <gameTheme.resources.ore.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.wheat.name}`}>
          <Box>
            <gameTheme.resources.wheat.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.wheat.name}`}>
          <Box>
            <gameTheme.resources.wheat.icon />
          </Box>
        </Tooltip>
      </HStack>

      <HStack>
        <Tooltip label={`One development card`}>
          <Center minW="40px" minH="40px">
            <FaCreditCard />
          </Center>
        </Tooltip>

        <Box>
          <FaEquals />
        </Box>

        <Tooltip label={`One ${gameTheme.resources.ore.name}`}>
          <Box>
            <gameTheme.resources.ore.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.sheep.name}`}>
          <Box>
            <gameTheme.resources.sheep.icon />
          </Box>
        </Tooltip>

        <Tooltip label={`One ${gameTheme.resources.wheat.name}`}>
          <Box>
            <gameTheme.resources.wheat.icon />
          </Box>
        </Tooltip>
      </HStack>
    </VStack>
  );
};

export default Prices;
