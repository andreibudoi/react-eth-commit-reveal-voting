import { React, useState, useEffect } from "react";
import {
  Button,
  Box,
  Heading,
  Flex,
  Card,
  Text,
  Field,
  Input
} from "rimble-ui";
import Modal from "../../Components/Modal/Modal";
import Poll from "../../artifacts/Poll.json";
import { POLL_EVENTS } from "../../config";

const PollFactory = ({ drizzleState, drizzle, initialized }) => {
  const [name, setName] = useState("");

  const createPoll = async () => {
    const response = await drizzle.contracts.PollFactory.methods
      .createNewPoll(name)
      .send();
    const pollAddress = response.events.deployedContract.returnValues[0];
    console.log(pollAddress);
    const web3Contract = new drizzle.web3.eth.Contract(Poll.abi, pollAddress);
    await drizzle.addContract(
      { contractName: pollAddress, web3Contract },
      POLL_EVENTS
    );
  };

  return (
    <Modal
      trigger={
        <Flex my={"20px"}>
          <Button width={"100%"}>Create a new Poll! 📮</Button>
        </Flex>
      }
    >
      <Box p={4} mb={3}>
        <Heading.h3>Create your own Poll</Heading.h3>
        <Field width={"100%"} label="Details">
          <Input
            width={"100%"}
            type="text"
            required={true}
            placeholder="Who is taking the trash today?"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </Field>
        <Button width={"100%"} disabled={!name} onClick={createPoll}>
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default PollFactory;
