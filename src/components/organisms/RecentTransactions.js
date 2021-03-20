import React from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";

import Section from "../molecules/Section";
import { TransactionItem } from "../molecules/TransactionItem";
import { TransactionsLoader } from "../molecules/Loader";

import { useTransactions } from "../../hooks/useTransactions";

import { toDateTransactions } from "../../utils/balanceReducers";

const RecentTransactions = ({ wallet }) => {
  const { transactions, loading } = useTransactions();
  const recentTransactions = toDateTransactions(transactions)
    ?.filter((tx) => {
      if (wallet) {
        return tx.wallet.toLowerCase() === wallet.toLowerCase();
      } else {
        return true;
      }
    })
    .slice(0, 5);

  return (
    <Section
      heading="Recent Transactions"
      wide
      text={{
        name: "View All",
        color: "grey",
        p: "0",
        to: { pathname: "/dashboard/transactions", state: { wallet } },
      }}
    >
      {loading ? (
        <TransactionsLoader />
      ) : (
        <Container minH="240px" scroll wide>
          {recentTransactions?.length ? (
            recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
              />
            ))
          ) : (
            <Container minH="240px" flex="center">
              <Text opacity="0.6" bold>
                No transaction
              </Text>
            </Container>
          )}
        </Container>
      )}
    </Section>
  );
};

export default RecentTransactions;
