import { useEffect, useState } from "react";
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
import { Owner, Info, Voter } from "./PollBoards";

const Poll = ({ drizzleState, drizzle, poll }) => {
  const contract = drizzle.contracts[poll];
  const contractState = drizzleState.contracts[poll];
  const [keys, setKeys] = useState({
    pollDetailsKey: null,
    pollOwnerKey: null,
    pollStateKey: null,
    totalVotersKey: null,
    totalVotesKey: null,
    choicesKey: null
  });

  useEffect(() => {
    const readPoll = async () => {
      const pollDetailsKey = contract.methods["pollDetails"].cacheCall();
      const pollOwnerKey = contract.methods["pollOwner"].cacheCall();
      const pollStateKey = contract.methods["pollState"].cacheCall();
      const totalVotersKey = contract.methods["totalVoters"].cacheCall();
      const totalVotesKey = contract.methods["totalVotes"].cacheCall();
      const choicesKey = await contract.methods["getChoices"].cacheCall();
      setKeys({
        pollDetailsKey,
        pollOwnerKey,
        pollStateKey,
        totalVotersKey,
        totalVotesKey,
        choicesKey
      });
    };
    readPoll();
  }, []);

  const pollDetails = contractState.pollDetails[keys.pollDetailsKey];
  const pollOwner = contractState.pollOwner[keys.pollOwnerKey];
  const pollState = contractState.pollState[keys.pollStateKey];
  const totalVoters = contractState.pollState[keys.totalVotersKey];
  const totalVotes = contractState.pollState[keys.totalVotesKey];
  const choices = contractState.pollState[keys.choicesKey];
  console.log(choices);
  return pollDetails &&
    pollOwner &&
    pollState &&
    totalVoters &&
    totalVotes &&
    choices ? (
    <>
      <Info />
      <Owner />
      <Voter />
    </>
  ) : (
    <div>Loading poll info...</div>
  );
};

export default Poll;
