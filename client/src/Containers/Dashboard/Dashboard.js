import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Heading } from "rimble-ui";
import { PollFactory, PollList, PageContainer } from "..";
import { LoaderOverlay } from "../../Components";

const Dashboard = () => {
  return (
    <DrizzleContext.Consumer>
      {drizzleContext => {
        const { drizzle, drizzleState, initialized } = drizzleContext;
        if (!initialized) {
          return <LoaderOverlay />;
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
            >{`Polls available: ${drizzle.contractList.length - 1}`}</Heading>
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
