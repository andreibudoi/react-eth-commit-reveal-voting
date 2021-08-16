import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle, generateStore } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import appReducers from "./Reducers";
import { LoaderOverlay } from "./Components";
import ConnectionBanner from "@rimble/connection-banner";

const drizzleStore = generateStore({
  drizzleOptions,
  appReducers,
  disableReduxDevTools: false
});
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

let isMetamaskInstalled = false;
function handleEthereum() {
  const { ethereum } = window;
  if (ethereum?.isMetaMask) {
    console.log("Ethereum successfully detected!");
    isMetamaskInstalled = true;
    console.log(ethereum.selectedAddress);
  } else {
    console.log("Please install MetaMask!");
  }
}

if (window.ethereum) {
  handleEthereum();
} else {
  window.addEventListener("ethereum#initialized", handleEthereum, {
    once: true
  });

  // If the event is not dispatched by the end of the timeout,
  // the user probably doesn't have MetaMask installed.
  setTimeout(handleEthereum, 3000); // 3 seconds
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;

            if (!initialized) {
              return (
                <LoaderOverlay
                  hideSpinner={!isMetamaskInstalled}
                  label={
                    isMetamaskInstalled
                      ? "Please connect an account to use the dapp."
                      : ""
                  }
                  display={
                    !isMetamaskInstalled && (
                      <ConnectionBanner onWeb3Fallback={true} />
                    )
                  }
                />
              );
            }

            return (
              <App
                drizzle={drizzle}
                drizzleState={drizzleState}
                initialized={initialized}
              />
            );
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
