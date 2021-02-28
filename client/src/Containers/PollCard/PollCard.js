import { React, useState, useEffect } from "react";
import { Card, Flex, Heading, Pill } from "rimble-ui";

const POLL_STATES = ["Newly created", "In voting", "Now revealing", "Ended"];

const PollCard = ({ pollName, drizzleState, drizzle, initialized }) => {
  const contract = drizzle.contracts[pollName];
  const contractState = drizzleState.contracts[pollName];
  const [keys, setKeys] = useState({
    pollDetailsKey: null,
    pollOwnerKey: null,
    pollStateKey: null
  });

  useEffect(() => {
    const pollDetailsKey = contract.methods["pollDetails"].cacheCall();
    const pollOwnerKey = contract.methods["pollOwner"].cacheCall();
    const pollStateKey = contract.methods["pollState"].cacheCall();
    setKeys({ pollDetailsKey, pollOwnerKey, pollStateKey });
  }, []);

  const pollDetails = contractState.pollDetails[keys.pollDetailsKey];
  const pollOwner = contractState.pollOwner[keys.pollOwnerKey];
  const pollState = contractState.pollState[keys.pollStateKey];
  console.log(pollState);
  console.log(pollName, pollDetails);
  return (
    <Card marginBottom={"20px"}>
      {pollDetails && pollOwner && pollState ? (
        <Flex flexDirection={"column"}>
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            marginBottom={"20px"}
          >
            <Heading as={"h2"} margin={0}>
              {pollDetails.value}
            </Heading>
            <Pill color="primary">{POLL_STATES[pollState.value]}</Pill>
          </Flex>
        </Flex>
      ) : (
        <div>Loading poll info...</div>
      )}
    </Card>
  );
};

export default PollCard;
