import { useColorModeValue } from "@chakra-ui/color-mode";
import React from "react";
import styled from "styled-components";
import { RollDiceAction } from "../state/game_types";
import { last } from "lodash";
import { useGameViewState } from "./GameView";

const DiceValueContainer = styled.div<{ backgroundColor: string }>`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 4;
  background: ${(props) => props.backgroundColor};
  border-radius: 0.5em;
  font-size: 20pt;
  padding: 0.5em;
  font-weight: 700;
`;

const DiceValueContainerTitle = styled.div`
  font-size: 12pt;
  color: #777;
  font-weight: 400;
`;

export default () => {
  const { gameState } = useGameViewState();

  const rollBacker = useColorModeValue("#aaa", "#676767");
  const rollBackerRed = useColorModeValue("#b21a1a", "#b21a1a");
  const labelColor = useColorModeValue("#fff", "#eee");

  const lastDiceRoll: RollDiceAction | undefined = last(
    gameState.actions
      .map(({ action }) => action)
      .filter(({ name }) => name === "rollDice")
      .map((a) => a as RollDiceAction)
  );

  if (lastDiceRoll) {
    const [diceA, diceB] = lastDiceRoll.values;
    const total = diceA + diceB;

    const robberRolled = total === 7;

    return (
      <DiceValueContainer
        backgroundColor={robberRolled ? rollBackerRed : rollBacker}
      >
        <DiceValueContainerTitle style={{ color: labelColor }}>
          Last roll:
        </DiceValueContainerTitle>
        {diceA} + {diceB} = {total}
      </DiceValueContainer>
    );
  }

  return <></>;
};
