import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Center, HStack, VStack } from "@chakra-ui/layout";
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

  const goHome = async () => {
    history.push(`/`);
  };

  const tryjoinRoom = async () => {
    const result = await joinRoom(draftGameCode);

    if (result && result.room) {
      history.push(`/room/${result.room.roomCode}`);
    }
  };

  const onGameCodeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = e.target.value.toUpperCase();
    if (newValue.length <= 4) {
      setDraftGameCode(newValue);
    }
  };

  useEffect(() => {
    if (joinError) {
      setError(joinError);
    }
  }, [joinError]);

  return (
    <Layout title="Welcome">
      <VStack mt="8" maxW="60ch" marginX="auto">
        <HStack marginBottom="4">
          <Box>Game code:</Box>

          <Input
            placeholder="Enter the game code"
            onChange={onGameCodeChange}
            onKeyDown={(e) => e.key === "Enter" && tryjoinRoom()}
            value={draftGameCode}
            autoFocus={true}
            flex="1"
          />
        </HStack>

        {error && <Box color="red.600">{error}</Box>}

        <Button onClick={tryjoinRoom} isLoading={joining} size="lg">
          Join game
        </Button>

        <Button onClick={goHome} isLoading={joining} variant="ghost">
          Go back
        </Button>
      </VStack>
    </Layout>
  );
};

export default JoinGame;
