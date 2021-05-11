import { v4 as uuid } from "uuid";

import { useEffect, useState } from "react";
import { useSocket } from "./socket";

export type RequestResponse = {
  sucess: boolean;
  error?: string;
  v: string;
  d: any;
};

export type SendCommandResult =
  | {
      sucess: true;
      data: any;
    }
  | {
      sucess: false;
      error: string;
    };

export const useCommand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socket = useSocket();

  const sendCommand = async (
    verb: string,
    params: any
  ): Promise<SendCommandResult> => {
    if (socket) {
      setLoading(true);

      try {
        const response: RequestResponse = await socket.sendRequest(
          { v: verb, d: params },
          { requestId: uuid() }
        );

        // Server returned sucessfully
        if (response.sucess) {
          setLoading(false);
          setError(null);

          return { sucess: true, data: response.d };
        }
        // Server returned an error
        else if (response.error) {
          setError(response.error);
          setLoading(false);

          return { sucess: false, error: response.error };
        }
        // Server returned something unexpected
        else {
          setError("Unknown error occured");
          setLoading(false);

          return { sucess: false, error: "Unknown error occured" };
        }
      } catch (e) {
        setError(e.message);
        setLoading(false);

        return { sucess: false, error: e.message };
      }
    }

    return { sucess: false, error: "Socket is not open" };
  };

  return { sendCommand, loading, error };
};
