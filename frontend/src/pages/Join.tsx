import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const HomePage = ({}) => {
  const history = useHistory();

  return (
    <Layout title="Welcome">
      <Center mt="8">
        <Button>Join a game</Button>

        <Link to="/create">
          <Button>Create a game</Button>
        </Link>
      </Center>
    </Layout>
  );
};

export default HomePage;
