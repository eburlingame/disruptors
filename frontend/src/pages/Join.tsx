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
      <Box mt="8" maxW="60ch" marginX="auto" textAlign="center">
        <Box fontSize="xl" fontWeight="bold" marginBottom="4">
          Join a Game
        </Box>

        <HStack marginY="4">
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

        <VStack>
          <Button
            onClick={tryjoinRoom}
            isLoading={joining}
            size="lg"
            colorScheme="green"
          >
            Join game
          </Button>
          <Button onClick={goHome} isLoading={joining} variant="ghost">
            Go back
          </Button>
        </VStack>
      </Box>
    </Layout>
  );
};

export default JoinGame;
