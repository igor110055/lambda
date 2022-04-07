import React from "react";
import { useParams } from "react-router-dom";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";

import AddButton from "../../../molecules/AddButton";
import { AdminTransactionItem } from "../../../molecules/TransactionItem";
import { TransactionsLoader } from "../../../molecules/Loader";

import { useAdminUser } from "../../../../hooks/useUsers";
import { useAdminUserTransactions } from "../../../../hooks/useTransactions";

import { AdminDisplay } from "../common/AdminChecker";

const Transactions = () => {
  const { userId } = useParams();

  const { user } = useAdminUser(userId);
  const { transactions, loading } = useAdminUserTransactions(userId);

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          {user.firstName}'s Transactions
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Manage all transactions for {user.fullName}
        </Text>
      </Container>

      <AdminDisplay>
        <Container flex wide justify="flex-end">
          <AddButton title="Add Fiat Deposit" to="./transactions/fiat/add" />
          <AddButton title="Add Transaction" to="./transactions/add" />
        </Container>
      </AdminDisplay>

      <Container p="12px" wide>
        {loading ? (
          <TransactionsLoader count={9} />
        ) : transactions.length ? (
          transactions.map((transaction) => (
            <AdminTransactionItem
              key={transaction._id}
              transaction={transaction}
            />
          ))
        ) : (
          <Container minH="240px" flex="center">
            <Text opacity="0.6" bold>
              No Transaction
            </Text>
          </Container>
        )}
      </Container>
    </>
  );
};

export default Transactions;
