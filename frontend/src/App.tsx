import * as React from "react";
import { useEffect, useRef } from "react";
import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import WebSocketAsPromised from "websocket-as-promised";
import { v4 as uuid } from "uuid";

const WS_API_URL = "ws://localhost:8080/ws";

const useSocket = () => {
  const socket = useRef<WebSocketAsPromised | null>(null);

  useEffect(() => {
    const openSocket = async () => {
      socket.current = new WebSocketAsPromised(WS_API_URL, {
        packMessage: (data: any) => JSON.stringify(data),
        unpackMessage: (data: any) => JSON.parse(data),

        attachRequestId: (data, requestId) => ({ ...data, reqId: requestId }),
        extractRequestId: (data) => data && data.reqId,
      });

      await socket.current.open();
      console.log("Socket opened!");
      const result = await socket.current.sendRequest(
        {
          v: "openSession",
        },
        { requestId: uuid() }
      );
    };

    openSocket();
  }, []);
};

export const App = () => {
  useSocket();

  // React.useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8080/ws");

  //   ws.onmessage = (e) => {
  //     console.log("Got message: ", JSON.parse(e.data));
  //   };

  //   ws.onopen = () => {
  //     console.log("WS opened");
  //     ws.send(JSON.stringify({ reqId: "1", v: "openSession" }));
  //   };

  //   ws.onclose = () => console.log("WS closed");
  // }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl"></Box>
    </ChakraProvider>
  );
};
