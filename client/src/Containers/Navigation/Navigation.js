import React from "react";
import { Box, Card, Flex, Heading, EthAddress, MetaMaskButton } from "rimble-ui";
import { REQUIRED_NETWORK } from "../../config";
import { DrizzleContext } from "@drizzle/react-plugin";

const Navigation = () => {
  return (
    <DrizzleContext.Consumer>
      {drizzleContext => {
        const { drizzle, drizzleState, initialized } = drizzleContext;
        if (!initialized) {
          return null;
        }
        return (
          <Flex bg="primary" p={3} justifyContent="space-between" >
            <Heading as={"h2"} color={"white"} my={"auto"} >
              Eth Poll
            </Heading>
          </Flex>
        );
      }}
    </DrizzleContext.Consumer>
  );
};

export default Navigation;
