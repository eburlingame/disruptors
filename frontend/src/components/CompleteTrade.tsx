import React, { useState } from "react";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
import { CgCloseO } from "react-icons/cg";
import gameTheme, { resources } from "../utils/game_theme";
import {
  RequestTradeAction,
  ChangeTurnAction,
  ResourceType,
  TradeAcceptance,
  CompleteTradeAction,
} from "../state/game_types";
import { Tooltip } from "@chakra-ui/tooltip";
import { useGameViewState } from "./GameView";
import { Button, IconButton } from "@chakra-ui/button";
import {
  FaCheckCircle,
  FaExchangeAlt,
  FaQuestionCircle,
  FaTimes,
  FaWindowClose,
} from "react-icons/fa";
import { useGameAction } from "../hooks/game";
import { useSessionState } from "../hooks/session";
import { getRoomPlayer } from "../utils/utils";

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
    <VStack alignItems="stretch">
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
            <HStack>
              {acceptance === TradeAcceptance.UNDECIDED && (
                <>
                  <Box>
                    <FaQuestionCircle />
                  </Box>
                  <Box>{player.name} hasn't responded</Box>
                </>
              )}
              {acceptance === TradeAcceptance.ACCEPTED && (
                <>
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
                </>
              )}
              {acceptance === TradeAcceptance.REJECTED && (
                <>
                  <Box>
                    <FaTimes />
                  </Box>
                  <Box>{player.name} has rejected your trade</Box>
                </>
              )}
            </HStack>
          ))}
      </VStack>

      <HStack justifyContent="stretch">
        <Button colorScheme="red" flex="1" onClick={onCancel}>
          Cancel
        </Button>
      </HStack>
    </VStack>
  );
};

export default CompleteTrade;
