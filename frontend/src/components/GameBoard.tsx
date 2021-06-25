import { Box } from "@chakra-ui/layout";
import React, { useRef, useState } from "react";
import { useGameViewState } from "./GameView";

import backerSmallLightImg from "../images/board_small_backing.svg";
import backerSmallDarkImg from "../images/board_small_backing_dark.svg";

import backerLargeLightImg from "../images/board_large_backing.svg";
import backerLargeDarkImg from "../images/board_large_backing_dark.svg";

import tileDarkImg from "../images/tile_dark.svg";
import tileLightImg from "../images/tile_light.svg";

import styled from "styled-components";
import {
  BuildCityAction,
  BuildingType,
  BuildRoadAction,
  BuildSettlementAction,
  EdgeCoordinate,
  GamePhase,
  GameTile,
  PlaceRobberAction,
  PlayerTurnState,
  ResourceType,
  RollDiceAction,
  TileCoordinate,
  TileType,
  VertexCoordinate,
} from "../state/game_types";
import gameTheme from "../utils/game_theme";
import { ButtonGroup, IconButton } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";
import {
  FaArrowCircleDown,
  FaCircle,
  FaHammer,
  FaSearchMinus,
  FaSearchPlus,
} from "react-icons/fa";
import { range } from "../utils/utils";
import {
  getCommonVertexCoordinate,
  getCommonEdgeCoordinate,
  locationToPosition,
  vertexCoordinateEqual,
  edgeCoordinateEqual,
  vectorsEqual,
  isValidRoadPosition,
  isValidSettlementPosition,
  widthInTiles,
  heightInTiles,
  diceFrequencyDots,
} from "../utils/board_utils";
import { useSessionState } from "../hooks/session";
import { useGameAction } from "../hooks/game";
import { Tooltip } from "@chakra-ui/tooltip";
import { useColorModeValue } from "@chakra-ui/color-mode";
import useResizeAware from "react-resize-aware";
import LastRoll from "./LastRoll";

const TILE_WIDTH = 146;
const TILE_HEIGHT = 169;

const BOARD_PADDING = 230;

const Container = styled.div<{ backgroundColor: string }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: ${(props) => props.backgroundColor};
`;

const OverflowContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll; // scroll
  position: relative;
`;

const ZoomControls = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 4;
`;

const TileContainer = styled.div<{
  zoom: number;
  containerW: number;
  containerH: number;
  viewportW: number;
  viewportH: number;
}>`
  position: absolute;

  width: ${(props) =>
    Math.max(props.containerW * props.zoom, props.viewportW)}px;
  height: ${(props) =>
    Math.max(props.containerH * props.zoom, props.viewportH)}px;
`;

const BackgroundImage = styled.img`
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 1200px;
  min-height: 1400px;
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

const TileIconContainer = styled.div`
  color: #000;
  z-index: 2;
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: center;
  width: 100px;
  height: 150px;
  transform: translate(-50%, -51%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;
`;

const RobberIconContainer = styled.div`
  position: absolute;
  width: 50px;
  left: 25px;
  top: 25px;
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

const RoadsContainer = styled(Tile)`
  z-index: 3;
`;

const VertexesContainer = styled(Tile)`
  z-index: 4;
`;

const ButtonsContainer = styled(Tile)`
  z-index: 5;
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

const deg2rad = (degrees: number) => (degrees / 180) * Math.PI;

const edgeLength = TILE_WIDTH * Math.sin(deg2rad(30));
const EdgeLine = styled.div<{
  index: number;
  color: string;
  width: number;
}>`
  z-index: 3;

  top: 50%;
  left: 50%;
  position: absolute;
  width: ${edgeLength + 14}px;
  transform: translate(-50%, -${(props) => props.width / 2}px)
    rotate(${(props) => props.index * 60 + 30}deg);

  border-top: solid ${(props) => props.width}px ${(props) => props.color};
  transition: outline 0.6s linear;
  border-radius: 5px;
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
  width: 40px;
  height: 40px;
`;

const Building = styled.div<{ playerColor: string }>`
  position: absolute;
  left: 0px;
  top: 0px;

  width: 40px;
  height: 40px;
  border-radius: 0.25em;
  background-color: ${(props) => props.playerColor};

  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow: 0px 0px 14px 1px rgba(50, 50, 50, 0.75);
`;

const PlaceRobberButtonContainer = styled.div`
  transform: translate(-50%, -50%);
  width: 100px;
  text-align: center;
`;

