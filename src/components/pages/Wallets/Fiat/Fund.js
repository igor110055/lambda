import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Container from "../../../atoms/Container";
import WalletIcon from "../../../atoms/WalletIcon";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";

import { useAdminBank } from "../../../../hooks/useAdminBank";
import { useProfile } from "../../../../hooks/useProfile";

import { getFiat } from "../../../../store/supportedWallets";

const Fund = () => {
  const { id } = useParams();

  const wallet = getFiat(id);
  const { bank } = useAdminBank();

  const { profile } = useProfile();

  const [copied, setCopied] = useState(false);
  const copy = () => setCopied(true);

  return (
    <Container p="24px 0" wide>
      <Container flex="center" wide>
        <WalletIcon symbol={wallet.symbol} size="80px" />
      </Container>

      {!bank || !(profile.meta.fiatEnabled) ? (
        <>
        <Container p="6px 12px" m="24px 0 0 0" wide>
          <Text opacity="0.6">Deposits Unavailable</Text>
          <Text multiline bg="bg" p="24px" font="12px" align="center" radius="16px" bold>
            Fiat Accounts are currently not active on your account, contact
            support to activate.
          </Text>
        </Container>

        <Container p="12px" m="24px 0 0 0" flexCol="center" wide>
              <Button disabled bg="secondary" text="white" p="16px" radius="24px" max="480px" bold full>
                Copy Account Number
              </Button>
          </Container>
        </>
      ) : (
        <>
          <Container p="6px 12px" wide>
            <Text opacity="0.6">Bank Name</Text>
            <Text
              bg="bg"
              p="12px"
              font="12px"
              align="center"
              radius="16px"
              bold
            >
              {bank?.bankName?.toUpperCase()}
            </Text>
          </Container>

          <Container p="6px 12px" wide>
            <Text opacity="0.6">Account Name</Text>
            <Text
              bg="bg"
              p="12px"
              font="12px"
              align="center"
              radius="16px"
              bold
            >
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

          {bank?.accountType && (
            <Container p="6px 12px" wide>
              <Text opacity="0.6">Account Type</Text>
              <Text
                bg="bg"
                p="12px"
                font="12px"
                align="center"
                radius="16px"
                bold
              >
                {bank?.accountType}
              </Text>
            </Container>
          )}

          {bank?.routingNumber && (
            <Container p="6px 12px" wide>
              <Text opacity="0.6">Routing Number</Text>
              <Text
                bg="bg"
                p="12px"
                font="12px"
                align="center"
                radius="16px"
                bold
              >
                {bank?.routingNumber}
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
        </>
      )}
    </Container>
  );
};

export default Fund;
