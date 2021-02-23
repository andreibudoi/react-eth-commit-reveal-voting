import React from "react";

const PageContainer = ({ children, style }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      ...style
    }}
  >
    {children}
  </div>
);

export default PageContainer;
