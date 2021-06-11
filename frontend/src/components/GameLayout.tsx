import { Box } from "@chakra-ui/layout";
import React, { ReactNode } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { responsiveVisibiity } from "../responsiveUtils";

import Bank from "./Bank";
import Board from "./GameBoard";
import Resources from "./Resources";
import Players from "./Players";
import Actions from "./Actions";
import Log from "./Log";
import Prices from "./Prices";

const GameColumn = ({
  flex,
  minWidth = "inherit",
  children,
  hiddenOn = "none",
  shownOn = "none",
}: {
  flex: string;
  minWidth?: string;
  hiddenOn?: string;
  shownOn?: string;
  children: ReactNode;
}) => (
  <Box
    flex={flex}
    minW={minWidth}
    alignSelf="stretch"
    display={responsiveVisibiity(hiddenOn, shownOn, "flex", "none")}
    flexDir="column"
    p="1"
  >
    {children}
  </Box>
);

const TabContainer = ({
  children,
  flex = "initial",
  hiddenOn = "none",
  shownOn = "none",
}: {
  children: ReactNode;
  flex?: string;
  hiddenOn?: string;
  shownOn?: string;
}) => (
  <Box
    p={1}
    flex={flex}
    flexDir="column"
    display={responsiveVisibiity(hiddenOn, shownOn, "flex", "none")}
  >
    {children}
  </Box>
);

type TabDefn = {
  name: string;
  content: React.FC<any>;
  shownOn?: string;
  hiddenOn?: string;
  shownIf?: boolean;
};

const TabSet = ({ tabs }: { tabs: TabDefn[] }) => {
  return (
    <Tabs
      variant="enclosed"
      colorScheme="colorScheme"
      display="flex"
      flexDirection="column"
      flex="1"
    >
      <TabList>
        {tabs
          .filter(({ shownIf }) => (shownIf != undefined ? shownIf : true))
          .map(({ name, hiddenOn, shownOn }) => (
            <Tab
              display={responsiveVisibiity(
                hiddenOn,
                shownOn,
                "inherit",
                "none"
              )}
            >
              {name}
            </Tab>
          ))}
      </TabList>

      <TabPanels
        borderStyle="solid"
        borderWidth="thin"
        borderTop="none"
        flex="1"
        roundedBottom="md"
        display="flex"
        flexDirection="column"
      >
        {tabs.map(({ hiddenOn, shownOn, content: ContentComponent }) => (
          <TabPanel
            display={responsiveVisibiity(hiddenOn, shownOn, "flex", "none")}
            flex="1"
            flexDirection="column"
          >
            <ContentComponent />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

const GameLayout = () => {
  return (
    <Box flex="1" display="flex">
      {/* Left columns */}
      <GameColumn flex="1" hiddenOn="md">
        <TabContainer>
          <TabSet tabs={[{ name: "Bank", content: Bank }]} />
        </TabContainer>

        <TabContainer flex="1">
          <TabSet tabs={[{ name: "Players", content: Players }]} />
        </TabContainer>
      </GameColumn>

      {/* Middle column */}
      <GameColumn flex="2">
        <Box
          bgColor="blue.800"
          alignSelf="stretch"
          display={responsiveVisibiity("xs", "none", "inherit", "none")}
          flex="1 1 auto"
          height="0px"
          overflowY="hidden"
        >
          <Board />
        </Box>

        <TabContainer shownOn="xs" flex="1">
          <TabSet
            tabs={[
              {
                name: "Game Board",
                shownOn: "xs",
                content: Board,
              },
              { name: "Players", content: Players },
              { name: "Log", content: Log },
            ]}
          />
        </TabContainer>

        <TabContainer>
          <TabSet
            tabs={[
              { name: "Resources", content: Resources },
              { name: "Prices", content: Prices },
              {
                name: "Bank",
                shownOn: "xs",
                content: Bank,
              },
              {
                name: "Actions",
                content: Actions,
                shownOn: "xs",
              },
            ]}
          />
        </TabContainer>
      </GameColumn>

      {/* Right column */}
      <GameColumn flex="1" hiddenOn="xs">
        <TabContainer shownOn="md">
          <TabSet
            tabs={[
              {
                name: "Bank",
                content: Bank,
              },
            ]}
          />
        </TabContainer>

        <TabContainer flex="2">
          <TabSet
            tabs={[
              { name: "Log", content: Log },
              {
                name: "Players",
                shownOn: "md",
                content: Players,
              },
            ]}
          />
        </TabContainer>

        <TabContainer>
          <TabSet tabs={[{ name: "Actions", content: Actions }]} />
        </TabContainer>
      </GameColumn>
    </Box>
  );
};

export default GameLayout;
