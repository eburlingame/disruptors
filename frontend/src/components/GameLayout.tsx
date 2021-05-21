import { Box } from "@chakra-ui/layout";
import React, { ReactNode } from "react";
import { GameState } from "../state/atoms";
import Layout from "./Layout";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { responsiveVisibiity } from "../responsiveUtils";

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
};

const TabSet = ({ tabs }: { tabs: TabDefn[] }) => {
  return (
    <Tabs variant="enclosed" flex="1" display="flex" flexDir="column">
      <TabList>
        {tabs.map(({ name, hiddenOn, shownOn }) => (
          <Tab
            display={responsiveVisibiity(hiddenOn, shownOn, "inherit", "none")}
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
      >
        {tabs.map(({ hiddenOn, shownOn, content: ContentComponent }) => (
          <TabPanel
            display={responsiveVisibiity(hiddenOn, shownOn, "inherit", "none")}
          >
            <ContentComponent />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

const GameLayout = ({}) => {
  const Bank = ({}) => <div>Bank</div>;
  const Players = ({}) => <div>Players</div>;
  const Board = ({}) => <div>Game board</div>;
  const Chat = ({}) => <div>Chat</div>;
  const Actions = ({}) => <div>Actions</div>;
  const Resources = ({}) => <div>Resources</div>;

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
          flex="1"
          alignSelf="stretch"
          display={responsiveVisibiity("xs", "none", "inherit", "none")}
        >
          <Board />
        </Box>

        <TabContainer shownOn="xs" flex="1">
          <TabSet
            tabs={[
              {
                name: "Game Board",
                shownOn: "xs",
                content: ({}) => (
                  <Box bgColor="blue.800" flex="1" alignSelf="stretch">
                    <Board />
                  </Box>
                ),
              },
              { name: "Players", content: Players },
              { name: "Chat", content: Chat },
            ]}
          />
        </TabContainer>

        <TabContainer>
          <TabSet
            tabs={[
              {
                name: "Bank",
                shownOn: "xs",
                content: ({}) => <div>Bank</div>,
              },
              { name: "Resources", content: Resources },
              { name: "Actions", content: Actions },
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
                content: ({}) => <div>Bank</div>,
              },
            ]}
          />
        </TabContainer>

        <TabContainer flex="2">
          <TabSet
            tabs={[
              {
                name: "Players",
                shownOn: "md",
                content: Players,
              },
              { name: "Chat", content: Chat },
            ]}
          />
        </TabContainer>

        <TabContainer flex="1">
          <TabSet tabs={[{ name: "Actions", content: Actions }]} />
        </TabContainer>
      </GameColumn>
    </Box>
  );
};

export default GameLayout;
