import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";

import Container from "../../../atoms/Container";
import WalletIcon from "../../../atoms/WalletIcon";
import Button from "../../../atoms/Button";
import Text from "../../../atoms/Text";

import { useWallet } from "../../../../hooks/useWallets";
import { useAdminBank } from "../../../../hooks/useAdminBank";

const Bank = () => {
  const { symbol } = useParams();
  const { wallet } = useWallet(symbol);
  const { bank } = useAdminBank();

  const [copied, setCopied] = useState(false);
  const copy = () => setCopied(true);

  return (
    <Container p="24px 0" wide>
      <Container flex="center" wide>
        <WalletIcon symbol={wallet.symbol} size="80px" />
      </Container>

      <Container p="6px 12px" wide>
        <Text opacity="0.6">Bank Name</Text>
        <Text bg="bg" p="12px" font="12px" align="center" radius="16px" bold>
          {bank?.bankName?.toUpperCase()}
        </Text>
      </Container>

      <Container p="6px 12px" wide>
        <Text opacity="0.6">Account Name</Text>
        <Text bg="bg" p="12px" font="12px" align="center" radius="16px" bold>
          {bank?.accountName}
        </Text>
      </Container>

      <Container p="6px 12px" wide>
        <Text opacity="0.6">Account Number</Text>
        <CopyToClipboard text={bank?.accountNumber} onCopy={copy}>
          <Text
            bg="bg"
            p="24px"
            font="14px"
            align="center"
            radius="24px"
            breakword
            multiline
            bold
          >
            {bank?.accountNumber}
          </Text>
        </CopyToClipboard>
      </Container>

      {bank?.reference && (
        <Container p="6px 12px" wide>
          <Text opacity="0.6">Reference</Text>
          <Text bg="bg" p="12px" font="12px" align="center" radius="16px" bold>
            {bank?.reference}
          </Text>
        </Container>
      )}

      <Container p="12px" m="24px 0 0 0" flexCol="center" wide>
        <CopyToClipboard text={bank?.accountNumber} onCopy={copy}>
          <Button bg="primary" p="16px" radius="24px" max="480px" bold full>
            {copied ? "Copied" : "Copy Account Number"}
          </Button>
        </CopyToClipboard>
      </Container>
    </Container>
  );
};

export default Bank;
