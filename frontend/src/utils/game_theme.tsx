import {
  FaBuilding,
  FaBus,
  FaCoffee,
  FaGraduationCap,
  FaIdBadge,
  FaNetworkWired,
  FaServer,
  FaWarehouse,
} from "react-icons/fa";

import { ResourceType, PlayerColor } from "../state/game_types";

export type ThemeResource = {
  name: string;
  pluralName: string;
  label: string;
  icon: React.FC;
};

export type PlayerColorValue = {
  primary: string;
};

export type GameTheme = {
  resources: {
    [ResourceType.WHEAT]: ThemeResource;
    [ResourceType.WOOD]: ThemeResource;
    [ResourceType.ORE]: ThemeResource;
    [ResourceType.BRICK]: ThemeResource;
    [ResourceType.SHEEP]: ThemeResource;
  };
  buildings: {
    road: ThemeResource;
    settlement: ThemeResource;
    city: ThemeResource;
  };
  playerColors: {
    [PlayerColor.Red]: PlayerColorValue;
    [PlayerColor.Green]: PlayerColorValue;
    [PlayerColor.Blue]: PlayerColorValue;
    [PlayerColor.Teal]: PlayerColorValue;
    [PlayerColor.Purple]: PlayerColorValue;
    [PlayerColor.Orange]: PlayerColorValue;
  };
};

export const resources = [
  ResourceType.WHEAT,
  ResourceType.WOOD,
  ResourceType.ORE,
  ResourceType.BRICK,
  ResourceType.SHEEP,
];

const theme: GameTheme = {
  resources: {
    [ResourceType.WHEAT]: {
      name: "dev",
      pluralName: "devs",
      label: "Developers",
      icon: FaIdBadge,
    },
    [ResourceType.WOOD]: {
      name: "intern",
      pluralName: "interns",
      label: "Interns",
      icon: FaGraduationCap,
    },
    [ResourceType.ORE]: {
      name: "shuttle bus",
      pluralName: "shuttle busses",
      label: "Shuttle busses",
      icon: FaBus,
    },
    [ResourceType.BRICK]: {
      name: "server",
      pluralName: "servers",
      label: "Servers",
      icon: FaServer,
    },
    [ResourceType.SHEEP]: {
      name: "snack",
      pluralName: "snacks",
      label: "Snacks",
      icon: FaCoffee,
    },
  },
  buildings: {
    road: {
      name: "fiber",
      pluralName: "fiber cables",
      label: "Fiber cable",
      icon: FaNetworkWired,
    },
    settlement: {
      name: "garage",
      pluralName: "garages",
      label: "Garages",
      icon: FaWarehouse,
    },
    city: {
      name: "office",
      pluralName: "offices",
      label: "Office",
      icon: FaBuilding,
    },
  },
  playerColors: {
    [PlayerColor.Red]: {
      primary: "#FF0000",
    },
    [PlayerColor.Green]: {
      primary: "#00FF00",
    },
    [PlayerColor.Blue]: {
      primary: "#0000FF",
    },
    [PlayerColor.Purple]: {
      primary: "#FF00FF",
    },
    [PlayerColor.Teal]: {
      primary: "#00FFFF",
    },
    [PlayerColor.Orange]: {
      primary: "#FFFF00",
    },
  },
};

export default theme;
