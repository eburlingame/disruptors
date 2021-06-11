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
        height="84px"
        width="58px"
        rounded="md"
        borderWidth="0.5px"
        borderStyle="solid"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        paddingY="2"
      >
        <Box
          fontSize="xl"
          minW="40px"
          minH="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
        <Box fontWeight="900" fontSize="xl" marginTop="1">
          {count}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default CardCount;
