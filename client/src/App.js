import { React, useEffect } from "react";
import { Button, Box, Heading, Text } from "rimble-ui";
import { setActiveAccount } from "./Actions/activeAccount";
import Modal from "./Components/Modal/Modal";
import Navigation from "./Containers/Navigation/Navigation";

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
      <Navigation />
      <div>{drizzleState.activeAccount.account}</div>
      <div>{drizzleState.web3.networkId}</div>
      <Modal trigger={<Button>Connect wallet</Button>}>
        <Box p={4} mb={3}>
          <Heading.h3>Confirm Action</Heading.h3>
          <Text>Are you sure you want to action?</Text>
        </Box>
      </Modal>
    </>
  );
};

export default App;
