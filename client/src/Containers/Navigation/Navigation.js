import React from "react";
import { Box, Card, Flex, Heading, Text, Pill, Tooltip } from "rimble-ui";
import { REQUIRED_NETWORK } from "../../config";
import { DrizzleContext } from "@drizzle/react-plugin";
import { useHistory } from "react-router-dom";

const Navigation = () => {
  const history = useHistory();

  return (
    <DrizzleContext.Consumer>
      {drizzleContext => {
        const { drizzle, drizzleState, initialized } = drizzleContext;
        if (!initialized) {
          return null;
        }
        return (
          <Flex
            bg="primary"
            p={3}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Heading
              as={"h2"}
              color={"white"}
              my={"auto"}
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/")}
            >
              Eth Poll
            </Heading>
            <Tooltip message={drizzleState.activeAccount?.account}>
              <Pill color="primary">
                <Text fontWeight="bold">
                  {drizzleState.activeAccount?.account?.slice(0, 6) +
                    "..." +
                    drizzleState.activeAccount?.account?.slice(-4)}
                </Text>
              </Pill>
            </Tooltip>
          </Flex>
        );
      }}
    </DrizzleContext.Consumer>
  );
};

export default Navigation;
