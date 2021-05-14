import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Layout from "../components/Layout";
import { useSessionState } from "../hooks/session";

const HomePage = ({}) => {
  const history = useHistory();
  const sessionState = useSessionState();

  useEffect(() => {
    if (sessionState.room && sessionState.room.roomCode.length === 4) {
      history.push(`/room/${sessionState.room.roomCode}`);
    }
  }, [sessionState.room]);

  return (
    <Layout title="Welcome">
      <Center mt="8">
        <Link to="/join">
          <Button>Join a game</Button>
        </Link>

        <Link to="/create">
          <Button>Create a game</Button>
        </Link>
      </Center>
    </Layout>
  );
};

export default HomePage;
