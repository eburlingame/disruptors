import { GamePlayer } from "./model";

export enum GamePhase {
  SETUP_ROUND_1 = "setup1",
  SETUP_ROUND_2 = "setup2",
  PLAYING = "playing",
  ROBBER_ROLLER = "robber_rolled",
}

export type TileCoordinate = {
  x: number;
  y: number;
  z: number;
};

///     Edge indexes:
///       5      0
///          / \
///      4  |   |  1
///          \ /
///       3       2

export type EdgeCoordinate = {
  tile: TileCoordinate;
  edgeIndex: number;
};

///     Vertex indexes:
///          0
///      5  / \ 1
///        |   |
///       4 \ / 2
///          3

export type VertexCoordinate = {
  tile: TileCoordinate;
  vertexIndex: number;
};

export enum ResourceType {
  BRICK = "brick",
  WOOD = "wood",
  ORE = "ore",
  WHEAT = "wheat",
  SHEEP = "sheep",
}

export enum PortResource {
  BRICK = "brick",
  WOOD = "wood",
  ORE = "ore",
  WHEAT = "wheat",
  SHEEP = "sheep",
  ANY = "any",
}

export type Port = ExchangeRate & {
  vertexIndex: number;
};

export type ExchangeRate = {
  resource: PortResource;
  ratio: number;
};

export enum TileType {
  BRICK = "brick",
  WOOD = "wood",
  ORE = "ore",
  WHEAT = "wheat",
  SHEEP = "sheep",
  DESERT = "desert",
}

export type GameTile = {
  location: TileCoordinate;
  tileType: TileType;
  ports: Port[];
  diceNumber: number;
};

export type GameBoard = {
  tiles: GameTile[];
};

export type ResourceCount = {
  resource: ResourceType;
  count: number;
};

export type BuildSettlementAction = {
  name: "buildSettlement";
  location: VertexCoordinate;
};

export type BuildCityAction = {
  name: "buildCity";
  location: VertexCoordinate;
};

export type BuildRoadAction = {
  name: "buildRoad";
  location: EdgeCoordinate;
};

export type RollDiceAction = {
  name: "rollDice";
  values: [number, number];
  distribution?: ResourceDistribution;
};

export type RequestTradeAction = {
  name: "requestTrade";
  seeking: ResourceCount[];
  giving: ResourceCount[];
};

export type TurnAction =
  | "buildSettlement"
  | "buildCity"
  | "buildRoad"
  | "playDevCard"
  | "startPlayerTradeRequest"
  | "startBankTradeRequest"
  | "idle";

export type ChangeTurnAction = {
  name: "changeTurnAction";
  turnAction: TurnAction;
};

export type AcceptTradeAction = {
  name: "acceptTrade";
  acceptance: TradeAcceptance;
};

export type CompleteTradeAction = {
  name: "completeTrade";
  completeTrade: boolean;
  acceptedTradeFrom: string;
  seeking?: ResourceCount[];
  giving?: ResourceCount[];
};

export type EndTurnAction = {
  name: "endTurn";
};

export type BankTradeAction = {
  name: "bankTrade";
  seeking: ResourceCount[];
  giving: ResourceCount[];
};

export type BuyDevCardAction = {
  name: "buyDevCard";
};

export type PlayDevCardAction = {
  name: "playDevCard";
  card: DevelopmentCardType;
};

export type DiscardCardsAction = {
  name: "discardCards";
  discarding: ResourceCount[];
};

export type PlaceRobberAction = {
  name: "placeRobber";
  location: TileCoordinate;
};

export type StealCardAction = {
  name: "stealCard";
  stealFrom: string;
};

export type CatanAction =
  | BuildSettlementAction
  | BuildCityAction
  | BuildRoadAction
  | RollDiceAction
  | ChangeTurnAction
  | RequestTradeAction
  | AcceptTradeAction
  | CompleteTradeAction
  | BankTradeAction
  | DiscardCardsAction
  | PlaceRobberAction
  | StealCardAction
  | EndTurnAction
  | BuyDevCardAction
  | PlayDevCardAction;

export type CatanConfig = {
  cardDiscardLimit: number;
};

