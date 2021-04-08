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
import Web3 from "web3";

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
      const voterKey = await contract.methods["voters"].cacheCall(
        drizzleState.activeAccount.account
      );

      setKeys({
        pollDetailsKey,
        pollOwnerKey,
        pollStateKey,
        totalVotersKey,
        totalVotesKey,
        choicesKey,
        voterKey
      });
    };
    readPoll();
  }, []);

  useEffect(() => {
    const updateVoterKey = async () => {
      const voterKey = await contract.methods["voters"].cacheCall(
        drizzleState.activeAccount.account
      );
      setKeys(keys => ({ ...keys, voterKey }));
    };
    updateVoterKey();
  }, [contract, drizzleState, setKeys]);

  const pollDetails = contractState.pollDetails[keys.pollDetailsKey];
  const pollOwner = contractState.pollOwner[keys.pollOwnerKey];
  const pollState = contractState.pollState[keys.pollStateKey];
  const totalVoters = contractState.totalVoters[keys.totalVotersKey];
  const totalVotes = contractState.totalVotes[keys.totalVotesKey];
  const choices = contractState.getChoices[keys.choicesKey];
  const voter = contractState.voters[keys.voterKey];

  // Owner fns
  const addChoices = choices => {
    contract.methods["addChoices"].cacheSend(choices, {
      from: drizzleState.activeAccount.account
    });
  };

  const addVoters = voters => {
    // we need to format out array so that solidity can read it
    // format is [["address", "name"], [...], ...]
    const formattedVoters = voters.map(voter => [voter.address, voter.name]);
    contract.methods["addVoters"].cacheSend(formattedVoters, {
      from: drizzleState.activeAccount.account
    });
  };

  const startVote = () => {
    contract.methods["startVote"].cacheSend({
      from: drizzleState.activeAccount.account
    });
  };

  const startReveal = () => {
    contract.methods["startReveal"].cacheSend({
      from: drizzleState.activeAccount.account
    });
  };

  const endVote = () => {
    contract.methods["endVote"].cacheSend({
      from: drizzleState.activeAccount.account
    });
  };

  // Voter fns
  const commitVote = (choiceIdx, password) => {
    console.log(choiceIdx, password)
    const vote = Web3.utils.keccak256(choiceIdx + "-" + password);
    console.log(vote)
    contract.methods["commitVote"].cacheSend(vote, {
      from: drizzleState.activeAccount.account
    });
  };

  const revealVote = (choiceIdx, password) => {
    console.log(choiceIdx + "-" + password)
    contract.methods["revealVote"].cacheSend(choiceIdx, choiceIdx + "-" + password, {
      from: drizzleState.activeAccount.account
    });
  };

  return pollDetails &&
    pollOwner &&
    pollState &&
    totalVoters &&
    totalVotes &&
    choices &&
    voter ? (
    <>
      <Info
        data={{
          pollDetails,
          pollOwner,
          pollState,
          totalVoters,
          totalVotes,
          choices
        }}
        user={drizzleState.activeAccount.account}
      />
      {pollOwner.value.toLowerCase() === drizzleState.activeAccount.account.toLowerCase() && (
        <Owner
          data={{ pollOwner, pollState }}
          functions={{ addChoices, addVoters, startVote, startReveal, endVote }}
          user={drizzleState.activeAccount.account}
        />
      )}
      {voter.value.name && (
        <Voter
          data={{ pollOwner, pollState, choices, voter }}
          functions={{ commitVote, revealVote }}
          user={drizzleState.activeAccount.account}
        />
      )}
    </>
  ) : (
    <div>Loading poll info...</div>
  );
};

export default Poll;
