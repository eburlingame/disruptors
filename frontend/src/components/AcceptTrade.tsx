import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import gameTheme from "../utils/game_theme";
import { AcceptTradeAction, TradeAcceptance } from "../state/game_types";
import { Tooltip } from "@chakra-ui/tooltip";
import { useGameViewState } from "./GameView";
import { Button } from "@chakra-ui/button";
import { useGameAction } from "../hooks/game";
import { useSessionState } from "../hooks/session";
import { getRoomPlayer } from "../utils/utils";

const AcceptTrade = ({}) => {
  const { room } = useSessionState();
  const {
    gameState: { state },
  } = useGameViewState();
  const { activeTradeRequest } = state;

  const { performAction } = useGameAction();

  const requestingPlayer = getRoomPlayer(
    room,
    activeTradeRequest?.playerId || ""
  );

  if (!activeTradeRequest) {
    return <></>;
  }

  const seeking = activeTradeRequest.seeking
    .map((seeking) => ({
      ...seeking,
      ...gameTheme.resources[seeking.resource],
    }))
    .filter(({ count }) => count > 0);

  const giving = activeTradeRequest.giving
    .map((giving) => ({
      ...giving,
      ...gameTheme.resources[giving.resource],
    }))
    .filter(({ count }) => count > 0);

  const canAccept = seeking.every(
    ({ resource, count }) => state.you.resources[resource] >= count
  );

  const currentAcceptance = activeTradeRequest.acceptance.find(
    (acceptance) => acceptance.playerId === state.you.playerId
  )?.acceptance;

  const onAccept = async () => {
    const action: AcceptTradeAction = {
      name: "acceptTrade",
      acceptance: TradeAcceptance.ACCEPTED,
    };

    await performAction(action);
  };

  const onReject = async () => {
    const action: AcceptTradeAction = {
      name: "acceptTrade",
      acceptance: TradeAcceptance.REJECTED,
    };

    await performAction(action);
  };

  return (
    <VStack alignItems="stretch">
      <Box>
        <Box fontSize="lg" fontWeight="bold">
          {requestingPlayer?.name} is offering:
        </Box>

        {giving.map(({ count, name, pluralName, icon: Icon }) => (
          <HStack>
            <Icon />
            <Box>{`${count} ${count === 1 ? name : pluralName}`}</Box>
          </HStack>
        ))}
        {giving.length === 0 && <Box>Nothing</Box>}
      </Box>
      <Box>
        <Box fontSize="lg" fontWeight="bold">
          In exchange for:
        </Box>

        {seeking.map(({ count, name, pluralName, icon: Icon }) => (
          <HStack>
            <Icon />
            <Box>{`${count} ${count === 1 ? name : pluralName}`}</Box>
          </HStack>
        ))}
      </Box>

      <Box marginTop="2" />

      {currentAcceptance === TradeAcceptance.REJECTED && (
        <Box
          border="1px"
          rounded="md"
          p={2}
          borderColor="red.800"
          textAlign="center"
        >
          You rejected this trade.
        </Box>
      )}

      {currentAcceptance === TradeAcceptance.ACCEPTED && (
        <Box
          border="1px"
          rounded="md"
          p={2}
          borderColor="green.800"
          textAlign="center"
        >
          You've accepted this trade.
        </Box>
      )}

      {currentAcceptance === TradeAcceptance.UNDECIDED && (
        <HStack justifyContent="stretch">
          <Tooltip label={"Reject the trade"}>
            <Button colorScheme="red" flex="1" onClick={onReject}>
              Reject
            </Button>
          </Tooltip>

          <Tooltip
            label={
              canAccept
                ? "Accept the trade"
                : "You do not have enough resources"
            }
          >
            <Button
              colorScheme="green"
              flex="1"
              onClick={onAccept}
              disabled={!canAccept}
            >
              Accept
            </Button>
          </Tooltip>
        </HStack>
      )}
    </VStack>
  );
};

export default AcceptTrade;
