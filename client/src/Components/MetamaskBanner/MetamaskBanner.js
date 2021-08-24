import { Flash, MetaMaskButton, Text, Flex, Box } from "rimble-ui";
import { Warning } from "@rimble/icons";

const NoMetamaskBanner = () => {
  return (
    <Flash variant={"danger"}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        flexDirection={"column"}
      >
        <Flex alignItems="center" mb="2">
          <Box pr={3}>
            <Warning size="44" />
          </Box>
          <Flex flexDirection="column">
            <Text fontWeight="bold" color={"inherit"}>
              Install the MetaMask browser extension to use our blockchain
              features in your current browser
            </Text>
          </Flex>
        </Flex>

        <MetaMaskButton
          as="a"
          width="100%"
          href="https://metamask.io/"
          target="_blank"
          color={"white"}
        >
          Install MetaMask
        </MetaMaskButton>
      </Flex>
    </Flash>
  );
};

export default NoMetamaskBanner;
