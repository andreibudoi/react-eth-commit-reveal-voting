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

const ChoiceModal = ({ addChoices, disabled }) => {
  const [choice, setChoice] = useState("");
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const addChoice = () => {
    setChoices([...choices, choice]);
    setChoice("");
  };

  const deleteChoice = index => {
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };

  const handleAddChoices = async closeModal => {
    setLoading(true);
    addChoices(choices)
      .then(() => closeModal())
      .catch(err => {})
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setChoice("");
    setChoices([]);
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
          Add choices ✔
        </Button>
      }
    >
      {closeModal => (
        <Box p={4}>
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

            <Button width={"100%"} disabled={!choice} onClick={addChoice}>
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
            disabled={!choices.length || loading}
            onClick={() => handleAddChoices(closeModal)}
          >
            {loading ? (
              <>
                Adding choices
                <Loader color="white" ml="1" />
              </>
            ) : (
              "Confirm choice list"
            )}
          </Button>
        </Box>
      )}
    </Modal>
  );
};

export default ChoiceModal;
