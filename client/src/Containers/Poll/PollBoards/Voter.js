import { useState } from "react";
import {
  Card,
  Flex,
  Heading,
  Pill,
  Radio,
  Field,
  Box,
  Text,
  Input,
  Button,
  Select
} from "rimble-ui";
import { Modal } from "../../../Components";
import validator from "validator";

const Voter = ({
  data: { pollOwner, pollState, choices, voter },
  functions: { commitVote, revealVote },
  user
}) => {
  const [optionIndex, setOptionIndex] = useState(null);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const isPasswordValid = pass =>
    setIsValid(
      validator.isStrongPassword(pass, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
    );

  return (
    <Card marginBottom={"20px"}>
      <Text mb={2} fontWeight="bold" fontSize="small">
        Voter panel
      </Text>
      {pollState.value === "0" ? ( // new poll
        <Heading
          mb={0}
          style={{
            textDecoration: "underline",
            textDecorationColor: "#4E3FCE"
          }}
        >
          {`Hello ${voter.value.name}, you were selected to participate in this poll. Come back later to cast
          your vote! ⏰`}
        </Heading>
      ) : pollState.value === "1" ? ( // poll in voting
        voter.value.voterState === "0" ? (
          <Box>
            <Heading.h3
              mb={3}
              style={{
                textDecoration: "underline",
                textDecorationColor: "#4E3FCE"
              }}
            >
              Enter a strong password, then pick your choice
            </Heading.h3>
            <Field width={"100%"} label="Password" mb={1}>
              <Input
                width={"100%"}
                type="password"
                required={true}
                value={password}
                onChange={event => setPassword(event.target.value)}
                onBlur={event => {
                  isPasswordValid(event.target.value);
                  repeatPassword &&
                    setPasswordsMatch(event.target.value === repeatPassword);
                }}
              />
            </Field>
            {!isValid && (
              <Text fontWeight="bold" fontSize="small" color={"danger"}>
                Your password must have at least eight characters, one
                lowercase, one uppercase, one number and one symbol
              </Text>
            )}
            <Field width={"100%"} label="Repeat password" mt={3} mb={1}>
              <Input
                width={"100%"}
                type="password"
                required={true}
                value={repeatPassword}
                onChange={event => setRepeatPassword(event.target.value)}
                onBlur={event =>
                  setPasswordsMatch(event.target.value === password)
                }
              />
            </Field>
            {!passwordsMatch && (
              <Text fontWeight="bold" fontSize="small" color={"danger"}>
                Passwords do not match
              </Text>
            )}
            <Field width={"100%"} label="Choose your option" mt={3}>
              <Select
                width={"100%"}
                onChange={event => {
                  setOptionIndex(event.target.value);
                }}
                required={true}
                options={[
                  { label: "Pick an option", value: null },
                  ...choices.value.map((choice, idx) => ({
                    label: choice.name,
                    value: idx
                  }))
                ]}
              />
            </Field>

            <Button
              onClick={() => {
                commitVote(optionIndex, password);
                setPassword("");
                setRepeatPassword("");
                setIsValid(true);
                setPasswordsMatch(true);
                setOptionIndex(null);
              }}
              width={"100%"}
              disabled={
                !password ||
                !passwordsMatch ||
                !isValid ||
                !optionIndex ||
                !repeatPassword
              }
            >
              Cast your vote 📥
            </Button>
          </Box>
        ) : (
          <Heading
            mb={0}
            style={{
              textDecoration: "underline",
              textDecorationColor: "#4E3FCE"
            }}
          >
            {`Thanks for voting ${voter.value.name}. Don't forget to come back later to reveal
          your vote or it won't be counted towards your choice! 🔐`}
          </Heading>
        )
      ) : pollState.value === "2" ? ( // poll revealing
        voter.value.voterState === "1" ? (
          <Box>
            <Heading.h3
              mb={3}
              style={{
                textDecoration: "underline",
                textDecorationColor: "#4E3FCE"
              }}
            >
              Enter the password used last time, confirm it, then pick again
              your choice to reveal your vote.
            </Heading.h3>
            <Field width={"100%"} label="Reenter password" mb={1}>
              <Input
                width={"100%"}
                type="password"
                required={true}
                value={password}
                onChange={event => setPassword(event.target.value)}
                onBlur={event => {
                  isPasswordValid(event.target.value);
                  repeatPassword &&
                    setPasswordsMatch(event.target.value === repeatPassword);
                }}
              />
            </Field>
            {!isValid && (
              <Text fontWeight="bold" fontSize="small" color={"danger"}>
                Your password must have at least eight characters, one
                lowercase, one uppercase, one number and one symbol
              </Text>
            )}
            <Field width={"100%"} label="Confirm your password" mt={3} mb={1}>
              <Input
                width={"100%"}
                type="password"
                required={true}
                value={repeatPassword}
                onChange={event => setRepeatPassword(event.target.value)}
                onBlur={event =>
                  setPasswordsMatch(event.target.value === password)
                }
              />
            </Field>
            {!passwordsMatch && (
              <Text fontWeight="bold" fontSize="small" color={"danger"}>
                Passwords do not match
              </Text>
            )}
            <Field width={"100%"} label="Choose your option" mt={3}>
              <Select
                width={"100%"}
                onChange={event => {
                  setOptionIndex(event.target.value);
                }}
                required={true}
                options={[
                  { label: "Pick an option", value: null },
                  ...choices.value.map((choice, idx) => ({
                    label: choice.name,
                    value: idx
                  }))
                ]}
              />
            </Field>

            <Button
              onClick={() => {
                revealVote(optionIndex, password);
                setPassword("");
                setRepeatPassword("");
                setIsValid(true);
                setPasswordsMatch(true);
                setOptionIndex(null);
              }}
              width={"100%"}
              disabled={
                !password ||
                !passwordsMatch ||
                !isValid ||
                !optionIndex ||
                !repeatPassword
              }
            >
              Reveal your vote 🔑
            </Button>
          </Box>
        ) : voter.value.voterState === "2" ? (
          <Heading
            mb={0}
            style={{
              textDecoration: "underline",
              textDecorationColor: "#4E3FCE"
            }}
          >
            Your vote has been revealed and counted towards your choice. 📣
          </Heading>
        ) : (
          <Heading
            mb={0}
            style={{
              textDecoration: "underline",
              textDecorationColor: "#4E3FCE"
            }}
          >
            You didn't pick an option during the voting phase. 😥
          </Heading>
        )
      ) : (
        pollState.value === "3" && ( // poll end
          <Heading
            mb={0}
            style={{
              textDecoration: "underline",
              textDecorationColor: "#4E3FCE"
            }}
          >
            The poll has ended! Thank you for participating! 🥳
          </Heading>
        )
      )}
    </Card>
  );
};

export default Voter;
