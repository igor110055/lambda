import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTransaction } from "../../hooks/useTransactions";
import { capitalise } from "../../utils/formatText";
import Button from "../atoms/Button";
import Container from "../atoms/Container";
import PreLoader from "../atoms/PreLoader";
import Text from "../atoms/Text";
import WalletIcon from "../atoms/WalletIcon";
import Entry from "../molecules/Entry";
import DashboardLayout from "../templates/Dashboard";

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
            {Math.abs(transaction.amount).toLocaleString()} USD
          </Entry>
          <Entry title="Status">Approved</Entry>
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
