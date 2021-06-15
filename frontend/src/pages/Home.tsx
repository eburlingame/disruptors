import { Button } from "@chakra-ui/button";
import { Box, VStack } from "@chakra-ui/layout";
import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useCreateGame } from "../hooks/room";

const HomePage = ({}) => {
  const history = useHistory();

  const { createGame } = useCreateGame();

  const onCreateGame = async () => {
    const result = await createGame("");

    if (result && result.room && result.room.roomCode) {
      history.push(`/room/${result.room.roomCode}`);
    }
  };

  return (
    <Layout title="Welcome" hideQuit={true}>
      <VStack mt="10">
        <Box fontSize="2xl" fontWeight="bold" marginBottom="4">
          Disruptors of Silitan Valley
        </Box>

        <Link to="/join">
          <Button size="lg">Join game</Button>
        </Link>

        <Button size="lg" onClick={onCreateGame}>
          Create game
        </Button>
      </VStack>
    </Layout>
  );
};

export default HomePage;
