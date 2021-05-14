import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSessionLoadingState } from "./hooks/session";

const ProtectedRoute = ({ children, ...rest }: any) => {
  const { isOpen } = useSessionLoadingState();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isOpen ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
