import React from "react";
import { Box } from "@chakra-ui/layout";
import { responsiveVisibiity } from "../responsiveUtils";
import TabContainer from "./TabContainer";
import TabSet from "./TabSet";
import GameColumn from "./GameColumn";

import Bank from "./Bank";
import Board from "./GameBoard";
import Resources from "./Resources";
import Players from "./Players";
import Actions from "./Actions";
import Log from "./Log";
import Prices from "./Prices";

const GameLayout = () => {
  return (
    <Box flex="1" display="flex">
      {/* Left columns */}
      <GameColumn flex="1" hiddenOn="md">
        <TabContainer>
          <TabSet tabs={[{ name: "Bank", content: Bank }]} />
        </TabContainer>

        <TabContainer flex="1">
          <TabSet
            tabs={[
              { name: "Players", content: Players },
              { name: "Prices", content: Prices },
            ]}
          />
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
              { name: "Prices", content: Prices },
              { name: "Log", content: Log },
            ]}
          />
        </TabContainer>

        <TabContainer>
          <TabSet
            tabs={[
              { name: "Resources", content: Resources },
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
              { name: "Prices", content: Prices },
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
