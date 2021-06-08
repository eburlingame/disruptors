import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import gameTheme from "../utils/game_theme";
import {
  CatanPlayersState,
  PlayerTurnState,
  RollDiceAction,
  EndTurnAction,
  ChangeTurnAction,
  TurnAction,
  GamePhase,
  BuyDevCardAction,
} from "../state/game_types";
import { Tooltip } from "@chakra-ui/tooltip";
import { useGameViewState } from "./GameView";
import { Button } from "@chakra-ui/button";
import {
  FaArrowRight,
  FaDice,
  FaDollarSign,
  FaExchangeAlt,
  FaMagic,
  FaStopCircle,
  FaTimes,
  FaUniversity,
} from "react-icons/fa";
import { useGameAction } from "../hooks/game";
import CreateTradeRequest from "./CreatePlayerTradeRequest";
import CompleteTrade from "./CompleteTrade";
import AcceptTrade from "./AcceptTrade";
import CreateBankTradeRequest from "./CreateBankTradeRequest";

const canBuildRoad = (state: CatanPlayersState): boolean =>
  state.you.resources.brick >= 1 && state.you.resources.wood >= 1;

const canBuildSettlement = (state: CatanPlayersState): boolean =>
  state.you.resources.brick >= 1 &&
  state.you.resources.wood >= 1 &&
  state.you.resources.sheep >= 1 &&
  state.you.resources.wheat >= 1;

const canBuildCity = (state: CatanPlayersState): boolean =>
  state.you.resources.ore >= 3 && state.you.resources.wheat >= 2;

const canBuyDevelopmentCard = (state: CatanPlayersState): boolean =>
  state.you.resources.ore >= 1 &&
  state.you.resources.sheep >= 1 &&
  state.you.resources.wheat >= 1;

export const areActionsAvailable = (state: CatanPlayersState) => {
  if (
    state.activePlayerTurnState ===
    PlayerTurnState.SUBMITTED_PLAYER_TRADE_REQUEST
  ) {
    return true;
  }

  const yourTurn =
    state.activePlayerId === state.you.playerId &&
    state.phase === GamePhase.PLAYING;

  return yourTurn;
};

const Actions = ({}) => {
  const {
    gameState: { state },
  } = useGameViewState();

  const { performAction } = useGameAction();

  const yourTurn = state.activePlayerId === state.you.playerId;

  const mustRoll =
    yourTurn &&
    state.activePlayerTurnState === PlayerTurnState.MUST_ROLL &&
    state.phase === GamePhase.PLAYING;

  const isIdle =
    yourTurn && state.activePlayerTurnState === PlayerTurnState.IDLE;

  const mandatoryAction = state.you.mustDiscard > 0;

  const onDiceRoll = async () => {
    if (mustRoll) {
      const action: RollDiceAction = { name: "rollDice", values: [-1, -1] };
      await performAction(action);
    }
  };

  const onEndTurn = async () => {
    if (isIdle && !mustRoll) {
      const action: EndTurnAction = { name: "endTurn" };
      await performAction(action);
    }
  };

  const onChangeTurnAction = (turnAction: TurnAction) => async () => {
    if (isIdle || turnAction === "idle") {
      const action: ChangeTurnAction = { name: "changeTurnAction", turnAction };
      await performAction(action);
    }
  };

  const onBuyDevCard = async () => {
    if (isIdle && canBuyDevelopmentCard(state)) {
      const action: BuyDevCardAction = { name: "buyDevCard" };
      await performAction(action);
    }
  };

  if (
    yourTurn &&
    state.activePlayerTurnState ===
      PlayerTurnState.CREATING_PLAYER_TRADE_REQUEST
  ) {
    return <CreateTradeRequest />;
  }

  if (
    yourTurn &&
    state.activePlayerTurnState === PlayerTurnState.CREATING_BANK_TRADE_REQUEST
  ) {
    return <CreateBankTradeRequest />;
  }

  if (
    state.activePlayerTurnState ===
    PlayerTurnState.SUBMITTED_PLAYER_TRADE_REQUEST
  ) {
    if (yourTurn) {
      return <CompleteTrade />;
    } else {
      return <AcceptTrade />;
    }
  }

  return (
    <VStack alignItems="stretch">
      <Button
        leftIcon={<FaDice />}
        justifyContent="left"
        colorScheme="purple"
        onClick={onDiceRoll}
        disabled={!mustRoll}
      >
        Roll the dice
      </Button>

      <Button
        leftIcon={<FaExchangeAlt />}
        justifyContent="left"
        colorScheme="yellow"
        disabled={!isIdle}
        onClick={onChangeTurnAction("startPlayerTradeRequest")}
      >
        Trade with others
      </Button>

      <Button
        leftIcon={<FaUniversity />}
        justifyContent="left"
        colorScheme="yellow"
        disabled={!isIdle}
        onClick={onChangeTurnAction("startBankTradeRequest")}
      >
        Trade with the bank
      </Button>

      <HStack>
        <Button
          leftIcon={<FaMagic />}
          justifyContent="left"
          flex="1"
          colorScheme="orange"
          disabled={!isIdle || !(state.you.developmentCards.knight > 0)}
          onClick={onChangeTurnAction("playDevCard")}
        >
          Play dev card
        </Button>
        <Button
          leftIcon={<FaDollarSign />}
          justifyContent="left"
          flex="1"
          colorScheme="orange"
          disabled={!isIdle || !canBuyDevelopmentCard(state)}
          onClick={onBuyDevCard}
        >
          Buy dev card
        </Button>
      </HStack>

      <Button
        leftIcon={<gameTheme.buildings.road.icon />}
        justifyContent="left"
        colorScheme="green"
        disabled={!isIdle || !canBuildRoad(state)}
        onClick={onChangeTurnAction("buildRoad")}
      >
        Build {gameTheme.buildings.road.name}
      </Button>

      <HStack>
        <Button
          leftIcon={<gameTheme.buildings.settlement.icon />}
          justifyContent="left"
          flex="1"
          colorScheme="green"
          disabled={!isIdle || !canBuildSettlement(state)}
          onClick={onChangeTurnAction("buildSettlement")}
        >
          Build {gameTheme.buildings.settlement.name}
        </Button>
        <Button
          leftIcon={<gameTheme.buildings.city.icon />}
          justifyContent="left"
          flex="1"
          colorScheme="green"
          disabled={!isIdle || !canBuildCity(state)}
          onClick={onChangeTurnAction("buildCity")}
        >
          Build {gameTheme.buildings.city.name}
        </Button>
      </HStack>

      {isIdle && (
        <Button
          leftIcon={<FaArrowRight />}
          justifyContent="left"
          colorScheme="red"
          disabled={!isIdle || mustRoll}
          onClick={onEndTurn}
        >
          End turn
        </Button>
      )}

      {!isIdle && (
        <Button
          leftIcon={<FaTimes />}
          justifyContent="left"
          colorScheme="pink"
          disabled={isIdle || mandatoryAction}
          onClick={onChangeTurnAction("idle")}
        >
          Cancel
        </Button>
      )}
    </VStack>
  );
};

export default Actions;
