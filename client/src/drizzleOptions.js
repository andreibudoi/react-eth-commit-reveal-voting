import Web3 from "web3";
import PollFactory from "./artifacts/PollFactory.json";

const options = {
    web3: {
        block: false,
        // customProvider: new Web3(Web3.givenProvider), //Metamask
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:7545", //Ganache for testing; could change this to Infura so users without Metamask may use the app 
        },
    },
    contracts: [PollFactory],
    events: {
        PollFactory: ["deployedContract"],
    },
};

export default options;
