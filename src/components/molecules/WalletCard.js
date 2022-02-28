import React from "react";
import { useTheme as useStyledTheme } from "styled-components";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import WalletIcon from "../atoms/WalletIcon";
import ChangeIcon from "../atoms/ChangeIcon";
import Chart from "../atoms/Chart";

import { useCoinValue } from "../../hooks/useCoinValue";
import { useKlines } from "../../hooks/useKlines";

import { rawBalance } from "../../utils/parseBalance";

const WalletCard = ({ wallet, action, ...props }) => {
  const theme = useStyledTheme();

  const { klines } = useKlines(wallet?.symbol);

  const { rate, change } = useCoinValue(wallet?.symbol);
  const negative = rawBalance(change) < 0;

  const onClick = () => action(wallet);

  return (
    <Container
      p="12px 0"
      h="180px"
      w="220px"
      radius="12px"
      noscroll="true"
      display="grid"
      templaterows="40px auto 14px"
      bg="wallet"
      onClick={onClick}
      {...props}
    >
      <Container p="12px" flex="flex-start" wide>
        <WalletIcon symbol={wallet.symbol} size="32px" />
        <Container
          m="0 0 0 8px"
          flexCol="flex-start"
          justify="space-between"
          h="32px"
        >
          <Text font="13px" p="0" bold>
            {wallet.name}
          </Text>
          <Text font="12px" p="0" opacity="0.6" bold>
            {wallet.symbol}
          </Text>
        </Container>
      </Container>
      <Container flexCol="center" wide>
        <Chart
          smooth
          autoDraw
          autoDrawDuration={3000}
          autoDrawEasing="ease-out"
          data={klines.slice(-20)}
          gradient={[theme.colors.chart]}
          radius={8}
          strokeWidth={2.5}
          strokeLinecap={"round"}
          min="0"
        />
      </Container>
      <Container p="0 12px" flex="space-between" wide>
        <Text p="0" font="13px" opacity="0.8" bold>
          {rate} USD
        </Text>
        <Text
          font="12px"
          p="0"
          color={negative ? "danger" : "success"}
          flexalign
          opacity="0.8"
          bold
        >
          {negative ? "" : "+"} {change}%
          <ChangeIcon negative={negative ? "true" : undefined} />
        </Text>
      </Container>
    </Container>
  );
};

export default WalletCard;
