import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import { SessionBootstrapper } from "./hooks/session";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./Routes";
import { SocketBootstrapper } from "./hooks/socket";

import theme from "./theme";

import "./index.css";
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";

export const App = () => {
  return (
    <RecoilRoot>
      <SocketBootstrapper>
        <SessionBootstrapper>
          <ChakraProvider theme={theme}>
            <Router>
              <Routes />
            </Router>
          </ChakraProvider>
        </SessionBootstrapper>
      </SocketBootstrapper>
    </RecoilRoot>
  );
};
