import React from "react";
import { Box } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";

const CardCount = ({
  icon,
  label,
  count,
}: {
  icon: React.ReactElement;
  label: string;
  count: number;
}) => {
  return (
    <Tooltip label={label}>
      <Box
        height="90px"
        width="62px"
        rounded="md"
        borderWidth="0.5px"
        borderStyle="solid"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        paddingY="2"
      >
        <Box fontSize="xl">{icon}</Box>
        <Box fontWeight="900" fontSize="xl" marginTop="2">
          {count}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default CardCount;
