import Web3 from "web3";
import PollFactory from "./artifacts/PollFactory.json";

const options = {
    web3: {
        block: false,
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:7545", //Ganache for testing
        },
    },
    contracts: [PollFactory],
    events: {
        PollFactory: ["deployedContract"],
    },
};

export default options;
