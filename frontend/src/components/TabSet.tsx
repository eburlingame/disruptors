import React from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { responsiveVisibiity } from "../responsiveUtils";

export type TabDefn = {
  name: string;
  content: React.FC<any>;
  shownOn?: string;
  hiddenOn?: string;
  shownIf?: boolean;
};

export default ({ tabs }: { tabs: TabDefn[] }) => {
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
