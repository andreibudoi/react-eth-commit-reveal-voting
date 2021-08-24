import { useEffect, useState, useCallback } from "react";
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
  const addChoices = async choices => {
    try {
      await contract.methods.addChoices(choices).send({
        from: drizzleState.activeAccount.account
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const addVoters = async voters => {
    // we need to format out array so that solidity can read it
    // format is [["address", "name"], [...], ...]
    try {
      const formattedVoters = voters.map(voter => [voter.address, voter.name]);
      await contract.methods.addVoters(formattedVoters).send({
        from: drizzleState.activeAccount.account
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const startVote = async () => {
    try {
      await contract.methods.startVote().send({
        from: drizzleState.activeAccount.account
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const startReveal = async () => {
    try {
      await contract.methods.startReveal().send({
        from: drizzleState.activeAccount.account
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const endVote = async () => {
    try {
      await contract.methods.endVote().send({
        from: drizzleState.activeAccount.account
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Voter fns
  const commitVote = async (choiceIdx, password) => {
    try {
      const vote = Web3.utils.keccak256(choiceIdx + "-" + password);
      const voteResponse = await contract.methods.commitVote(vote).send({
        from: drizzleState.activeAccount.account
      });
      return Promise.resolve(voteResponse);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const revealVote = async (choiceIdx, password) => {
    try {
      const voteResponse = await contract.methods
        .revealVote(choiceIdx, choiceIdx + "-" + password)
        .send({
          from: drizzleState.activeAccount.account
        });
      console.log(voteResponse);
      return Promise.resolve(voteResponse);
    } catch (error) {
      return Promise.reject(error);
    }
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
          poll,
          pollDetails,
          pollOwner,
          pollState,
          totalVoters,
          totalVotes,
          choices
        }}
        user={drizzleState.activeAccount.account}
      />
      {pollOwner.value.toLowerCase() ===
        drizzleState.activeAccount.account.toLowerCase() && (
        <Owner
          data={{ pollOwner, pollState, totalVoters, choices }}
          functions={{ addChoices, addVoters, startVote, startReveal, endVote }}
          user={drizzleState.activeAccount.account}
        />
      )}
      {voter.value.name && (
        <Voter
          data={{ pollOwner, pollState, choices, voter, pollDetails }}
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
