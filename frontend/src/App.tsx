import * as React from "react";
import { ChakraProvider, Box, theme } from "@chakra-ui/react";

export const App = () => {
  React.useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws");

    ws.onmessage = (e) => {
      console.log("Got message: ", JSON.parse(e.data));
    };

    ws.onopen = () => {
      console.log("WS opened");
      ws.send(JSON.stringify({ reqId: "1", v: "openSession" }));
    };

    ws.onclose = () => console.log("WS closed");
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl"></Box>
    </ChakraProvider>
  );
};
