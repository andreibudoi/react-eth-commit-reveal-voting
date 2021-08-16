import { Loader as RimbleLoader, Flex, Heading } from "rimble-ui";
import { React } from "react";

const LoaderOverlay = ({
  label = "Loading...",
  display,
  hideSpinner = false
}) => {
  return (
    <Flex
      bg="primary"
      height="100%"
      width="100%"
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Flex flexDirection="column" alignItems="center">
        {!hideSpinner && <RimbleLoader size="5rem" color="white" />}
        {label && <Heading fontWeight="bold" as="h3" color="white">
          {label}
        </Heading>}
        {display}
      </Flex>
    </Flex>
  );
};

export default LoaderOverlay;
