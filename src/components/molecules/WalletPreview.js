import React from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import WalletIcon from "../atoms/WalletIcon";
import ChangeIcon from "../atoms/ChangeIcon";

import { useCoinValue } from "../../hooks/useCoinValue";

import { rawBalance } from "../../utils/parseBalance";

const WalletPreview = ({ wallet, ...props }) => {
  const { rate, change } = useCoinValue(wallet?.symbol);
  const negative = rawBalance(change) < 0;

  return (
    <Container
      flex="center"
      p="12px"
      wide="wide"
      to={`/dashboard/wallets/${wallet.symbol.toLowerCase()}`}
      {...props}
    >
      <Container bg="bg" radius="12px" p="12px" flex="space-between" shadow wide>
        <WalletIcon size="40px" symbol={wallet.symbol} />
        <Container flexCol="flex-start" justify="space-between" p="0 12px">
          <Text font="14px" p="0 0 8px" bold>
            {wallet.name}
          </Text>
          <Text p="0" flexalign bold>
            <SubText font="12px" opacity="0.8" p="0">
              Market Price:
            </SubText>
            <SubText font="13px" p="0 0 0 8px" bold>
              $ {rate}
            </SubText>
            <SubText
              font="12px"
              p="0 0 0 16px"
              color={negative ? "danger" : "success"}
              flexalign
              bold
            >
              {negative ? "" : "+"} {change}%
              <ChangeIcon negative={negative ? "true" : undefined} />
            </SubText>
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export default WalletPreview;
