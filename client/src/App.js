import { React, useEffect } from "react";
import { setActiveAccount } from "./Actions/activeAccount";

const App = ({ drizzle, drizzleState }) => {
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
      <div>{drizzleState.activeAccount.account}</div>
      <div>{drizzleState.web3.networkId}</div>
    </>
  );
};

export default App;
