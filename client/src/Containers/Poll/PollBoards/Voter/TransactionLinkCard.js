import { Card, Link, Text, Flex } from "rimble-ui";
import { Launch } from '@rimble/icons'

const ETHERSCAN_URL = "https://kovan.etherscan.io/tx/";

const TransactionLinkCard = ({ txHash }) => {
  const transactionLink = ETHERSCAN_URL + txHash;
  return (
    <Card>
      <Flex gap="16px" alignItems={"center"}>
        <Text mr="3" fontSize="5">🎉</Text>
        <Flex flexGrow="1">
          <Text fontWeight="bold" fontSize="2" overflow="hidden">
            Operation successfully completed.{" "}
            <Link
              fontWeight="bold"
              fontSize="2"
              href={transactionLink}
              target="_blank"
              title="Check transaction status"
            >
              Check out transaction details on Etherscan.{" "}
              <Launch size="15"/>
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default TransactionLinkCard;
