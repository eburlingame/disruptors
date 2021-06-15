import React from "react";

import { VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import Layout from "../components/Layout";

export default ({}) => (
  <Layout title="">
    <VStack height="400px" justifyContent="center">
      <Spinner />
    </VStack>
  </Layout>
);
