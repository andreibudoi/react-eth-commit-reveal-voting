import { React, useEffect, useState } from "react";
import { useParams } from "react-router";
import { POLL_EVENTS } from "../../config";
import Poll from "../../artifacts/Poll.json";
import PageContainer from "../PageContainer/PageContainer";
import { Card } from "rimble-ui";

const PollContainer = ({ drizzleState, drizzle, initialized }) => {
  let { pollAddress } = useParams();
  pollAddress = pollAddress.toLowerCase();
  const [poll, setPoll] = useState(null);

  const searchPoll = async () => {
    const polls = await drizzle.contracts.PollFactory.methods.getPolls().call();
    if (!polls.map(poll => poll.toLowerCase()).includes(pollAddress))
      return false; // Doesn't exist

    // Else add it to store if it's not there
    if (!Object.keys(drizzleState.contracts).includes(pollAddress)) {
      const web3Contract = new drizzle.web3.eth.Contract(Poll.abi, pollAddress);
      await drizzle.addContract(
        { contractName: pollAddress, web3Contract },
        POLL_EVENTS
      );
      return pollAddress;
    }
  };

  useEffect(() => {
    const getPoll = async () => {
      // Search address in our store to see if it's already there
      if (
        drizzle.contractList
          .map(contract => contract.address.toLowerCase())
          .includes(pollAddress)
      ) {
        setPoll(pollAddress);
      } else {
        // Fetch all polls and add new contract if needed
        setPoll(await searchPoll());
      }
    };
    getPoll();
  }, []);

  if (!initialized) return "Loading Drizzle";
  if (poll === null) return <Card>Loading poll...</Card>;
  if (poll === false) return <Card>Does not exist.</Card>;

  return (
    <PageContainer>
      <Card>{poll}</Card>
    </PageContainer>
  );
};

export default PollContainer;
