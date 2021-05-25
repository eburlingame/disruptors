import { Box } from "@chakra-ui/layout";
import React, { useState } from "react";
import { useGameViewState } from "./GameView";
import hexagonImg from "../images/hexagon.svg";

import styled from "styled-components";
import { GameTile, TileCoordinate, TileType } from "../state/game_types";
import gameTheme from "../utils/game_theme";
import { Button, ButtonGroup, IconButton } from "@chakra-ui/button";
import {
  FaHammer,
  FaNetworkWired,
  FaSearchMinus,
  FaSearchPlus,
  FaWarehouse,
} from "react-icons/fa";
import { range } from "../utils/utils";
import {
  EdgeDir,
  hasTile,
  locationToPosition,
  tileAlongEdge,
  VertexDir,
} from "../utils/board_utils";

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const OverflowContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
`;

const TILE_WIDTH = 146;
const TILE_HEIGHT = 169;

const BOARD_PADDING = 200;

const CONTAINER_WIDTH = 5 * TILE_WIDTH + BOARD_PADDING;
const CONTAINER_HEIGHT = 4 * TILE_HEIGHT + BOARD_PADDING;

const ZoomControls = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 4;
`;

const TileContainer = styled.div<{ zoom: number }>`
  position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);

  background-color: #123;
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

const TileLabel = styled.div`
  color: #000;
  position: absolute;
  top: 50%;
  width: 100%;
  z-index: 2;
  text-align: center;
  transform: translate(0%, -50%);
`;

const Tile = styled.div<{ position: { x: number; y: number } }>`
  width: ${TILE_WIDTH}px;
  height: ${TILE_HEIGHT}px;

  position: absolute;
  left: ${(props) => `${props.position.x * TILE_WIDTH * 0.5}px`};
  top: ${(props) => `${-props.position.y * TILE_HEIGHT * 0.75}px`};
  transform: translate(-50%, -50%);
`;

const EdgesContainer = styled(Tile)`
  z-index: 2;
`;

const VertexesContainer = styled(Tile)`
  z-index: 3;
`;

const ButtonsContainer = styled(Tile)`
  z-index: 4;
  width: 0px;
  height: 0px;
`;

const vertexIndexToPosition = (index: number) => ({
  x: (Math.cos((index / 6) * Math.PI * 2 - Math.PI / 2) * TILE_HEIGHT) / 2.0,
  y: (Math.sin((index / 6) * Math.PI * 2 - Math.PI / 2) * TILE_HEIGHT) / 2.0,
});

const edgeIndexToPosition = (index: number) => ({
  x: (Math.cos((index / 6) * Math.PI * 2 - Math.PI / 2) * TILE_WIDTH) / 2.0,
  y: (Math.sin((index / 6) * Math.PI * 2 - Math.PI / 2) * TILE_WIDTH) / 2.0,
});

const EdgeContainer = styled.div<{ index: number }>`
  position: absolute;
  z-index: 3;

  top: 50%;
  left: 50%;
  transform: translate(
    calc(-50% + ${(props) => edgeIndexToPosition(props.index + 0.5).x}px),
    calc(-50% + ${(props) => edgeIndexToPosition(props.index + 0.5).y}px)
  );
  text-align: center;
  width: 25px;
  height: 25px;
`;

const rad2deg = (radians: number) => (radians / Math.PI) * 180;
const deg2rad = (degrees: number) => (degrees / 180) * Math.PI;

const edgeLength = TILE_WIDTH * Math.sin(deg2rad(30));
const EdgeLine = styled.div<{ index: number }>`
  z-index: 2;

  top: 50%;
  left: 50%;
  position: absolute;
  border-top: 4px solid #182;
  width: ${edgeLength + 14}px;
  transform: translate(-50%, -5px)
    rotate(${(props) => props.index * 60 + 30}deg);

  border-top: solid 4px #ddd;
  transition: outline 0.6s linear;
  border-radius: 5px;

  // @keyframes shimmer {
  //   0% {
  //     border-top-style: dashed;
  //   }
  //   50% {
  //     border-top-style: dotted;
  //   }
  //   100% {
  //     border-top-style: dashed;
  //   }
  // }

  // animation-name: shimmer;
  // animation-duration: 0.5s;
  // animation-iteration-count: infinite;
`;

const VertexContainer = styled.div<{ index: number }>`
  position: absolute;
  z-index: 3;

  top: 50%;
  left: 50%;
  transform: translate(
    calc(-50% + ${(props) => vertexIndexToPosition(props.index).x}px),
    calc(-50% + ${(props) => vertexIndexToPosition(props.index).y}px)
  );

  text-align: center;
  width: 25px;
  height: 25px;
