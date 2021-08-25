import { React, useState, useEffect, useRef } from "react";
import { Box, Heading, Flex, Field, Input, Loader } from "rimble-ui";
import { Button, Modal } from "../../Components";
import Poll from "../../artifacts/Poll.json";
import { POLL_EVENTS } from "../../config";
import { useHistory } from "react-router-dom";

const PollFactory = ({ drizzleState, drizzle, initialized }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const getPolls = async () => {
      // Fetch asynchronously all children of PollFactory using web3 method and add them to drizzle store
      const polls = await drizzle.contracts.PollFactory.methods
        .getPolls()
        .call();

      polls &&
        polls.forEach(async pollAddress => {
          pollAddress = pollAddress.toLowerCase();
          if (!Object.keys(drizzleState.contracts).includes(pollAddress)) {
            const web3Contract = new drizzle.web3.eth.Contract(
              Poll.abi,
              pollAddress
            );
            await drizzle.addContract(
              { contractName: pollAddress, web3Contract },
              POLL_EVENTS
            );
          }
        });
    };
    getPolls();
  }, []);

  const createPoll = async () => {
    setLoading(true);
    try {
      const response = await drizzle.contracts.PollFactory.methods
        .createNewPoll(name)
        .send({
          from: drizzleState.activeAccount.account
        });
      let pollAddress = response.events.deployedContract.returnValues[0];
      pollAddress = pollAddress.toLowerCase();
      const web3Contract = new drizzle.web3.eth.Contract(Poll.abi, pollAddress);
      await drizzle.addContract(
        { contractName: pollAddress, web3Contract },
        POLL_EVENTS
      );
      history.push(`/poll/${pollAddress}`);
    } catch {
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      showClose={!loading}
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
        <Button
          loading={loading}
          loadingLabel="Creating poll"
          width={"100%"}
          disabled={!name || loading}
          onClick={createPoll}
        >
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default PollFactory;
