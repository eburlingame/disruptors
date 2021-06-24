import React, { useState } from "react";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
import { TradeAcceptance, CompleteTradeAction } from "../state/game_types";
import { useGameViewState } from "./GameView";
import { Button } from "@chakra-ui/button";
import { FaCheckCircle, FaQuestionCircle, FaTimes } from "react-icons/fa";
import { useGameAction } from "../hooks/game";
import { useSessionState } from "../hooks/session";
import { getRoomPlayer } from "../utils/utils";
import { TradePreview } from "./AcceptTrade";
import { Divider } from "@chakra-ui/react";

const CompleteTrade = ({}) => {
  const { room } = useSessionState();

  const {
    gameState: { state },
  } = useGameViewState();

  const { performAction } = useGameAction();

  const { activeTradeRequest } = state;

  if (!activeTradeRequest) {
    return <></>;
  }

  const onComplete = (playerId: string) => async () => {
    const action: CompleteTradeAction = {
      name: "completeTrade",
      completeTrade: true,
      acceptedTradeFrom: playerId,
    };

    await performAction(action);
  };

  const onCancel = async () => {
    const action: CompleteTradeAction = {
      name: "completeTrade",
      completeTrade: false,
      acceptedTradeFrom: "",
    };

    await performAction(action);
  };

  return (
    <Box alignItems="stretch">
      <TradePreview />

      <Divider marginY="4" />

      <VStack>
        {activeTradeRequest.acceptance
          .filter(
            (acceptance) => acceptance.playerId !== activeTradeRequest.playerId
          )
          .map((acceptance) => ({
            ...acceptance,
            player: getRoomPlayer(room, acceptance.playerId),
          }))
          .map(({ acceptance, player }) => (
            <Box width="100%" maxW="300px">
              {acceptance === TradeAcceptance.UNDECIDED && (
                <HStack justifyContent="space-between">
                  <Box>
                    <FaQuestionCircle />
                  </Box>
                  <Box>{player.name} hasn't responded</Box>
                </HStack>
              )}
              {acceptance === TradeAcceptance.ACCEPTED && (
                <HStack justifyContent="space-between">
                  <Box>
                    <FaCheckCircle />
                  </Box>
                  <Box>{player.name} has accepted your trade!</Box>

                  <Button
                    colorScheme="green"
                    onClick={onComplete(player.playerId)}
                  >
                    Complete Trade
                  </Button>
                </HStack>
              )}
              {acceptance === TradeAcceptance.REJECTED && (
                <HStack justifyContent="space-between">
                  <Box>
                    <FaTimes />
                  </Box>
                  <Box>{player.name} has rejected your trade</Box>
                </HStack>
              )}
            </Box>
          ))}
      </VStack>

      <HStack justifyContent="stretch" marginTop="4">
        <Button colorScheme="red" flex="1" onClick={onCancel}>
          Cancel
        </Button>
      </HStack>
    </Box>
  );
};

export default CompleteTrade;
