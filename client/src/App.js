import { React, useEffect } from "react";
import { Button, Box, Heading, Text } from "rimble-ui";
import { Switch, Route } from "react-router-dom";
import { setActiveAccount } from "./Actions/activeAccount";
import Modal from "./Components/Modal/Modal";
import Navigation from "./Containers/Navigation/Navigation";
import Dashboard from "./Containers/Dashboard/Dashboard";
import { POLL_EVENTS } from "./config";
import Poll from "./artifacts/Poll.json";

const App = ({ drizzle, drizzleState, initialized }) => {
  console.log("drizzle: ", drizzle);
  console.log("drizzleState: ", drizzleState);

  // We need to handle account or chain changes using Drizzle store
  useEffect(() => {
    drizzle.store.dispatch(setActiveAccount(drizzleState.accounts[0]));
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts) {
        drizzle.store.dispatch(setActiveAccount(accounts[0]));
      });
      window.ethereum.on("chainChanged", () => {
        document.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    const getPolls = async () => {
      // Fetch asynchronously all children of PollFactory using web3 method and add them to drizzle store
      const polls = await drizzle.contracts.PollFactory.methods
        .getPolls()
        .call();
      console.log(polls);
      polls &&
        polls.forEach(async pollAddress => {
          if (!Object.keys(drizzleState.contracts).includes(pollAddress)) {
            const web3Contract = new drizzle.web3.eth.Contract(
              Poll.abi,
              pollAddress
            );
            await drizzle.addContract(
              { contractName: pollAddress, web3Contract },
              POLL_EVENTS
            );
          }
        });
    };
    getPolls();
  }, []);

  return (
    <>
      <Navigation />

      <Switch>
        <Route path="/" component={Dashboard} />
      </Switch>
    </>
  );
};

export default App;
