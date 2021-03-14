import { React, useEffect } from "react";
import { Button, Box, Heading, Text } from "rimble-ui";
import { Switch, Route } from "react-router-dom";
import { setActiveAccount } from "./Actions/activeAccount";
import Modal from "./Components/Modal/Modal";
import Navigation from "./Containers/Navigation/Navigation";
import Dashboard from "./Containers/Dashboard/Dashboard";
import { POLL_EVENTS } from "./config";
import Poll from "./Containers/Poll/Poll";

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

  return (
    <>
      <Navigation />

      <Switch>
        <Route
          path="/poll/:pollAddress"
          render={props => (
            <Poll
              {...props}
              drizzle={drizzle}
              drizzleState={drizzleState}
              initialized={initialized}
            />
          )}
        />
        <Route path="/" component={Dashboard} exact />
      </Switch>
    </>
  );
};

export default App;
