import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { useCoinValue } from "../../hooks/useCoinValue";
import { useTransaction } from "../../hooks/useTransactions";
import { parseBalance } from "../../utils/parseBalance";
import { useTheme } from "../../hooks/useTheme";
import { getCurrentProfit, getProgress } from "../../utils/transactionUtils";
import Button from "../atoms/Button";
import Container from "../atoms/Container";
import PreLoader from "../atoms/PreLoader";
import Text from "../atoms/Text";
import DashboardLayout from "../templates/Dashboard";

const Detail = ({ title, children }) => {
  return (
    <Container
      p="6px 10px"
      h="48px"
      w="100%"
      radius="6px"
      bg="bg"
      o="hidden"
      display="flex"
      direction="column"
      justify="space-between"
    >
      <Text p="0" font="10px" opacity="0.6">
        {title}:
      </Text>
      <Text font="12px" bold p="0" opacity="0.9">
        {children}
      </Text>
    </Container>
  );
};

const Investment = () => {
  const { id } = useParams();
  const history = useHistory();
  const { theme } = useTheme()

  const { transaction, loading, error } = useTransaction(id);

  if (error) history.goBack();

  const { progress: transactionProgress } = useMemo(
    () => getProgress(transaction),
    [transaction]
  );
  const { rate, change } = useCoinValue(transaction?.wallet);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(transactionProgress);
      setProgress(transactionProgress * 100);
    }, 500);
  }, [transactionProgress]);

  return loading ? (
    <DashboardLayout>
      <PreLoader page />
    </DashboardLayout>
  ) : (
    <DashboardLayout>
      <Container h="100%" display="flex" direction="column">
        <Container h="70%" w="100%">
          <TradingViewWidget
            symbol={`BITSTAMP:${transaction?.wallet.toUpperCase()}USD`}
            theme={theme === "dark" ? Themes.DARK : Themes.LIGHT}
            locale="en"
            autosize
          />
        </Container>

        <Container p="8px 12px" wide flexGrow>
          <Text align="center" opacity="0.8" p="0 0 12px" font="14px" bold>
            Trade Information
          </Text>

          <Container
            radius="12px"
            m="0 0 12px 0"
            bg="bg"
            h="20px"
            o="hidden"
            w="100%"
          >
            <Container
              bg="primary"
              flex="center"
              w={progress + "%"}
              ease="width"
            >
              <Text color="white" bold>
                {parseBalance(progress)}%
              </Text>
            </Container>
          </Container>

          <Container display="grid" gap="10px" templatecolumns="1fr 1fr" wide>
            <Detail title="Duration">7 Days</Detail>
            <Detail title="Profit">
              +{parseBalance(getCurrentProfit(transaction))} USD
            </Detail>
            <Detail title="Amount">
              {parseBalance(Math.abs(transaction?.amount))} USD
            </Detail>
            <Detail title="Market">{transaction?.wallet}USD</Detail>
            <Detail title="Current Value">{rate} USD</Detail>
            <Detail title="24hr Change">{change} USD</Detail>
          </Container>

          <Container flex="center" wide>
            <Button
              bg="secondary"
              p="12px"
              m="12px 0 0"
              radius="24px"
              full="full"
              bold="true"
              to={`/dashboard/transactions/${id}`}
            >
              View Transaction Details
            </Button>
          </Container>
        </Container>
      </Container>
    </DashboardLayout>
  );
};

export default Investment;
