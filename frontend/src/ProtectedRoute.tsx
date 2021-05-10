import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSession } from "./hooks/session";

const ProtectedRoute = ({ children, ...rest }: any) => {
  const { isOpen } = useSession();

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
