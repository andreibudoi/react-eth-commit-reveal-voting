import React from "react";
import PageContainer from "../PageContainer/PageContainer";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Button, Box, Heading, Text } from "rimble-ui";
import Modal from "../../Components/Modal/Modal";
import PollFactory from "../PollFactory/PollFactory";
import PollList from "../PollList/PollList";

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
            <Heading
              as={"h1"}
              margin={"10px 0px 10px"}
              fontWeight={"800"}
              color={"primary"}
            >
              Latest polls
            </Heading>
            <Heading
              as={"h4"}
              margin={0}
              color={"#808080"}
            >{`Polls available: ${drizzle.contractList.length}`}</Heading>
            <PollFactory
              drizzle={drizzle}
              drizzleState={drizzleState}
              initialized={initialized}
            />
            <PollList
              drizzle={drizzle}
              drizzleState={drizzleState}
              initialized={initialized}
            />
          </PageContainer>
        );
      }}
    </DrizzleContext.Consumer>
  );
};

export default Dashboard;
