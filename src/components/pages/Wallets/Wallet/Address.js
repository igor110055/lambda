import React from "react";
import { useHistory, useParams } from "react-router-dom";

import Container from "../../../atoms/Container";
import WalletIcon from "../../../atoms/WalletIcon";
import Button from "../../../atoms/Button";
import Text from "../../../atoms/Text";
import QRCode from "../../../atoms/QRCode";

import { useWallet } from "../../../../hooks/useWallets";

const Address = () => {
  const { symbol } = useParams();
  const { wallet } = useWallet(symbol);

  const history = useHistory();

  const goBack = () => history.goBack();

  return (
    <Container p="24px 0" wide>
      <Container flex="center" wide>
        <WalletIcon symbol={wallet.symbol} size="80px" />
      </Container>

      <Container p="24px 0" flex="center" wide>
        <a href={`${wallet.name.toLowerCase()}:${wallet.address}`}>
          <Container bg="bg" p="24px" radius="16px" w="auto" h="auto">
            <QRCode value={wallet.address} />
          </Container>
        </a>
      </Container>

      <Container p="24px" flexCol="center" wide>
        <Text font="12px" bold>
          Scan or Click QR Code to open mobile wallet
        </Text>
        <Container maxW="480px" flex="center" wide>
          <Button
            bg="primary"
            p="16px"
            radius="24px"
            bold
            full
            onClick={goBack}
          >
            Done
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default Address;
