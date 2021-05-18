import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Center } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Cleave from "cleave.js/react";
import Layout from "../components/Layout";
import { useJoinRoom } from "../hooks/room";
import { Link } from "react-router-dom";

const JoinGame = ({}) => {
  const history = useHistory();

  const [draftGameCode, setDraftGameCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { joinRoom, joining, error: joinError } = useJoinRoom();

  const tryjoinRoom = async () => {
    const result = await joinRoom(draftGameCode);

    if (result && result.room) {
      history.push(`/room/${result.room.roomCode}`);
    }
  };

  useEffect(() => {
    if (joinError) {
      setError(joinError);
    }
  }, [joinError]);

  return (
    <Layout title="Welcome">
      <Center mt="8">
        {error && <Box>{error}</Box>}

        <Input
          placeholder="Enter the game code"
          onChange={(e) => {
            const newValue = e.target.value.toUpperCase();
            if (newValue.length <= 4) {
              setDraftGameCode(newValue);
            }
          }}
          value={draftGameCode}
        />
        <Button onClick={tryjoinRoom} isLoading={joining}>
          Join game
        </Button>
      </Center>

      <Link to="/">Home</Link>
    </Layout>
  );
};

export default JoinGame;
