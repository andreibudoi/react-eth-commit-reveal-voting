import React from "react";
import { Flex } from "rimble-ui";

const PageContainer = ({ children, style }) => (
  <Flex maxWidth={'700px'} mx={'auto'} p={3} flexDirection={"column"} style={{...style}}>
    {children}
  </Flex>
);

export default PageContainer;
