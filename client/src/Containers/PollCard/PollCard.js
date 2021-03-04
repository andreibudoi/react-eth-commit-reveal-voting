import { React, useState, useEffect } from "react";
import {
  Card,
  Flex,
  Heading,
  Pill,
  Button,
  Field,
  Input,
  Box,
  Text
} from "rimble-ui";
import { Link, useHistory } from "react-router-dom";

const POLL_STATES = ["Newly created", "In voting", "Now revealing", "Ended"];
const POLL_COLORS = ["primary", "green", "blue", "yellow"]
const PollCard = ({ pollAddress, drizzleState, drizzle, initialized }) => {
  const history = useHistory();
  const contract = drizzle.contracts[pollAddress];
  const contractState = drizzleState.contracts[pollAddress];
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
            {/* need to map states to colors */}
            <Pill color={POLL_COLORS[pollState.value]} fontWeight="bold">
              {POLL_STATES[pollState.value]}
            </Pill>
          </Flex>

          <Flex flexDirection={"column"}>
            <Text fontSize={"1"}>Poll address</Text>
            <Flex
              flexDirection={"row"}
              alignItems={"center"}
              position={"relative"}
              width={"100%"}
            >
              <Input
                readOnly
                required
                width={"100%"}
                value={pollAddress}
                fontWeight={3}
                p={"auto"}
                pl={3}
                pr={"10rem"}
              />
              <Button
                size={"small"}
                position={"absolute"}
                right={0}
                mr={2}
                onClick={() => history.push(`/poll/${pollAddress}`)}
              >
                Check this poll out!
              </Button>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <div>Loading poll info...</div>
      )}
    </Card>
  );
};

export default PollCard;
