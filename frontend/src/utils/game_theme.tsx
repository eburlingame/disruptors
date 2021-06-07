import React from "react";

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

import devLargeImg from "../images/icons_dev_l.svg";
import internLargeImg from "../images/icons_intern_l.svg";
import serverLargeImg from "../images/icons_server_l.svg";
import shuttleLargeImg from "../images/icons_shuttle_l.svg";
import snacksLargeImg from "../images/icons_snacks_l.svg";

import devSmallmg from "../images/icons_dev_s.svg";
import internSmallmg from "../images/icons_intern_s.svg";
import serverSmallmg from "../images/icons_server_s.svg";
import shuttleSmallmg from "../images/icons_shuttle_s.svg";
import snacksSmallmg from "../images/icons_snacks_s.svg";

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

export const resourceIcon = (src: string) => () => {
  return <img src={src} />;
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
      icon: resourceIcon(devLargeImg),
    },
    [ResourceType.WOOD]: {
      name: "intern",
      pluralName: "interns",
      label: "Interns",
      icon: resourceIcon(internLargeImg),
    },
    [ResourceType.ORE]: {
      name: "shuttle bus",
      pluralName: "shuttle buses",
      label: "Shuttle buses",
      icon: resourceIcon(shuttleLargeImg),
    },
    [ResourceType.BRICK]: {
      name: "server",
      pluralName: "servers",
      label: "Servers",
      icon: resourceIcon(serverLargeImg),
    },
    [ResourceType.SHEEP]: {
      name: "snack",
      pluralName: "snacks",
      label: "Snacks",
      icon: resourceIcon(snacksLargeImg),
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
