import { useState } from "react";
import { Card, Flex, Heading, Box, Text, Tooltip, Loader } from "rimble-ui";
import { Button } from "../../../../Components";
import ChoiceModal from "./ChoiceModal";
import VoterModal from "./VoterModal";

const Owner = ({
  data: { pollState, totalVoters, choices },
  functions: { addChoices, addVoters, startVote, startReveal, endVote }
}) => {
  const [loading, setLoading] = useState(false);

  const canStartVoting = choices.value.length > 1 && totalVoters.value > 0;
  const isNewPoll = pollState.value === "0";
  const isCommitPhase = pollState.value === "1";
  const isRevealPhase = pollState.value === "2";
  const isPollEnd = pollState.value === "3";

  const handleSubmit = mutation => async () => {
    setLoading(true);
    mutation()
      .catch(err => {
        console.log("Something went wrong!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card marginBottom={"20px"}>
      <Text mb={2} fontWeight="bold" fontSize="small">
        Admin Tools
      </Text>
      {isNewPoll ? (
        <Flex flexWrap={"wrap"}>
          <VoterModal addVoters={addVoters} disabled={loading} />
          <ChoiceModal addChoices={addChoices} disabled={loading} />
          {canStartVoting ? (
            <Button
              disabled={loading}
              loading={loading}
              onClick={handleSubmit(startVote)}
              width={"100%"}
              m={"5px"}
            >
              Start the vote! 🚀
            </Button>
          ) : (
            <Tooltip message="Can't start the voting stage before adding at least two choices and one voter">
              <Box width={"100%"} m={"5px"}>
                <Button disabled width={"100%"}>
                  Start the vote! 🚀
                </Button>
              </Box>
            </Tooltip>
          )}
        </Flex>
      ) : isCommitPhase ? (
        <Button
          disabled={loading}
          loading={loading}
          onClick={handleSubmit(startReveal)}
          width={"100%"}
        >
          Begin revealing votes! 🌕
        </Button>
      ) : isRevealPhase ? ( // poll revealing
        <Button
          disabled={loading}
          loading={loading}
          onClick={handleSubmit(endVote)}
          width={"100%"}
        >
          End the poll! 💥
        </Button>
      ) : (
        isPollEnd && (
          <Heading
            mb={0}
            style={{
              textDecoration: "underline",
              textDecorationColor: "#4E3FCE"
            }}
          >
            The poll has ended! Thank you! 🥳
          </Heading>
        )
      )}
    </Card>
  );
};

export default Owner;
