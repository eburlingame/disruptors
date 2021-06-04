import { Box } from "@chakra-ui/layout";
import React, { useState } from "react";
import { useGameViewState } from "./GameView";
import hexagonImg from "../images/hexagon.svg";

import styled from "styled-components";
import {
  BuildCityAction,
  BuildingType,
  BuildRoadAction,
  BuildSettlementAction,
  EdgeCoordinate,
  GameTile,
  PlayerTurnState,
  TileCoordinate,
  TileType,
  VertexCoordinate,
} from "../state/game_types";
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
  getCommonVertexCoordinate,
  getCommonEdgeCoordinate,
  hasTile,
  locationToPosition,
  tileAlongEdge,
  vertexCoordinateEqual,
  VertexDir,
  edgeCoordinateEqual,
} from "../utils/board_utils";
import { useSessionState } from "../hooks/session";
import { useGameAction } from "../hooks/game";

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
const EdgeLine = styled.div<{ index: number; color: string }>`
  z-index: 2;

  top: 50%;
  left: 50%;
  position: absolute;
  border-top: 4px solid ${(props) => props.color};
  width: ${edgeLength + 14}px;
  transform: translate(-50%, -5px)
    rotate(${(props) => props.index * 60 + 30}deg);

  border-top: solid 4px ${(props) => props.color};
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

const Building = styled.div<{ playerColor: string }>`
  position: absolute;
  left: 0px;
  top: 0px;

  width: 28px;
  height: 28px;
  border-radius: 0.25em;
  background-color: ${(props) => props.playerColor};

  display: flex;
  justify-content: center;
  align-items: center;
`;

/// Since tiles touch each vertex, only draw the "common" vertex
const shouldDrawVertex = (
  tiles: GameTile[],
  position: TileCoordinate,
  vertexIndex: number
) => {
  const vertexCoord: VertexCoordinate = {
    tile: position,
    vertexIndex,
  };

  const commonVertex = getCommonVertexCoordinate(tiles, vertexCoord);
  return vertexCoordinateEqual(commonVertex, vertexCoord);
};

/// Since multiple touch each vertex, only draw the "common" edge
const shouldDrawEdge = (
  tiles: GameTile[],
  position: TileCoordinate,
  edgeIndex: number
) => {
  const edgeCoord: EdgeCoordinate = {
    tile: position,
    edgeIndex,
  };

  const commonEdge = getCommonEdgeCoordinate(tiles, edgeCoord);
  return edgeCoordinateEqual(commonEdge, edgeCoord);
};

const GameBoard = ({}) => {
  const { you } = useSessionState();
  const { gameState } = useGameViewState();
  const {
    players,
    board: { tiles },
    buildings,
    roads,
  } = gameState.state;

  const [zoom, setZoom] = useState(1.0);

  const zoomIn = () =>
    setZoom((current) => (current < 2.75 ? current + 0.25 : current));
  const zoomOut = () =>
    setZoom((current) => (current > 0.25 ? current - 0.25 : current));

  const { activePlayerId, activePlayerTurnState } = gameState.state;

  const yourTurn = you && you.playerId === activePlayerId;

  const placingRoad =
    yourTurn && activePlayerTurnState === PlayerTurnState.PLACING_ROAD;

  const placingBuilding =
    yourTurn &&
    (activePlayerTurnState === PlayerTurnState.PLACING_CITY ||
      activePlayerTurnState === PlayerTurnState.PLACING_SETTLEMENT);

  const { performAction } = useGameAction();

  const onPlaceBuilding = (location: VertexCoordinate) => async () => {
    if (placingBuilding) {
      let action: BuildCityAction | BuildSettlementAction = {
        name:
          activePlayerTurnState === PlayerTurnState.PLACING_CITY
            ? "buildCity"
            : "buildSettlement",
        location,
      };

      await performAction(action);
    }
  };

  const onPlaceRoad = (location: EdgeCoordinate) => async () => {
    if (placingRoad) {
      let action: BuildRoadAction = {
        name: "buildRoad",
        location,
      };

      await performAction(action);
    }
  };

  const roadExists = (tile: TileCoordinate, edgeIndex: number) =>
    roads.find((road) =>
      edgeCoordinateEqual({ tile, edgeIndex }, road.location)
    ) != undefined;

  const buildingExists = (tile: TileCoordinate, vertexIndex: number) =>
    buildings.find((building) =>
      vertexCoordinateEqual({ tile, vertexIndex }, building.location)
    ) != undefined;

  const renderRoad = (tile: TileCoordinate, edgeIndex: number) => {
    let roadColor = "#ddd";

    const road = roads.find((road) =>
      edgeCoordinateEqual({ tile, edgeIndex }, road.location)
    );

    if (road) {
      const player = players.find(({ playerId }) => playerId === road.playerId);

      if (player) {
        roadColor = player.color;
      }
    }

    return <EdgeLine index={edgeIndex} color={roadColor} />;
  };

  const renderBuilding = (tile: TileCoordinate, vertexIndex: number) => {
    const SettlementIcon = gameTheme.buildings.settlement.icon;
    const CityIcon = gameTheme.buildings.city.icon;

    const building = buildings.find((building) =>
      vertexCoordinateEqual({ tile, vertexIndex }, building.location)
    );

    if (building) {
      const player = players.find(
        ({ playerId }) => playerId === building.playerId
      );

      if (player) {
        if (building.type === BuildingType.Settlement) {
          return (
            <Building playerColor={player.color}>
              <SettlementIcon />
            </Building>
          );
        }

        if (building.type === BuildingType.City) {
          return (
            <Building playerColor={player.color}>
              <CityIcon />
            </Building>
          );
        }
      }
    }

    return <></>;
  };

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
                        {renderRoad({ x, y, z }, index)}
                      </EdgeContainer>
                    ))}
                </EdgesContainer>

                <VertexesContainer position={locationToPosition({ x, y, z })}>
                  {range(6)
                    .filter((index) =>
                      shouldDrawVertex(tiles, { x, y, z }, index)
                    )
                    .map((index) => (
                      <VertexContainer index={index}>
                        {renderBuilding({ x, y, z }, index)}
                      </VertexContainer>
                    ))}
                </VertexesContainer>

                <ButtonsContainer position={locationToPosition({ x, y, z })}>
                  {placingRoad &&
                    range(6)
                      .filter(
                        (index) =>
                          shouldDrawEdge(tiles, { x, y, z }, index) &&
                          !roadExists({ x, y, z }, index)
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
                            onClick={onPlaceRoad({
                              tile: { x, y, z },
                              edgeIndex: index,
                            })}
                          />
                        </EdgeContainer>
                      ))}

                  {placingBuilding &&
                    range(6)
                      .filter(
                        (index) =>
                          shouldDrawVertex(tiles, { x, y, z }, index) &&
                          !buildingExists({ x, y, z }, index)
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
                            colorScheme="green"
                            onClick={onPlaceBuilding({
                              tile: { x, y, z },
                              vertexIndex: index,
                            })}
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
