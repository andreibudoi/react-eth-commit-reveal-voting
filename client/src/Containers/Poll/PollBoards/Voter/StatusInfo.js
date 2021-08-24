import { Heading } from "rimble-ui";
import propTypes from "prop-types";

const statusCopy = {
  IS_REGISTERED:
    voterName => `Hello ${voterName}, you were selected to participate in this poll. Come back later to cast
  your vote! ⏰`,
  COMMIT_DONE:
    voterName => `Thanks for voting, ${voterName}! Don't forget to come back later to reveal
  your vote or it won't be counted towards your choice! 🔐`,
  REVEAL_NO_COMMIT: voterName =>
    `You didn't pick an option during the voting phase. 😥`,
  REVEAL_DONE: voterName =>
    `Your vote has been revealed and counted towards your choice. 📣`,
  POLL_END: voterName => `The poll has ended! Thank you for participating! 🥳`
};

const StatusInfo = ({ statusKey, voterName }) => {
  return (
    <Heading
      mb={0}
      style={{
        textDecoration: "underline",
        textDecorationColor: "#4E3FCE"
      }}
    >
      {statusCopy[statusKey](voterName)}
    </Heading>
  );
};

StatusInfo.propTypes = {
  statusKey: propTypes.oneOf([
    "IS_REGISTERED",
    "COMMIT_DONE",
    "REVEAL_NO_COMMIT",
    "REVEAL_DONE"
  ]).isRequired,
  voterName: propTypes.string
};

StatusInfo.defaultProps = {
  voterName: ""
};

export default StatusInfo;