`;

/// Since multiple touch each vertex, decide which one should draw the vertex button/label
const shouldDrawVertex = (
  tiles: GameTile[],
  position: TileCoordinate,
  vertexIndex: number
) => {
  /// Always draw the top and bottom vertex
  if (vertexIndex === VertexDir.N || vertexIndex === VertexDir.S) {
    return true;
  }

  if (vertexIndex === VertexDir.NE) {
    return !hasTile(tiles, tileAlongEdge(position, EdgeDir.NE));
  }

  if (vertexIndex === VertexDir.SE) {
    return !hasTile(tiles, tileAlongEdge(position, EdgeDir.SE));
  }

  /// Let the squares to the left draw the left verticies, if they exist
  if (vertexIndex === VertexDir.SW) {
    return (
      !hasTile(tiles, tileAlongEdge(position, EdgeDir.SW)) &&
      !hasTile(tiles, tileAlongEdge(position, EdgeDir.W))
    );
  }

  if (vertexIndex === VertexDir.NW) {
    return (
      !hasTile(tiles, tileAlongEdge(position, EdgeDir.W)) &&
      !hasTile(tiles, tileAlongEdge(position, EdgeDir.NW))
    );
  }
};

/// Since multiple touch each vertex, decide which one should draw the vertex button/label
const shouldDrawEdge = (
  tiles: GameTile[],
  position: TileCoordinate,
  edgeIndex: number
) => {
  /// Always draw the top and bottom vertex
  if (
    edgeIndex === EdgeDir.NE ||
    edgeIndex === EdgeDir.E ||
    edgeIndex == EdgeDir.SE
  ) {
    return true;
  }

  return !hasTile(tiles, tileAlongEdge(position, edgeIndex));
};

const GameBoard = ({}) => {
  const { gameState } = useGameViewState();
  const { tiles } = gameState.state.board;

  const [zoom, setZoom] = useState(1.0);

  const zoomIn = () =>
    setZoom((current) => (current < 2.75 ? current + 0.25 : current));
  const zoomOut = () =>
    setZoom((current) => (current > 0.25 ? current - 0.25 : current));

  const placingRoad = false;
  const placingBuilding = false;

  return (
    <Container>
      <ZoomControls>
        <ButtonGroup isAttached variant="solid">
          <IconButton
            aria-label="Zoom in"
            icon={<FaSearchPlus />}
            onClick={zoomIn}
            colorScheme="blue"
          />
          <IconButton
            aria-label="Zoom out"
            icon={<FaSearchMinus />}
            onClick={zoomOut}
            colorScheme="blue"
          />
        </ButtonGroup>
      </ZoomControls>

      <OverflowContainer>
        <TileContainer zoom={zoom}>
          <TileOriginContainer zoom={zoom}>
            {tiles.map(({ diceNumber, tileType, location: { x, y, z } }) => (
              <>
                <Tile position={locationToPosition({ x, y, z })}>
                  {/* <DebugLabel>{`(${diceNumber} ${tileType}) ${x}, ${y}, ${z}`}</DebugLabel> */}
                  <TileLabel>
                    {tileType == TileType.DESERT
                      ? ""
                      : gameTheme.resources[tileType].label}
                    <Box fontSize="xl" fontWeight="700">
                      {diceNumber > 0 ? diceNumber : ""}
                    </Box>
                  </TileLabel>
                  <TileImage src={hexagonImg} />
                </Tile>

                <EdgesContainer position={locationToPosition({ x, y, z })}>
                  {range(6)
                    .filter((index) =>
                      shouldDrawEdge(tiles, { x, y, z }, index)
                    )
                    .map((index) => (
                      <EdgeContainer index={index}>
                        <EdgeLine index={index} />
                      </EdgeContainer>
                    ))}
                </EdgesContainer>

                <VertexesContainer position={locationToPosition({ x, y, z })}>
                  {range(6)
                    .filter((index) =>
                      shouldDrawVertex(tiles, { x, y, z }, index)
                    )
                    .map((index) => (
                      <VertexContainer index={index}></VertexContainer>
                    ))}
                </VertexesContainer>

                <ButtonsContainer position={locationToPosition({ x, y, z })}>
                  {placingRoad &&
                    range(6)
                      .filter((index) =>
                        shouldDrawEdge(tiles, { x, y, z }, index)
                      )
                      .map((index) => (
                        <EdgeContainer index={index}>
                          <IconButton
                            zIndex="4"
                            position="absolute"
                            transform="translate(-50%, 0%)"
                            icon={<FaHammer />}
                            aria-label=""
                            variant="solid"
                            size="xs"
                            colorScheme="blue"
                          />
                        </EdgeContainer>
                      ))}

                  {placingBuilding &&
                    range(6)
                      .filter((index) =>
                        shouldDrawVertex(tiles, { x, y, z }, index)
                      )
                      .map((index) => (
                        <VertexContainer index={index}>
                          <IconButton
                            zIndex="4"
                            position="absolute"
                            transform="translate(-50%, 0%)"
                            icon={<FaHammer />}
                            aria-label=""
                            variant="solid"
                            size="xs"
                            colorScheme="red"
                          />
                        </VertexContainer>
                      ))}
                </ButtonsContainer>
              </>
            ))}
          </TileOriginContainer>
        </TileContainer>
      </OverflowContainer>
    </Container>
  );
};

export default GameBoard;
