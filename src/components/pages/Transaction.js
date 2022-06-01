import React from "react";
import { useHistory, useParams } from "react-router-dom";

import PreLoader from "../atoms/PreLoader";
import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import WalletIcon from "../atoms/WalletIcon";

import Entry from "../molecules/Entry";

import DashboardLayout from "../templates/Dashboard";

import { useTransaction } from "../../hooks/useTransactions";

import { capitalise } from "../../utils/formatText";

const Transaction = () => {
  const { id } = useParams();
  const history = useHistory();

  const { transaction, loading, error } = useTransaction(id);

  if (error) history.goBack();

  return loading ? (
    <DashboardLayout>
      <PreLoader page />
    </DashboardLayout>
  ) : (
    <DashboardLayout>
      <Container p="24px" flex="center" wide>
        <WalletIcon symbol={transaction.wallet} size="64px" />
      </Container>

      <Container wide>
        <Text p="0" align="center" bold>
          {transaction.description ||
            transaction.wallet.toUpperCase() +
              " " +
              capitalise(transaction.type)}
        </Text>
        <Text font="12px" opacity="0.6" align="center" bold>
          {new Date(transaction.date).toDateString()}
        </Text>
      </Container>

      <Container p="12px" flex="center" wide>
        <Container bg="bg" p="12px" radius="8px" wide>
          <Entry title="Type">{capitalise(transaction.type)}</Entry>
          <Entry title="Block ID">{transaction._id}</Entry>
          <Entry title="Amount">
            {transaction.amount.toLocaleString()} USD
          </Entry>
          {transaction.type === "investment" && (
            <Entry title="Profit">+{transaction.profit} USD</Entry>
          )}
          <Entry title="Status">{capitalise(transaction.status) || "Approved"}</Entry>
          <Entry title="Total Amount">
            {transaction.amount + (transaction.profit || 0)} USD
          </Entry>
          <Container flex="center" m="0 0 24px 0" wide>
            <Button
              bg="primary"
              p="16px"
              m="12px 0 0"
              radius="24px"
              full="full"
              bold="true"
              to="/dashboard/transactions"
            >
              All Transactions
            </Button>
          </Container>
        </Container>
      </Container>
    </DashboardLayout>
  );
};

export default Transaction;
