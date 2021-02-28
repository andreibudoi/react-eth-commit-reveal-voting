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


const drizzleStore = generateStore({drizzleOptions, appReducers, disableReduxDevTools: false});
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;

            if (!initialized) {
              return "Loading..."; // Can show relevant info to people who don't have Metamask installed
            }

            return <App drizzle={drizzle} drizzleState={drizzleState} initialized={initialized} />;
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
