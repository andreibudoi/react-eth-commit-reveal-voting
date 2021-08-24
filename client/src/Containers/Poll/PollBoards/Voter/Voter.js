import { useState } from "react";
import { Card, Text } from "rimble-ui";
import StatusInfo from "./StatusInfo";
import TransactionLinkCard from "./TransactionLinkCard";
import VoteForm from "./VoteForm";

const Voter = ({
  data: { pollState, choices, voter },
  functions: { commitVote, revealVote }
}) => {
  const [txHash, setTxHash] = useState(null);

  const isNewPoll = pollState.value === "0";
  const isCommitPhase = pollState.value === "1";
  const doesUserNeedToCommit = voter.value.voterState === "0";
  const isRevealPhase = pollState.value === "2";
  const doesUserNeedToReveal = voter.value.voterState === "1";
  const userFinishedTasks = voter.value.voterState === "2";
  const isPollEnd = pollState.value === "3";

  const handleTransactionSuccess = res => {
    setTxHash(res.transactionHash);
  };

  return (
    <>
      <Card mb={"20px"}>
        <Text mb={2} fontWeight="bold" fontSize="small">
          Voter panel
        </Text>
        {isNewPoll ? (
          <StatusInfo statusKey="IS_REGISTERED" voterName={voter.value.name} />
        ) : isCommitPhase ? (
          doesUserNeedToCommit ? (
            <VoteForm
              phase="COMMIT"
              voteAction={commitVote}
              choices={choices}
              onSuccess={handleTransactionSuccess}
            />
          ) : (
            <StatusInfo statusKey="COMMIT_DONE" voterName={voter.value.name} />
          )
        ) : isRevealPhase ? (
          doesUserNeedToReveal ? (
            <VoteForm
              phase="REVEAL"
              voteAction={revealVote}
              choices={choices}
              onSuccess={handleTransactionSuccess}
            />
          ) : userFinishedTasks ? (
            <StatusInfo statusKey="REVEAL_DONE" voterName={voter.value.name} />
          ) : (
            <StatusInfo
              statusKey="REVEAL_NO_COMMIT"
              voterName={voter.value.name}
            />
          )
        ) : (
          isPollEnd && (
            <StatusInfo statusKey="POLL_END" voterName={voter.value.name} />
          )
        )}
      </Card>
      {txHash && <TransactionLinkCard txHash={txHash} />}
    </>
  );
};

export default Voter;
