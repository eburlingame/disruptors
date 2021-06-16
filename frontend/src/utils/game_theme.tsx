import React from "react";

import { FaBitcoin } from "react-icons/fa";

import devLargeImg from "../images/icons_dev_l.svg";
import internLargeImg from "../images/icons_intern_l.svg";
import serverLargeImg from "../images/icons_server_l.svg";
import shuttleLargeImg from "../images/icons_shuttle_l.svg";
import snacksLargeImg from "../images/icons_snacks_l.svg";

import officeImg from "../images/icons_office.svg";
import garageImg from "../images/icons_garage.svg";
import shieldImg from "../images/icons_shield.svg";
import malwareImg from "../images/icons_malware.svg";
import bitcoinImg from "../images/icons_bitcoin.svg";

import angelImg from "../images/icons_angel.svg";
import resourceCardsImg from "../images/icons_resource_cards.svg";
import fiberImg from "../images/icons_fiber.svg";

import {
  ResourceType,
  PlayerColor,
  DevelopmentCardType,
} from "../state/game_types";

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
  robber: ThemeResource;
  genericDevelopmentCards: ThemeResource;
  developmentCards: {
    [DevelopmentCardType.KNIGHT]: ThemeResource;
    [DevelopmentCardType.VICTORY_POINT]: ThemeResource;
  };
  resourceCards: ThemeResource;
  victoryPoints: ThemeResource;
};

export const resourceIcon = (src: string) => () => {
  return <img src={src} style={{ height: "2em" }} />;
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
      icon: resourceIcon(fiberImg),
    },
    settlement: {
      name: "garage",
      pluralName: "garages",
      label: "Garages",
      icon: resourceIcon(garageImg),
    },
    city: {
      name: "office",
      pluralName: "offices",
      label: "Office",
      icon: resourceIcon(officeImg),
    },
  },
  playerColors: {
    [PlayerColor.Red]: {
      primary: "#F94144",
    },
    [PlayerColor.Green]: {
      primary: "#90BE6D",
    },
    [PlayerColor.Blue]: {
      primary: "#577590",
    },
    [PlayerColor.Purple]: {
      primary: "#F8961E",
    },
    [PlayerColor.Teal]: {
      primary: "#43AA8B",
    },
    [PlayerColor.Orange]: {
      primary: "#F3722C",
    },
  },
  robber: {
    name: "malware",
    pluralName: "malwares",
    label: "Malware",
    icon: resourceIcon(malwareImg),
  },
  victoryPoints: {
    name: "bitcoin",
    pluralName: "bitcoins",
    label: "Bitcoin",
    icon: resourceIcon(bitcoinImg),
  },
  resourceCards: {
    name: "resource card",
    pluralName: "resource cards",
    label: "Resource cards",
    icon: resourceIcon(resourceCardsImg),
  },
  genericDevelopmentCards: {
    name: "development card",
    pluralName: "development cards",
    label: "Development cards",
    icon: resourceIcon(angelImg),
  },
  developmentCards: {
    [DevelopmentCardType.KNIGHT]: {
      name: "antivirus",
      pluralName: "antiviruses",
      label: "Antivirus",
      icon: resourceIcon(shieldImg),
    },
    [DevelopmentCardType.VICTORY_POINT]: {
      name: "free Bitcoin",
      pluralName: "free Bitcoins",
      label: "Free Bitcoin",
      icon: FaBitcoin,
    },
  },
};

export default theme;
