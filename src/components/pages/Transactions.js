import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import Select from "../atoms/Select";

import { TransactionItem } from "../molecules/TransactionItem";
import { TransactionsLoader } from "../molecules/Loader";

import DashboardLayout from "../templates/Dashboard";

import { useTransactions } from "../../hooks/useTransactions";
import { useWallets } from "../../hooks/useWallets";

import { toDateTransactions } from "../../utils/balanceReducers";

const Transactions = () => {
  const { state } = useLocation();
  const stateWallet = state?.wallet;

  const [wallet, setWallet] = useState();
  const { transactions, loading } = useTransactions();
  const { wallets, loading: loadingWallets } = useWallets();

  const changeWallet = ({ target }) => setWallet(target.value);

  const filteredTransactions = toDateTransactions(transactions)?.filter(
    (tx) => {
      if (wallet && wallet !== "All") {
        return tx.wallet.toLowerCase() === wallet.toLowerCase();
      } else return true;
    }
  );

  useEffect(() => {
    if (wallets && stateWallet) {
      const locationWallet = wallets.find(
        (w) => w.symbol.toLowerCase() === stateWallet.toLowerCase()
      );
      setWallet(locationWallet.symbol);
    }
  }, [stateWallet, wallets]);

  return (
    <DashboardLayout>
      <Container p="12px" wide>
        <Text font="16px" p="12px 0" bold>
          My Transactions
        </Text>
        <Container p="12px 0" wide>
          <Text p="0" font="12px" opacity="0.6" bold>
            View all your transactions across all wallets
          </Text>
        </Container>
        <Container m="12px 0 0" flex="space-between" wide>
          <Container flex="flex-start" wide>
            <Button
              p="8px 24px"
              radius="6px"
              bg="primary"
              bold="true"
              to="/dashboard/wallets/btc"
            >
              Withdraw
            </Button>
          </Container>

          <Select
            bg="bg"
            p="8px"
            radius="6px"
            w="120px"
            value={wallet}
            onChange={changeWallet}
          >
            <option>All</option>
            {!loadingWallets &&
              wallets.map((w) => (
                <option key={w.symbol} value={w.symbol}>
                  {w.name}
                </option>
              ))}
          </Select>
        </Container>
      </Container>

      <Container p="12px" wide>
        {loading ? (
          <TransactionsLoader count={9} />
        ) : filteredTransactions.length ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction._id} transaction={transaction} />
          ))
        ) : (
          <Container minH="240px" flex="center">
            <Text opacity="0.6" bold>
              {wallet && wallet !== "All"
                ? "No Transaction found for this wallet"
                : "No Transaction"}
            </Text>
          </Container>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Transactions;
