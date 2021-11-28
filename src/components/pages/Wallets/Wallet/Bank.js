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
        <Text opacity="0.6">Recipient Name</Text>
        <Text bg="bg" p="12px" font="12px" align="center" radius="16px" bold>
          {bank?.accountName}
        </Text>
      </Container>

      <Container p="6px 12px" wide>
        <Text opacity="0.6">Bank Name</Text>
        <Text bg="bg" p="12px" font="12px" align="center" radius="16px" bold>
          {bank?.bankName?.toUpperCase()}
        </Text>
      </Container>

      <Container p="6px 12px" wide>
        <Text opacity="0.6">Account Number</Text>
        <Text bg="bg" p="12px" font="12px" align="center" radius="16px" bold>
          {bank?.accountNumber}
        </Text>
      </Container>

      <Container p="6px 12px" wide>
        <Text opacity="0.6">Branch</Text>
        <Text bg="bg" p="12px" font="12px" align="center" radius="16px" bold>
          {bank?.branch}
        </Text>
      </Container>
      <Container p="6px 12px" wide>
        <Text opacity="0.6">Type</Text>
        <Text bg="bg" p="12px" font="12px" align="center" radius="16px" bold>
          {bank?.type}
        </Text>
      </Container>

      <Container p="6px 12px" wide>
        <Text opacity="0.6">Reference</Text>
        <CopyToClipboard text={bank?.reference} onCopy={copy}>
          <Text bg="bg" p="12px" font="12px" align="center" radius="16px" bold>
            {bank?.reference}
          </Text>
        </CopyToClipboard>
      </Container>

      <Container p="12px" m="24px 0 0 0" flexCol="center" wide>
        <CopyToClipboard text={bank?.reference} onCopy={copy}>
          <Button bg="primary" p="16px" radius="24px" max="480px" bold full>
            {copied ? "Copied" : "Copy Reference"}
          </Button>
        </CopyToClipboard>
      </Container>
    </Container>
  );
};

export default Bank;
