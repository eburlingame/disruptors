import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { useSessionLoadingState } from "./hooks/session";
import HomePage from "./pages/Home";
import JoinGamePage from "./pages/Join";
import GamePage from "./pages/Game";
import Loading from "./pages/Loading";

const Routes = () => {
  const { isLoading } = useSessionLoadingState();

  if (isLoading) {
    return <Loading />;
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
