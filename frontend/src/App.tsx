import * as React from "react";
import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import { SessionBootstrapper } from "./hooks/session";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./Routes";

export const App = () => {
  return (
    <RecoilRoot>
      <SessionBootstrapper>
        <ChakraProvider theme={theme}>
          <Router>
            <Routes />
          </Router>
        </ChakraProvider>
      </SessionBootstrapper>
    </RecoilRoot>
  );
};
