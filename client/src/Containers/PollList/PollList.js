import { React, useState } from "react";
import { Card, Input } from "rimble-ui";
import { PollCard } from "..";
import { LoaderOverlay } from "../../Components";

const PollList = ({ drizzleState, drizzle, initialized }) => {
  const [searchTerm, setSearchTerm] = useState("");
  if (!initialized) return <LoaderOverlay />;
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
        type="search"
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
