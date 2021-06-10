import React from "react";
import { Box, HStack } from "@chakra-ui/layout";
import Icon from "@chakra-ui/icon";
import gameTheme, { resources, ThemeResource } from "../utils/game_theme";
import {
  BuildingType,
  CatanAction,
  CatanPlayersState,
  ResourceType,
} from "../state/game_types";
import { Tooltip } from "@chakra-ui/tooltip";
import CardCount from "./CardCount";
import { useGameViewState } from "./GameView";
import { useSessionState } from "../hooks/session";
import { getRoomPlayer } from "../utils/utils";
import { keyBy } from "lodash";
import { RoomPlayer } from "../state/atoms";
import { GamePlayer } from "../state/model";
import {
  FaDiceFive,
  FaDiceFour,
  FaDiceOne,
  FaDiceSix,
  FaDiceThree,
  FaDiceTwo,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { tilesTouchingVertex, vectorsEqual } from "../utils/board_utils";

type CompeltePlayer = RoomPlayer & GamePlayer;

const InlineIcon = ({ icon: Icon }: { icon: React.FC }) => (
  <Box marginX={2}>
    <Icon />
  </Box>
);

const DiceIcon = ({ number }: { number: number }) => {
  let icon: IconType;

  switch (number) {
    case 1:
      icon = FaDiceOne;
      break;

    case 2:
      icon = FaDiceTwo;
      break;

    case 3:
      icon = FaDiceThree;
      break;

    case 4:
      icon = FaDiceFour;
      break;

    case 5:
      icon = FaDiceFive;
      break;

    case 6:
    default:
      icon = FaDiceSix;
  }

  return <InlineIcon icon={icon} />;
};

const ActionRow = ({
  action,
  player,
}: {
  player: CompeltePlayer;
  action: CatanAction;
}) => {
  const { robber, buildings } = gameTheme;

  switch (action.name) {
    case "buildSettlement":
      return (
        <Box display="flex" alignItems="center">
          {player.name} built a <InlineIcon icon={buildings.settlement.icon} />
        </Box>
      );

    case "buildCity":
      return (
        <Box display="flex" alignItems="center">
          {player.name} built a <InlineIcon icon={buildings.city.icon} />
        </Box>
      );

    case "buildRoad":
      return (
        <Box display="flex" alignItems="center">
          {player.name} built a <InlineIcon icon={buildings.road.icon} />
        </Box>
      );

    case "rollDice":
      return (
        <>
          <Box display="flex" alignItems="center">
            {player.name} rolled a <DiceIcon number={action.values[0]} /> and{" "}
            <DiceIcon number={action.values[1]} /> ={" "}
            {action.values[0] + action.values[1]}
          </Box>
        </>
      );

    case "placeRobber":
      return (
        <Box display="flex" alignItems="center">
          {player.name} placed a <InlineIcon icon={robber.icon} />
        </Box>
      );
  }

  return <></>;
};

const Log = ({}) => {
  const { room } = useSessionState();

  const {
    gameState: { actions, state },
  } = useGameViewState();

  const players = state.players.map((player) => ({
    ...player,
    ...getRoomPlayer(room, player.playerId),
  }));

  const playerMap = keyBy(players, "playerId");

  return (
    <Box overflowY="scroll" maxH="300px">
      <Box>
        {actions.map(({ id, at, who, action }) => (
          <ActionRow key={id} player={playerMap[who]} action={action} />
        ))}
      </Box>
    </Box>
  );
};

export default Log;
