import { React, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { setActiveAccount } from "./Actions/activeAccount";
import { Dashboard, PollLoader, Navigation } from "./Containers";

const App = ({ drizzle, drizzleState, initialized }) => {
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
            <PollLoader
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
