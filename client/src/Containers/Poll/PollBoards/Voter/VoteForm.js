import { useEffect, useState } from "react";
import {
  Heading,
  Box,
  Input,
  Field,
  Text,
  Select,
  Card,
  Flex,
  Flash
} from "rimble-ui";
import validator from "validator";
import propTypes from "prop-types";
import { Button } from "../../../../Components";
import { generate } from "generate-password";
import { Visibility, VisibilityOff, Replay, FileDownload } from "@rimble/icons";
import fileDownload from "js-file-download";

const FILE_NAME = "poll_password.txt";

const VoteForm = ({ phase, choices, voteAction, onSuccess }) => {
  const [optionIndex, setOptionIndex] = useState(null);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false);
  const [isGeneratedPasswordUsed, setIsGeneratedPasswordUsed] = useState(false);

  const savePasswordFile = () => {
    var passwordBlob = new Blob([generatedPassword], {
      type: "text/plain;charset=utf-8"
    });
    fileDownload(passwordBlob, FILE_NAME);
  };

  const getNewStrongGeneratedPassword = () => {
    const newGeneratedPass = generate({
      length: 20,
      numbers: true,
      lowercase: true,
      uppercase: true,
      symbols: true,
      strict: true
    });
    setGeneratedPassword(newGeneratedPass);
  };

  useEffect(() => {
    if (phase === "COMMIT") {
      getNewStrongGeneratedPassword();
    }
  }, [phase]);

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

  const resetForm = () => {
    setPassword("");
    setRepeatPassword("");
    setIsValid(true);
    setPasswordsMatch(true);
    setOptionIndex(null);
    setGeneratedPassword("");
  };

  const lockGeneratedPassword = () => {
    setPassword(generatedPassword);
    setRepeatPassword(generatedPassword);
    setIsGeneratedPasswordUsed(true);
    savePasswordFile();
  };

  const handleVoteSubmit = async () => {
    setLoading(true);
    resetForm();

    voteAction(optionIndex, password)
      .then(res => onSuccess(res))
      .catch(err => {
        console.log("Something went wrong!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Box>
        <Heading.h3
          mb="2"
          style={{
            textDecoration: "underline",
            textDecorationColor: "#4E3FCE"
          }}
        >
          {phase === "COMMIT"
            ? `Enter a strong password, then pick your choice`
            : ` Enter the password used last time, confirm it, then pick again
              your choice to reveal your vote.`}
        </Heading.h3>
        {phase === "COMMIT" && !isGeneratedPasswordUsed && (
          <Card mb="4" mt="4" boxShadow="0">
            <Heading.h5 mb="2" mt="0">
              We recomend you to use the more secure generated password below!
              Make sure you don't lose it.
            </Heading.h5>
            <Flex mb="3">
              <Flex flexGrow="1">
                <Input
                  width={"100%"}
                  type={showGeneratedPassword ? "input" : "password"}
                  value={generatedPassword}
                />
              </Flex>
              <Button
                ml="2"
                icononly
                onClick={() => setShowGeneratedPassword(state => !state)}
              >
                {showGeneratedPassword ? <Visibility /> : <VisibilityOff />}
              </Button>
              <Button ml="2" icononly onClick={getNewStrongGeneratedPassword}>
                <Replay />
              </Button>
            </Flex>
            <Button
              width={"100%"}
              variant="success"
              onClick={lockGeneratedPassword}
            >
              <Flex alignItems={"center"}>
                <div>Use & save password</div>
                {<FileDownload />}
              </Flex>
            </Button>
          </Card>
        )}
        {isGeneratedPasswordUsed && (
          <Flash my={3} variant="success">
            Thank you for using a more secure password. Pick a choice and you'll
            be ready to commit your vote.
          </Flash>
        )}
        <Field width={"100%"} label="Password" mb={1}>
          <Input
            width={"100%"}
            type="password"
            required={true}
            disabled={isGeneratedPasswordUsed}
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
            Your password must have at least eight characters, one lowercase,
            one uppercase, one number and one symbol
          </Text>
        )}
        <Field width={"100%"} label="Repeat password" mt={3} mb={1}>
          <Input
            width={"100%"}
            type="password"
            required={true}
            disabled={isGeneratedPasswordUsed}
            value={repeatPassword}
            onChange={event => setRepeatPassword(event.target.value)}
            onBlur={event => setPasswordsMatch(event.target.value === password)}
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
          onClick={handleVoteSubmit}
          width={"100%"}
          loading={loading}
          loadingLabel={phase === "COMMIT" ? `Casting` : "Revealing"}
          disabled={
            !password ||
            !passwordsMatch ||
            !isValid ||
            !optionIndex ||
            !repeatPassword
          }
        >
          {phase === "COMMIT" ? `Cast your vote 📥` : "Reveal your vote 🔑"}
        </Button>
      </Box>
    </>
  );
};

VoteForm.propTypes = {
  phase: propTypes.oneOf(["COMMIT", "REVEAL"]).isRequired,
  voteAction: propTypes.func.isRequired,
  choices: propTypes.array.isRequired,
  onSuccess: propTypes.func
};

VoteForm.defaultProps = {
  onSuccess: () => {}
};

export default VoteForm;
