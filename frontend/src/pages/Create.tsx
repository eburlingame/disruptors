import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Center, Container, VStack } from "@chakra-ui/layout";
import React from "react";
import { useHistory } from "react-router";
import Layout from "../components/Layout";

import { useCreateGame } from "../hooks/room";

const CreateGamePage = ({}) => {
  const history = useHistory();

  const { createGame } = useCreateGame();

  const onCreateGame = async () => {
    const result = await createGame("");

    if (result && result.room && result.room.roomCode) {
      history.push(`/room/${result.room.roomCode}`);
    }
  };

  return (
    <Layout title="Create a game">
      <Container>
        <VStack mt="8">
          <Box>Game name: (optional)</Box>
          <Input type="text" />

          <Button onClick={onCreateGame}>Create Game</Button>
        </VStack>
      </Container>
    </Layout>
  );
};

export default CreateGamePage;