const TileIcon = ({
  diceNumber,
  tileType,
  hasRobber,
}: {
  diceNumber: string;
  tileType: TileType;
  hasRobber: boolean;
}) => {
  const resource = tileType as unknown as ResourceType;

  const textColor = useColorModeValue("gray.800", "gray.100");

  const dotColor = useColorModeValue("gray.400", "gray.500");
  const dotColorRed = useColorModeValue("red.600", "red.700");

  const diceDots = diceFrequencyDots[parseInt(diceNumber)];

  if (Object.values(ResourceType).includes(resource)) {
    const { label, icon: Icon } = gameTheme.resources[resource];

    return (
      <TileIconContainer>
        <Tooltip label={label}>
          <Box opacity={hasRobber ? 0.3 : 1.0}>
            <Icon />
          </Box>
        </Tooltip>

        <Box
          fontSize="24px"
          fontWeight="bold"
          color={hasRobber ? "red" : textColor}
          opacity={hasRobber ? 0.3 : 1.0}
        >
          {diceNumber}

          <Box justifyContent="center" width="30px" display="flex">
            {range(diceDots).map(() => (
              <Box
                backgroundColor={diceDots === 5 ? dotColorRed : dotColor}
                borderRadius="4px"
                width="4px"
                height="4px"
                marginX="1px"
              />
            ))}
          </Box>
        </Box>

        {hasRobber && (
          <RobberIconContainer>
            <gameTheme.robber.icon />
          </RobberIconContainer>
        )}
      </TileIconContainer>
    );
  }

  return (
    <TileIconContainer>
      {hasRobber && (
        <RobberIconContainer>
          <gameTheme.robber.icon />
        </RobberIconContainer>
      )}
    </TileIconContainer>
  );
};

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

const boardBackgroundImgs = (tileCount: number) =>
  tileCount <= 19
    ? [backerSmallLightImg, backerSmallDarkImg]
    : [backerLargeLightImg, backerLargeDarkImg];

