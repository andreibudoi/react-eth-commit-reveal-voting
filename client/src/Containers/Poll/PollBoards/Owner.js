import { useState } from "react";
import {
  Card,
  Flex,
  Heading,
  Pill,
  Field,
  Box,
  Text,
  Input,
  Button
} from "rimble-ui";
import { Modal } from "../../../Components";

const Owner = ({
  data: { pollOwner, pollState },
  functions: { addChoices, addVoters, startVote, startReveal, endVote },
  user
}) => {
  const VoterModal = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [voters, setVoters] = useState([]);

    const addVoter = () => {
      setVoters([...voters, { name, address }]);
      setName("");
      setAddress("");
    };

    const deleteVoter = index => {
      const newVoters = [...voters];
      newVoters.splice(index, 1);
      setVoters(newVoters);
    };

    return (
      <Box p={4}>
        <Heading.h3 mt={0}>Add voters</Heading.h3>
        <Card>
          <Field width={"100%"} label="Name">
            <Input
              width={"100%"}
              type="text"
              required={true}
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </Field>
          <Field width={"100%"} label="Wallet address">
            <Input
              width={"100%"}
              type="text"
              required={true}
              value={address}
              onChange={event => setAddress(event.target.value)}
            />
          </Field>
          <Button
            width={"100%"}
            disabled={!name || !address}
            onClick={addVoter}
          >
            Add to whitelist
          </Button>
        </Card>
        <Flex pt={3} pb={3} flexWrap={"wrap"}>
          {voters.map((voter, idx) => (
            <Pill
              key={`${idx}-${voter.address}`}
              color="primary"
              pr={"2px"}
              p={0}
              mr={2}
              mb={2}
            >
              {voter.name}
              <Button.Text
                icononly
                icon={"Close"}
                size={"small"}
                mr={2}
                onClick={() => deleteVoter(idx)}
              />
            </Pill>
          ))}
        </Flex>
        <Button
          width={"100%"}
          disabled={!voters.length}
          onClick={() => addVoters(voters)}
        >
          Confirm whitelist
        </Button>
      </Box>
    );
  };

  const ChoiceModal = () => {
    const [choice, setChoice] = useState("");
    const [choices, setChoices] = useState([]);

    const addChoice = () => {
      setChoices([...choices, choice]);
      setChoice("");
    };

    const deleteChoice = index => {
      const newChoices = [...choices];
      newChoices.splice(index, 1);
      setChoices(newChoices);
    };

    return(<Box p={4}>
      <Heading.h3 mt={0}>Add choices</Heading.h3>
      <Card>
        <Field width={"100%"} label="Poll option">
          <Input
            width={"100%"}
            type="text"
            required={true}
            value={choice}
            onChange={event => setChoice(event.target.value)}
          />
        </Field>
        
        <Button
          width={"100%"}
          disabled={!choice}
          onClick={addChoice}
        >
          +
        </Button>
      </Card>
      <Flex pt={3} pb={3} flexWrap={"wrap"}>
        {choices.map((choice, idx) => (
          <Pill
            key={`${idx}-${choice}`}
            color="primary"
            pr={"2px"}
            p={0}
            mr={2}
            mb={2}
          >
            {choice}
            <Button.Text
              icononly
              icon={"Close"}
              size={"small"}
              mr={2}
              onClick={() => deleteChoice(idx)}
            />
          </Pill>
        ))}
      </Flex>
      <Button
        width={"100%"}
        disabled={!choices.length}
        onClick={() => addChoices(choices)}
      >
        Confirm choice list
      </Button>
    </Box>);

  };

  return (
    <Card marginBottom={"20px"}>
      <Text mb={2} fontWeight="bold" fontSize="small">
        Admin Tools
      </Text>
      {pollState.value === "0" ? ( // new poll
        <Flex flexWrap={"wrap"}>
          <Modal
            modalWidth={["auto", "60%"]}
            trigger={
              <Button
                width={["calc(100% - 10px)", "calc(100%/2 - 10px)"]}
                m={"5px"}
              >
                Register voters 👤
              </Button>
            }
          >
            <VoterModal />
          </Modal>

          <Modal
            modalWidth={["auto", "60%"]}
            trigger={
              <Button
                width={["calc(100% - 10px)", "calc(100%/2 - 10px)"]}
                m={"5px"}
              >
                Add choices ✔
              </Button>
            }
          >
            <ChoiceModal />
          </Modal>

          <Button onClick={startVote} width={"100%"} m={"5px"}>
            Start the vote! 🚀
          </Button>
        </Flex>
      ) : pollState.value === "1" ? ( // poll in voting
        <Button onClick={startReveal} width={"100%"}>
          Begin revealing votes! 🌕
        </Button>
      ) : pollState.value === "2" ? ( // poll revealing
        <Button onClick={endVote} width={"100%"}>
          End the poll! 💥
        </Button>
      ) : (
        pollState.value === "3" && ( // poll end
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
