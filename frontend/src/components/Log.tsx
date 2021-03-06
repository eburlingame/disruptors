import React, { ReactNode, useEffect, useRef } from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import gameTheme from "../utils/game_theme";
import {
  CatanAction,
  DevelopmentCardType,
  ResourceCount,
  ResourceQuantities,
  ResourceType,
} from "../state/game_types";
import { useGameViewState } from "./GameView";
import { useSessionState } from "../hooks/session";
import { getRoomPlayer, range } from "../utils/utils";
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
import { sum } from "lodash";

type CompletePlayer = RoomPlayer & GamePlayer;

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

const quantitiesToCounts = (
  distribution: ResourceQuantities
): ResourceCount[] =>
  Object.entries(distribution).map(([resource, count]) => ({
    resource: resource as ResourceType,
    count,
  }));

const ResourceCounts = ({ counts }: { counts: ResourceCount[] }) => {
  const { resources } = gameTheme;

  if (sum(counts.map(({ count }) => count)) === 0) {
    return <Box>nothing</Box>;
  }

  return (
    <Box marginLeft="1" display="flex">
      {counts
        .filter(({ count }) => count > 0)
        .map(({ resource, count }) => (
          <Box display="flex">
            {range(count).map(() => {
              const Icon = resources[resource as ResourceType].icon;
              return <Icon />;
            })}
          </Box>
        ))}
    </Box>
  );
};

const totalResources = (counts: ResourceCount[]) =>
  sum(counts.map(({ count }) => count));

const LogEntry = ({ children }: { children: ReactNode }) => (
  <Box minH="30px" width="100%">
    {children}
  </Box>
);

const ActionRow = ({
  action,
  player,
  players,
}: {
  player: CompletePlayer;
  action: CatanAction;
  players: { [playerId: string]: CompletePlayer };
}) => {
  const { robber, buildings, resources, developmentCards } = gameTheme;

  let row = null;

  switch (action.name) {
    case "buildSettlement":
      row = (
        <Box display="flex" alignItems="center">
          {player.name} built a <InlineIcon icon={buildings.settlement.icon} />
        </Box>
      );
      break;

    case "buildCity":
      row = (
        <Box display="flex" alignItems="center">
          {player.name} built a <InlineIcon icon={buildings.city.icon} />
        </Box>
      );
      break;

    case "buildRoad":
      row = (
        <Box display="flex" alignItems="center">
          {player.name} built a <InlineIcon icon={buildings.road.icon} />
        </Box>
      );
      break;

    case "rollDice":
      row = (
        <>
          <Box display="flex" alignItems="center">
            {player.name} rolled a <DiceIcon number={action.values[0]} /> and{" "}
            <DiceIcon number={action.values[1]} /> ={" "}
            {action.values[0] + action.values[1]}
          </Box>

          {action.distribution &&
            Object.entries(action.distribution).map(([playerId, got]) => (
              <Box display="flex" alignItems="center">
                <Box>{players[playerId].name} got </Box>
                <ResourceCounts counts={quantitiesToCounts(got)} />
              </Box>
            ))}
        </>
      );
      break;

    case "completeTrade":
      if (action.completeTrade && action.giving && action.seeking) {
        row = (
          <>
            <HStack>
              <Box>
                {player.name} gave {players[action.acceptedTradeFrom].name}
              </Box>
              <ResourceCounts counts={action.giving || []} />
              <Box>for</Box>
              <ResourceCounts counts={action.seeking || []} />
            </HStack>
          </>
        );
        break;
      }
      break;

    case "bankTrade":
      row = (
        <>
          <HStack>
            <Box>{player.name} gave the bank</Box>
            <ResourceCounts counts={action.giving || []} />
            <Box>for</Box>
            <ResourceCounts counts={action.seeking || []} />
          </HStack>
        </>
      );
      break;

    case "placeRobber":
      row = (
        <Box display="flex" alignItems="center">
          {player.name} placed the <InlineIcon icon={robber.icon} />
        </Box>
      );
      break;

    case "playDevCard":
      if (action.card === DevelopmentCardType.KNIGHT) {
        row = (
          <Box display="flex" alignItems="center">
            {player.name} played a{" "}
            <InlineIcon icon={developmentCards.knight.icon} />
          </Box>
        );
        break;
      }
      break;

    case "buyDevCard":
      row = <Box>{player.name} bought a development card.</Box>;
      break;

    case "stealCard":
      row = (
        <Box>
          {player.name} stole a card from {players[action.stealFrom].name}
        </Box>
      );
      break;

    case "discardCards":
      row = (
        <Box>
          {player.name} discarded {totalResources(action.discarding)} cards.
        </Box>
      );
      break;

    case "endTurn":
      row = (
        <Box
          width="100%"
          height="0px"
          borderTop="solid"
          borderTopColor="#999"
          borderTopWidth="1px"
          marginY="4"
        />
      );
      break;
  }

  if (row) {
    return <LogEntry>{row}</LogEntry>;
  }

  return <></>;
};

const Log = ({}) => {
  const ref = useRef<any>();

  const { room } = useSessionState();

  const {
    gameState: { actions, state },
  } = useGameViewState();

  const players = state.players.map((player) => ({
    ...player,
    ...getRoomPlayer(room, player.playerId),
  }));

  const playerMap = keyBy(players, "playerId");

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [actions.length]);

  return (
    <Box flex="1 1 auto" height="0px" overflowY="scroll" ref={ref}>
      {actions.map(({ id, at, who, action }) => (
        <ActionRow
          key={id}
          player={playerMap[who]}
          action={action}
          players={playerMap}
        />
      ))}
    </Box>
  );
};

export default Log;
