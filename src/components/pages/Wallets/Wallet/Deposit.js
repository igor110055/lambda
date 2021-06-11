import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Container from "../../../atoms/Container";
import WalletIcon from "../../../atoms/WalletIcon";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";

import { List, ListItem } from "../../../molecules/List";

import { useProfile } from "../../../../hooks/useProfile";
import { useWallet } from "../../../../hooks/useWallets";

const Deposit = () => {
  const { symbol } = useParams();
  const { profile } = useProfile();
  const { wallet } = useWallet(symbol);

  const [copied, setCopied] = useState(false);
  const copy = () => setCopied(true);

  const customWallet = profile.wallets.find(
    (w) => w.symbol.toLowerCase() === symbol
  );
  const address = customWallet?.address || wallet.address;

  return (
    <Container p="24px 0" wide>
      <Container flex="center" wide>
        <WalletIcon symbol={wallet.symbol} size="80px" />
      </Container>

      <Container p="12px" wide>
        <Text opacity="0.6">Payment Method</Text>
        <List>
          <ListItem bg="bg" href="https://bitcoin.com" target="_blank">
            Bitcoin.com
          </ListItem>
          <ListItem bg="bg" href="https://coinmama.com" target="_blank">
            Coinmama
          </ListItem>
          <ListItem bg="bg" href="https://changelly.com" target="_blank">
            Changelly
          </ListItem>
        </List>
      </Container>

      <Container p="12px" wide>
        <Text opacity="0.6">More</Text>
        <List>
          <ListItem bg="bg" to="./qrcode">
            QR Code
          </ListItem>
        </List>
      </Container>

      <Container p="12px" wide>
        <Text opacity="0.6">Address</Text>
        <CopyToClipboard text={address} onCopy={copy}>
          <Text bg="bg" p="24px" radius="24px" breakword multiline>
            {address}
          </Text>
        </CopyToClipboard>
      </Container>

      <Container p="12px" wide>
        <Text p="0 12px" bold>
          Minimum deposit: 1000 USD
        </Text>
        <Text font="12px" multiline opacity="0.6">
          If a deposit is below the required minimum, the funds will not be
          credited to your account.
        </Text>
      </Container>

      <Container p="12px" flex="center" wide>
        <CopyToClipboard text={address} onCopy={copy}>
          <Button bg="primary" p="16px" radius="24px" max="480px" bold full>
            {copied ? "Copied" : "Copy Address"}
          </Button>
        </CopyToClipboard>
      </Container>
    </Container>
  );
};

export default Deposit;
