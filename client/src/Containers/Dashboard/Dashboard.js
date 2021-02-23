import React from "react";
import PageContainer from "../PageContainer/PageContainer";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Button, Box, Heading, Text } from "rimble-ui";
import Modal from "../../Components/Modal/Modal";
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
           
            <Modal trigger={<Button>Connect wallet</Button>}>
              <Box p={4} mb={3}>
                <Heading.h3>Confirm Action</Heading.h3>
                <Text>Are you sure you want to action?</Text>
              </Box>
            </Modal>
          </PageContainer>
        );
      }}
    </DrizzleContext.Consumer>
  );
};

export default Dashboard;
