import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import React from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const GamePage = ({}) => {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <Layout title="Game">
      <Center mt="8">{gameId}</Center>
    </Layout>
  );
};

export default GamePage;
