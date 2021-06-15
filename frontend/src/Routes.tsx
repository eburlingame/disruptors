import * as React from "react";
import { VStack, Spinner } from "@chakra-ui/react";
import { Switch, Route } from "react-router-dom";
import { useSessionLoadingState } from "./hooks/session";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import JoinGamePage from "./pages/Join";
import GamePage from "./pages/Game";

const Routes = () => {
  const { isLoading } = useSessionLoadingState();

  if (isLoading) {
    return (
      <Layout title="">
        <VStack>
          <Spinner />
        </VStack>
      </Layout>
    );
  }

  return (
    <Switch>
      <Route path="/join">
        <JoinGamePage />
      </Route>

      <Route path="/room/:roomCode">
        <GamePage />
      </Route>

      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  );
};

export default Routes;
