export const REQUIRED_NETWORK = 5777;
export const POLL_EVENTS = [
  "votersAdded",
  "choicesAdded",
  "votingStarted",
  "voteCommitted",
  "votesCanBeRevealed",
  "voteRevealed",
  "votingEnded"
];
export const POLL_STATES = [
  { name: "Newly created", color: "primary" },
  { name: "In voting", color: "green" },
  { name: "Now revealing", color: "fuchsia" },
  { name: "Ended", color: "darkorange" }
];
