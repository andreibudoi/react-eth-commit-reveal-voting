import React from "react";

const App = ({ drizzle, drizzleState }) => {
  console.log("drizzle: ", drizzle);
  console.log("drizzleState: ", drizzleState);
  return <div>{drizzleState.accounts[0]}</div>;
};

export default App;
