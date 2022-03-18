import React from "react";
import { useTheme as useStyledTheme } from "styled-components";
import { useKlines } from "../../hooks/useKlines";
import { useWallets } from "../../hooks/useWallets";
import { parseBalance } from "../../utils/parseBalance";
import { getCurrentProfit } from "../../utils/transactionUtils";
import Chart from "../atoms/Chart";
import Container from "../atoms/Container";
import SubText from "../atoms/SubText";
import Text from "../atoms/Text";
import WalletIcon from "../atoms/WalletIcon";

const InvestmentCard = ({ investment, ...props }) => {
  const theme = useStyledTheme();

  const { wallets } = useWallets();
  const selectedWallet = wallets?.find(
    (wallet) => wallet.symbol === investment.wallet
  );

  const { klines } = useKlines(selectedWallet?.symbol);

  return (
    <Container
      p="12px 0"
      h="180px"
      w="220px"
      radius="12px"
      noscroll="true"
      display="grid"
      templaterows="40px auto 14px"
      bg="bg"
      o="hidden"
      to={`/dashboard/investment/${investment._id}`}
      {...props}
    >
      <Container p="12px" flex="flex-start" wide>
        <WalletIcon symbol={investment.wallet} size="32px" />
        <Text font="13px" p="0" m="0 0 0 8px" bold>
          {investment.wallet} Investment
        </Text>
      </Container>
      <Container flexCol="center" wide>
        <Chart
          smooth
          autoDraw
          autoDrawDuration={3000}
          autoDrawEasing="ease-out"
          data={klines.slice(-30)}
          gradient={[theme.colors.chart]}
          radius={8}
          strokeWidth={2.5}
          strokeLinecap={"round"}
          min="0"
        />
      </Container>
      <Container p="0 12px" flex="space-between" wide>
        <Text flexalign p="0" font="10px" opacity="0.8">
          Capital:
          <SubText p="0" m="0 0 0 6px" font="12px" bold>
            {Math.abs(investment.amount)} USD
          </SubText>
        </Text>
        <Text flexalign p="0" font="10px" opacity="0.8">
          Profit:
          <SubText p="0" m="0 0 0 6px" font="12px" bold>
            {parseBalance(getCurrentProfit(investment))} USD
          </SubText>
        </Text>
      </Container>
    </Container>
  );
};

export default InvestmentCard;
