import React from "react";
import { useHistory, useParams } from "react-router-dom";

import PreLoader from "../atoms/PreLoader";
import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import WalletIcon from "../atoms/WalletIcon";

import Entry from "../molecules/Entry";

import DashboardLayout from "../templates/Dashboard";

import { useTransaction } from "../../hooks/useTransactions";

import { capitalise } from "../../utils/formatText";
import { usePayments } from "../../hooks/usePayments";

const Transaction = () => {
  const { id } = useParams();
  const history = useHistory();

  const { transaction, loading, error } = useTransaction(id);
  const { payments } = usePayments();

  const paymentsCount = payments?.filter((payment) => !payment.completed)
    .length;

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

      <Text flexalign p="0 12px" m="12px 0 12px" font="13px" opacity="0.8">
        You have {paymentsCount < 2 && "a"} Pending payment
        {paymentsCount >= 2 && "s"}
        <Badge m="0 0 0 12px" bg="orangered" size="18px" font="10px" bold>
          {paymentsCount}
        </Badge>
        <Button
          font="12px"
          p="0 12px"
          m="0 0 0 auto"
          bg="bg"
          color="text"
          radius="12px"
          bold="bold"
          to="/dashboard/payments"
        >
          View
        </Button>
      </Text>

      <Container p="12px" flex="center" wide>
        <Container bg="bg" p="12px" radius="8px" wide>
          <Entry title="Type">{capitalise(transaction.type)}</Entry>
          <Entry title="Block ID">{transaction._id}</Entry>
          <Entry title="Amount">
            {Math.abs(transaction.amount).toLocaleString()} USD
          </Entry>
          {transaction.type === "investment" && (
            <Entry title="Profit">+{transaction.profit} USD</Entry>
          )}
          <Entry title="Status" color={transaction.completed ? "" : "danger"}>
            {transaction.completed ? "Approved" : "Pending"}
          </Entry>
          <Entry title="Total Amount">
            {Math.abs(transaction.amount + (transaction.profit || 0))} USD
          </Entry>
          <Container flex="center" wide>
            <Button
              bg="primary"
              p="8px"
              m="12px 0 0"
              radius="4px"
              full="full"
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
