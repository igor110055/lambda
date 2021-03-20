import React from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";

import Section from "../molecules/Section";
import { TransactionItem } from "../molecules/TransactionItem";
import { TransactionsLoader } from "../molecules/Loader";

import { useTransactions } from "../../hooks/useTransactions";

import { toDateTransactions } from "../../utils/balanceReducers";

const RecentWithdrawals = () => {
  const { transactions, loading } = useTransactions();
  const recentWithdrawals = toDateTransactions(transactions)
    ?.filter((tx) => tx.type === "withdrawal")
    .slice(0, 5);

  return (
    <Section
      heading="Recent Withdrawals"
      wide
      text={{
        name: "View All",
        color: "grey",
        p: "0",
        to: "/dashboard/transactions",
      }}
    >
      {loading ? (
        <TransactionsLoader />
      ) : (
        <Container minH="240px" scroll wide>
          {recentWithdrawals?.length ? (
            recentWithdrawals.map((transaction) => (
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

export default RecentWithdrawals;