const GameBoard = ({}) => {
  const { you } = useSessionState();
  const { gameState } = useGameViewState();
  const { state } = gameState;

  const {
    players,
    board: { tiles },
    buildings,
    roads,
    robber,
  } = gameState.state;

  const boardWidthTiles = widthInTiles(tiles);
  const boardHeightTiles = heightInTiles(tiles);

  const [zoom, setZoom] = useState(1.0);

  const zoomIn = () =>
    setZoom((current) => (current < 2.75 ? current + 0.25 : current));
  const zoomOut = () =>
    setZoom((current) => (current > 0.25 ? current - 0.25 : current));

  const [resizeListener, { width, height }] = useResizeAware();
  const scrollRef = useRef<any>();

  const { activePlayerId, activePlayerTurnState } = state;

  const yourTurn = you && you.playerId === activePlayerId;

  const placingRoad =
    yourTurn && activePlayerTurnState === PlayerTurnState.PLACING_ROAD;

  const placingCity = activePlayerTurnState === PlayerTurnState.PLACING_CITY;
  const placingSettlement =
    activePlayerTurnState === PlayerTurnState.PLACING_SETTLEMENT;
  const placingBuilding = yourTurn && (placingCity || placingSettlement);

  const placingRobber =
    yourTurn && activePlayerTurnState === PlayerTurnState.MUST_PLACE_ROBBER;

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

  const onPlaceRobber = (location: TileCoordinate) => async () => {
    if (placingRobber) {
      let action: PlaceRobberAction = {
        name: "placeRobber",
        location,
      };

      await performAction(action);
    }
  };

  const settlementExists = (
    playerId: string,
    tile: TileCoordinate,
    vertexIndex: number
  ) =>
    buildings
      .filter(
        (building) =>
          building.type === BuildingType.Settlement &&
          building.playerId === playerId
      )
      .find((building) =>
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
        roadColor = gameTheme.playerColors[player.color].primary;
      }

      return <EdgeLine index={edgeIndex} color={roadColor} width={8} />;
    }

    return <></>;
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
        const color = gameTheme.playerColors[player.color].primary;

        if (building.type === BuildingType.Settlement) {
          return (
            <Building playerColor={color}>
              <SettlementIcon />
            </Building>
          );
        }

        if (building.type === BuildingType.City) {
          return (
            <Building playerColor={color}>
              <CityIcon />
            </Building>
          );
        }
      }
    }

    return <></>;
  };

  const hasRobber = (tile: TileCoordinate) => {
    if (robber) {
      return vectorsEqual(robber, tile);
    }

    return false;
  };

  const canBuildRoad = (edgeCoord: EdgeCoordinate) => {
    let buildings = state.buildings;
    let roads = state.roads;

    /// When building initial roads, only allow building off of the first or second buildings
    if (state.phase === GamePhase.SETUP_ROUND_2) {
      const playersBuildings = state.buildings.filter(
        (building) => building.playerId === state.you.playerId
      );

      /// Only allow building off of the second building the player built
      buildings = [playersBuildings[1]];
      roads = [];
    }

    return isValidRoadPosition(
      state.board,
      roads,
      buildings,
      state.you.playerId,
      edgeCoord
    );
  };

  const canBuildSettlement = (vertexCoord: VertexCoordinate) => {
    let buildings = state.buildings;
    let roads = state.roads;
    let mustConnect = true;

    /// Allow building on any empty space during the first setup round
    if (
      state.phase === GamePhase.SETUP_ROUND_1 ||
      state.phase === GamePhase.SETUP_ROUND_2
    ) {
      mustConnect = false;
    }

    return isValidSettlementPosition(
      state.board,
      roads,
      buildings,
      state.you.playerId,
      vertexCoord,
      mustConnect
    );
  };

  const drawPlaceRobberButton = (tile: TileCoordinate) =>
    placingRobber &&
    !vectorsEqual(state.robber || { x: -1, y: -1, z: -1 }, tile);

  const [lightBackerImg, darkBackerImg] = boardBackgroundImgs(tiles.length);
  const backerImg = useColorModeValue(lightBackerImg, darkBackerImg);

  const tileBackgroundImage = useColorModeValue(tileLightImg, tileDarkImg);
  const boardBackgroundColor = useColorModeValue("#fefefe", "#121212");

  return (
    <Container backgroundColor={boardBackgroundColor}>
      {resizeListener}

      <ZoomControls>
        <ButtonGroup isAttached variant="solid">
          <IconButton
            aria-label="Zoom in"
            icon={<FaSearchPlus />}
            onClick={zoomIn}
            colorScheme="gray"
          />
          <IconButton
            aria-label="Zoom out"
            icon={<FaSearchMinus />}
            onClick={zoomOut}
            colorScheme="gray"
          />
        </ButtonGroup>
      </ZoomControls>

      <LastRoll />

      <OverflowContainer ref={scrollRef}>
        <TileContainer
          zoom={zoom}
          containerW={boardWidthTiles * TILE_WIDTH + BOARD_PADDING}
          containerH={boardHeightTiles * TILE_WIDTH + BOARD_PADDING}
          viewportW={width || 100}
          viewportH={height || 100}
        >
          <TileOriginContainer zoom={zoom}>
            <BackgroundImage src={backerImg} />

            {tiles.map(
              ({ diceNumber, tileType, location: { x, y, z } }, index) => (
                <React.Fragment key={index}>
                  <Tile position={locationToPosition({ x, y, z })}>
                    <TileIcon
                      diceNumber={diceNumber > 0 ? diceNumber.toString() : ""}
                      tileType={tileType}
                      hasRobber={hasRobber({ x, y, z })}
                    />

                    <TileImage src={tileBackgroundImage} />
                  </Tile>

                  <EdgesContainer position={locationToPosition({ x, y, z })}>
                    {range(6)
                      .filter((index) =>
                        shouldDrawEdge(tiles, { x, y, z }, index)
                      )
                      .map((index) => (
                        <EdgeContainer index={index}>
                          <EdgeLine index={index} color={"#ddd"} width={3} />
                        </EdgeContainer>
                      ))}
                  </EdgesContainer>

                  <RoadsContainer position={locationToPosition({ x, y, z })}>
                    {range(6)
                      .filter((index) =>
                        shouldDrawEdge(tiles, { x, y, z }, index)
                      )
                      .map((index) => (
                        <EdgeContainer index={index}>
                          {renderRoad({ x, y, z }, index)}
                        </EdgeContainer>
                      ))}
                  </RoadsContainer>

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
                        .filter((index) =>
                          shouldDrawEdge(tiles, { x, y, z }, index)
                        )
                        .filter((index) =>
                          canBuildRoad({ tile: { x, y, z }, edgeIndex: index })
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
                        .filter((index) =>
                          shouldDrawVertex(tiles, { x, y, z }, index)
                        )
                        .filter((index) =>
                          placingCity
                            ? settlementExists(
                                you?.playerId,
                                { x, y, z },
                                index
                              )
                            : canBuildSettlement({
                                tile: { x, y, z },
                                vertexIndex: index,
                              })
                        )
                        .map((index) => (
                          <VertexContainer index={index}>
                            <IconButton
                              zIndex="4"
                              position="absolute"
                              top="20px"
                              transform="translate(-50%, -50%)"
                              icon={<FaHammer />}
                              aria-label=""
                              variant="solid"
                              size="sm"
                              colorScheme="green"
                              onClick={onPlaceBuilding({
                                tile: { x, y, z },
                                vertexIndex: index,
                              })}
                            />
                          </VertexContainer>
                        ))}

                    {drawPlaceRobberButton({ x, y, z }) && (
                      <PlaceRobberButtonContainer>
                        <IconButton
                          variant="solid"
                          colorScheme="red"
                          icon={<FaArrowCircleDown />}
                          aria-label="Place robber"
                          onClick={onPlaceRobber({ x, y, z })}
                        />
                      </PlaceRobberButtonContainer>
                    )}
                  </ButtonsContainer>
                </React.Fragment>
              )
            )}
          </TileOriginContainer>
        </TileContainer>
      </OverflowContainer>
    </Container>
  );
};

export default GameBoard;
