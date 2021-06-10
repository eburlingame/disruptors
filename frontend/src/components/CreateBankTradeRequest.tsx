import React, { useState } from "react";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
import gameTheme from "../utils/game_theme";
import {
  BankTradeAction,
  ChangeTurnAction,
  ResourceType,
  ExchangeRate,
  PortResource,
} from "../state/game_types";
import { Tooltip } from "@chakra-ui/tooltip";
import { useGameViewState } from "./GameView";
import { Button, IconButton } from "@chakra-ui/button";
import { FaExchangeAlt, FaWindowClose } from "react-icons/fa";
import { useGameAction } from "../hooks/game";
import { Tag } from "@chakra-ui/tag";
import { sum } from "lodash";

type ResourceCount = {
  resource: ResourceType;
  count: number;
  maxCount: number;
};

const lowestRatioFor = (
  exchangeRates: ExchangeRate[] | undefined,
  resource: string
) => {
  if (!exchangeRates) {
    return undefined;
  }

  let lowestRatio = 4;

  exchangeRates.forEach((rate) => {
    if (
      rate.ratio < lowestRatio &&
      (rate.resource === PortResource.ANY || rate.resource === resource)
    ) {
      lowestRatio = rate.ratio;
    }
  });

  return lowestRatio;
};

const ResourcePicker = ({
  label,
  counts,
  exchangeRates,
  addCount,
  clearCount,
}: {
  label: string;
  counts: ResourceCount[];
  exchangeRates?: ExchangeRate[];
  addCount: (resource: ResourceType) => void;
  clearCount: () => void;
}) => {
  const resourceCounts = counts.map(({ resource, count, maxCount }) => ({
    resource,
    count,
    maxCount,
    ...gameTheme.resources[resource],
  }));

  const onAdd = (resource: ResourceType) => () => addCount(resource);
  const onClear = () => clearCount();

  return (
    <VStack
      alignItems="stretch"
      borderWidth="1px"
      rounded="md"
      paddingY="2"
      paddingX="3"
    >
      <HStack marginBottom="3" justifyContent="space-between">
        <Box fontSize="lg" fontWeight="bold">
          {label}
        </Box>

        <Button
          variant="ghost"
          icon={<FaWindowClose />}
          onClick={onClear}
          opacity={resourceCounts.some(({ count }) => count > 0) ? 1.0 : 0.0}
        >
          Reset
        </Button>
      </HStack>

      <HStack justifyContent="space-between">
        {resourceCounts.map(
          ({ resource, name, label, icon: Icon, count, maxCount }) => (
            <Tooltip label={label}>
              <Box position="relative">
                <IconButton
                  aria-label={name}
                  icon={<Icon />}
                  size="lg"
                  zIndex="0"
                  onClick={onAdd(resource)}
                  disabled={maxCount != -1 && count >= maxCount}
                />
                <Center fontWeight="bold">
                  {lowestRatioFor(exchangeRates, resource) &&
                    `${lowestRatioFor(exchangeRates, resource)} : 1`}
                </Center>

                {count > 0 && (
                  <Tag
                    position="absolute"
                    top="-10px"
                    right="-10px"
                    zIndex="1"
                    backgroundColor="red.600"
                    fontSize="md"
                    fontWeight="bold"
                  >
                    {count}
                  </Tag>
                )}
              </Box>
            </Tooltip>
          )
        )}
      </HStack>
    </VStack>
  );
};

const CreateBankTradeRequest = ({}) => {
  const {
    gameState: { state },
  } = useGameViewState();

  const { performAction } = useGameAction();

  const emptySeekingCounts = () =>
    Object.values(ResourceType).map((resource) => ({
      resource,
      count: 0,
      maxCount: -1,
    }));

  const emptyGivingCounts = () =>
    Object.values(ResourceType).map((resource) => ({
      resource,
      count: 0,
      maxCount: state.you.resources[resource],
    }));

  const [givingCounts, setGivingCounts] = useState(emptyGivingCounts());
  const [seekingCounts, setSeekingCounts] = useState(emptySeekingCounts());

  const addGivingCount = (resourceType: ResourceType) =>
    setGivingCounts((counts) =>
      counts.map((count) => {
        if (
          count.resource === resourceType &&
          (count.maxCount === -1 || count.count < count.maxCount)
        ) {
          return { ...count, count: count.count + 1 };
        }

        return count;
      })
    );

  const clearGivingCount = () => setGivingCounts(emptyGivingCounts());

  const addSeekingCount = (resourceType: ResourceType) =>
    setSeekingCounts((counts) =>
      counts.map((count) => {
        if (count.resource === resourceType) {
          return { ...count, count: count.count + 1 };
        }

        return count;
      })
    );

  const clearSeekingCount = () => setSeekingCounts(emptySeekingCounts());

  const onCancel = async () => {
    const action: ChangeTurnAction = {
      name: "changeTurnAction",
      turnAction: "idle",
    };

    await performAction(action);
  };

  const onSubmit = async () => {
    const seeking = seekingCounts
      .map(({ resource, count }) => ({
        resource,
        count,
      }))
      .filter(({ count }) => count > 0);

    const giving = givingCounts
      .map(({ resource, count }) => ({
        resource,
        count,
      }))
      .filter(({ count }) => count > 0);

    const action: BankTradeAction = {
      name: "bankTrade",
      seeking,
      giving,
    };

    await performAction(action);
  };

  const currentGivingCount = sum(givingCounts.map(({ count }) => count));
  const currentSeekingCount = sum(seekingCounts.map(({ count }) => count));

  const maxSeekingCount = sum(
    seekingCounts.map((count) => {
      const ratio =
        lowestRatioFor(state.availableExchanges, count.resource) || 4;

      const currentGiving =
        givingCounts.find(
          (givingCount) => givingCount.resource === count.resource
        )?.count || 0;

      return Math.floor(currentGiving / ratio);
    })
  );

  return (
    <VStack alignItems="stretch">
      <ResourcePicker
        label="I am offering:"
        counts={givingCounts}
        addCount={addGivingCount}
        clearCount={clearGivingCount}
        exchangeRates={state.availableExchanges}
      />

      <Center>
        <Box transform="rotate(90deg)" fontSize="lg" marginY="2">
          <FaExchangeAlt />
        </Box>
      </Center>

      <ResourcePicker
        label="In exchange for:"
        counts={seekingCounts.map((count) => ({
          ...count,
          maxCount: maxSeekingCount - currentSeekingCount,
        }))}
        addCount={addSeekingCount}
        clearCount={clearSeekingCount}
      />

      <Box marginTop="2" />

      <HStack justifyContent="stretch">
        <Button colorScheme="red" flex="1" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          colorScheme="green"
          flex="1"
          onClick={onSubmit}
          disabled={currentGivingCount === 0 || currentSeekingCount === 0}
        >
          Submit
        </Button>
      </HStack>
    </VStack>
  );
};

export default CreateBankTradeRequest;
