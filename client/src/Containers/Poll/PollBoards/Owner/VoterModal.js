import { useState } from "react";
import {
  Card,
  Flex,
  Heading,
  Pill,
  Field,
  Box,
  Input,
  Button,
  Loader
} from "rimble-ui";
import { Modal } from "../../../../Components";

const VoterModal = ({ addVoters, disabled }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleAddVoters = async closeModal => {
    setLoading(true);
    addVoters(voters)
      .then(() => closeModal())
      .catch(err => {})
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setVoters([]);
  };

  return (
    <Modal
      showClose={!loading}
      onCloseTrigger={resetForm}
      modalWidth={["auto", "60%"]}
      trigger={
        <Button
          disabled={disabled}
          width={["calc(100% - 10px)", "calc(100%/2 - 10px)"]}
          m={"5px"}
        >
          Register voters 👤
        </Button>
      }
    >
      {closeModal => (
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
            disabled={!voters.length || loading}
            onClick={() => handleAddVoters(closeModal)}
          >
            {loading ? (
              <>
                Registering voters
                <Loader color="white" ml="1" />
              </>
            ) : (
              "Confirm whitelist"
            )}
          </Button>
        </Box>
      )}
    </Modal>
  );
};

export default VoterModal;
