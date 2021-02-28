import React from "react";
import PageContainer from "../PageContainer/PageContainer";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Button, Box, Heading, Text } from "rimble-ui";
import Modal from "../../Components/Modal/Modal";
import PollFactory from "../PollFactory/PollFactory";

const Dashboard = () => {
  return (
    <DrizzleContext.Consumer>
      {drizzleContext => {
        const { drizzle, drizzleState, initialized } = drizzleContext;
        if (!initialized) {
          return null;
        }
        return (
          <PageContainer>
            <Text>{drizzleState.activeAccount.account}</Text>
            <Text>{drizzleState.web3.networkId}</Text>
            <PollFactory drizzle={drizzle} drizzleState={drizzleState} initialized={initialized} />
            
          </PageContainer>
        );
      }}
    </DrizzleContext.Consumer>
  );
};

export default Dashboard;