export enum DevelopmentCardType {
  KNIGHT = "knight",
  VICTORY_POINT = "victoryPoint",
}

export type DevelopmentCards = {
  [DevelopmentCardType.KNIGHT]: number;
  [DevelopmentCardType.VICTORY_POINT]: number;
};

export type Bank = {
  brick: number;
  wood: number;
  ore: number;
  wheat: number;
  sheep: number;
  developmentCards: DevelopmentCards;
};

export enum BuildingType {
  Settlement = "settlement",
  City = "city",
}

export enum PlayerTurnState {
  IDLE = "idle",
  MUST_ROLL = "mustRoll",
  MUST_PLACE_ROBBER = "mustPlaceRobber",
  MUST_STEAL_CARD = "mustStealCard",

  PLACING_SETTLEMENT = "placingSettlement",
  PLACING_CITY = "placingCity",
  PLACING_ROAD = "placingRoad",
  PLAYING_DEV_CARD = "playingDevCard",

  CREATING_BANK_TRADE_REQUEST = "creatingBankTrade",
  CREATING_PLAYER_TRADE_REQUEST = "creatingPlayerTradeRequest",
  SUBMITTED_PLAYER_TRADE_REQUEST = "submittedPlayerTradeRequest",
}

export type Building = {
  location: VertexCoordinate;
  type: BuildingType;
  playerId: string; // owner
};

export type Road = {
  location: EdgeCoordinate;
  playerId: string; // owner
};

export enum TradeAcceptance {
  UNDECIDED = "undecided",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
}

export type PlayerTradeAcceptance = {
  playerId: string;
  acceptance: TradeAcceptance;
};

export type TradeRequest = {
  playerId: string;
  seeking: ResourceCount[];
  giving: ResourceCount[];
  acceptance: PlayerTradeAcceptance[];
};

export type ResourceQuantities = {
  [ResourceType.BRICK]: number;
  [ResourceType.ORE]: number;
  [ResourceType.WHEAT]: number;
  [ResourceType.SHEEP]: number;
  [ResourceType.WOOD]: number;
};

export type ResourceDistribution = {
  [playerId: string]: ResourceQuantities;
};

export enum PlayerColor {
  Red = "red",
  Green = "green",
  Blue = "blue",
  Orange = "orange",
  Purple = "purple",
  Teal = "teal",
}

export type CatanPlayer = GamePlayer & {
  color: PlayerColor;
  resources: {
    brick: number;
    wood: number;
    ore: number;
    wheat: number;
    sheep: number;
  };
  developmentCards: DevelopmentCards;
  pendingDevelopmentCards?: DevelopmentCards;
  points: {
    public: number; /// includes cities, settlements, longest road, largest army
    private: number; /// includes development cards victory poitns
  };
  robberDeployCount: number;
  longestRoad: number;
  mustDiscard: number;
};

export type CatanOtherPlayer = GamePlayer & {
  color: PlayerColor;
  totalResourceCards: number;
  totalDevelopmentCards: number;
  robberDeployCount: number;
  longestRoad: number;
  points: number;
};

export type CatanState = {
  config: CatanConfig;
  phase: GamePhase;
  board: GameBoard;
  buildings: Building[];
  roads: Road[];
  bank: Bank;
  players: CatanPlayer[];
  robber: TileCoordinate | null;
  longestRoadOwner: string | null;
  largestArmyOwner: string | null;
  activePlayerId: string;
  activePlayerTurnState: PlayerTurnState;
  activeTradeRequest?: TradeRequest;
};

/// The state that is seen by any given player
export type CatanPlayersState = {
  config: CatanConfig;
  phase: GamePhase;
  board: GameBoard;
  bank: Bank;
  buildings: Building[];
  roads: Road[];
  you: CatanPlayer;
  players: CatanOtherPlayer[];
  robber: TileCoordinate | null;
  activePlayerId: string;
  activePlayerTurnState: PlayerTurnState;
  activeTradeRequest?: TradeRequest;
  availableExchanges: ExchangeRate[];
};

/// The state that is seen by any given player
export type CatanGameSummary = {
  winner: string;
  diceFrequencies: number[];
  players: CatanPlayer[];
};
