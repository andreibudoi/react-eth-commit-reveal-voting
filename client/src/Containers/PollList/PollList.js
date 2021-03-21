import { React, useState } from "react";
import { Card, Input } from "rimble-ui";
import { PollCard } from "..";

const PollList = ({ drizzleState, drizzle, initialized }) => {
  const [searchTerm, setSearchTerm] = useState("");
  if (!initialized) return null;
  const pollList = Object.keys(drizzle.contracts)
    .filter(
      contractName =>
        contractName !== "PollFactory" &&
        contractName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    )
    .reverse();

  return (
    <>
      <Input
        width={"100%"}
        type="text"
        placeholder="Search by poll address"
        value={searchTerm}
        onChange={event => setSearchTerm(event.target.value)}
        marginBottom={"20px"}
      />
      {pollList.map(pollAddress => (
        <PollCard
          pollAddress={pollAddress}
          drizzle={drizzle}
          drizzleState={drizzleState}
          initialized={initialized}
          key={pollAddress}
        />
      ))}
    </>
  );
};

export default PollList;
