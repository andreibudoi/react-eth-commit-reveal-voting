import React from "react";
import { Card } from "rimble-ui";
import PollCard from "../PollCard/PollCard";

const PollList = ({ drizzleState, drizzle, initialized }) => {
  if (!initialized) return null;
  const pollList = Object.keys(drizzle.contracts)
    .filter(contractName => contractName !== "PollFactory")
    .reverse();
  console.log(pollList);

  return (
    <>
      {pollList.map(pollName => (
        <PollCard
          pollName={pollName}
          drizzle={drizzle}
          drizzleState={drizzleState}
          initialized={initialized}
          key={pollName}
        />
      ))}
    </>
  );
};

export default PollList;
