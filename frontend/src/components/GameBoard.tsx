import { Box } from "@chakra-ui/layout";
import React, { useState } from "react";
import { useGameViewState } from "./GameView";
import hexagonImg from "../images/hexagon.svg";

import styled from "styled-components";
import { PortResource, TileType } from "../state/game_types";
import { Button, ButtonGroup, IconButton } from "@chakra-ui/button";
import { FaSearchMinus, FaSearchPlus } from "react-icons/fa";

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const OverflowContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  position: relative;
`;

const TILE_WIDTH = 146;
const TILE_HEIGHT = 169;

const BOARD_PADDING = 75;

const CONTAINER_WIDTH = 5 * TILE_WIDTH;
const CONTAINER_HEIGHT = 4 * TILE_HEIGHT;

const ZoomControls = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 4;
`;

const TileContainer = styled.div<{ zoom: number }>`
  position: absolute;
  width: ${(props) => CONTAINER_WIDTH * props.zoom}px;
  height: ${(props) => CONTAINER_HEIGHT * props.zoom}px;
`;

const TileOriginContainer = styled.div<{ zoom: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: scale(${(props) => props.zoom});
`;

const TileImage = styled.img`
  position: absolute;
  top: 10px;
  left: -11px;

  transform: rotate(90deg);
  z-index: 1;

  max-width: initial;
`;

const DebugLabel = styled.div`
  color: #000;
  position: absolute;
  top: 50%;
  width: 100%;
  z-index: 2;
  text-align: center;
`;

const Tile = styled.div<{ position: { x: number; y: number } }>`
  width: ${TILE_WIDTH}px;
  height: ${TILE_HEIGHT}px;

  position: absolute;
  left: ${(props) => `${props.position.x * TILE_WIDTH * 0.5}px`};
  top: ${(props) => `${-props.position.y * TILE_HEIGHT * 0.75}px`};
  transform: translate(-50%, -50%);
`;

const locationToPosition = ({
  x,
  y,
  z,
}: {
  x: number;
  y: number;
  z: number;
}) => ({
  x: x - y,
  y: -z,
});

const GameBoard = ({}) => {
  const { gameState } = useGameViewState();
  const { tiles } = gameState.state.board;

  const [zoom, setZoom] = useState(0.75);

  const zoomIn = () => setZoom((current) => current + 0.25);
  const zoomOut = () => setZoom((current) => current - 0.25);

  return (
    <Container>
      <ZoomControls>
        <ButtonGroup isAttached variant="solid">
          <IconButton
            aria-label="Zoom in"
            icon={<FaSearchPlus />}
            onClick={zoomIn}
          />
          <IconButton
            aria-label="Zoom out"
            icon={<FaSearchMinus />}
            onClick={zoomOut}
          />
        </ButtonGroup>
      </ZoomControls>

      <OverflowContainer>
        <TileContainer zoom={zoom}>
          <TileOriginContainer zoom={zoom}>
            {tiles.map(({ diceNumber, tileType, location: { x, y, z } }) => (
              <Tile position={locationToPosition({ x, y, z })}>
                <DebugLabel>{`(${diceNumber} ${tileType}) ${x}, ${y}, ${z}`}</DebugLabel>
                <TileImage src={hexagonImg} />
              </Tile>
            ))}
          </TileOriginContainer>
        </TileContainer>
      </OverflowContainer>
    </Container>
  );
};

export default GameBoard;
