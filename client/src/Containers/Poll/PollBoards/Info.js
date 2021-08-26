import React from "react";
import { Card, Flex, Heading, Pill, Text, Input } from "rimble-ui";
import { POLL_STATES } from "../../../config";

const Info = ({
  data: { pollDetails, pollOwner, pollState, totalVoters, totalVotes, choices }
}) => {
  const max = choices.value.reduce((acc, choice) => {
    const voteCount = parseInt(choice.voteCount);
    return voteCount > acc ? voteCount : acc;
  }, 0);
  const winners = choices.value.filter(
    choice => choice.voteCount === max.toString()
  );

  return (
    <Card marginBottom={"20px"}>
      <Flex flexDirection={"column"}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          marginBottom={"20px"}
        >
          <Heading as={"h2"} margin={0}>
            {pollDetails.value}
          </Heading>
          <Pill color={POLL_STATES[pollState.value].color} fontWeight="bold">
            {POLL_STATES[pollState.value].name}
          </Pill>
        </Flex>

        <Flex marginBottom={"20px"} flexDirection={"column"}>
          <Text fontSize={"1"}>Owner</Text>
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
              value={pollOwner.value}
              fontWeight={3}
              height={"2rem"}
              p={"5px"}
            />
          </Flex>
        </Flex>

        <Flex flexWrap={"wrap"}>
          <Flex
            alignItems={"center"}
            flexDirection={"column"}
            p={2}
            width={["calc(100% - 10px)", "calc(100%/3 - 10px)"]}
            m={"5px"}
            bg={"#4E3FCE33"}
            borderRadius={"4px"}
          >
            <Text color={"primary"} fontWeight={"bold"} fontSize={"larger"}>
              {totalVoters.value}
            </Text>
            <Text color={"primary"}>Voters registered</Text>
          </Flex>
          <Flex
            alignItems={"center"}
            flexDirection={"column"}
            p={2}
            width={["calc(100% - 10px)", "calc(100%/3 - 10px)"]}
            m={"5px"}
            bg={"#4E3FCE33"}
            borderRadius={"4px"}
          >
            <Text color={"primary"} fontWeight={"bold"} fontSize={"larger"}>
              {totalVotes.value}
            </Text>
            <Text color={"primary"}>Votes cast</Text>
          </Flex>
          <Flex
            alignItems={"center"}
            flexDirection={"column"}
            p={2}
            width={["calc(100% - 10px)", "calc(100%/3 - 10px)"]}
            m={"5px"}
            bg={"#4E3FCE33"}
            borderRadius={"4px"}
          >
            <Text color={"primary"} fontWeight={"bold"} fontSize={"larger"}>
              {choices && Array.isArray(choices.value)
                ? choices.value.length
                : 0}
            </Text>
            <Text color={"primary"}>Choices available</Text>
          </Flex>
        </Flex>
        {pollState.value === "3" && (
          <>
            <Flex justifyContent={"center"} alignItems={"center"} mt={4}>
              <Text mb={2} fontWeight="bold" fontSize="small">
                {`🏆 ${winners.length > 1 ? "Winners" : "Winner"} 🏆`}
              </Text>
            </Flex>
            <Flex flexWrap={"wrap"} justifyContent={"center"}>
              {winners.map(winner => (
                <Flex
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={["calc(100%)", "calc(100%/2)"]}
                  mb={3}
                >
                  <Heading
                    m={0}
                    fontWeight="bold"
                    style={{
                      textDecoration: "underline",
                      textDecorationColor: "#4E3FCE"
                    }}
                  >
                    {winner.name}
                  </Heading>
                  <Text
                    mt={2}
                    fontWeight="bold"
                    fontSize="small"
                    textAlign="center"
                  >
                    {`With ${winner.voteCount} votes out of ${
                      totalVotes.value
                    } (${((winner.voteCount / totalVotes.value) * 100).toFixed(
                      2
                    )}%)`}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </>
        )}
      </Flex>
    </Card>
  );
};

export default Info;
