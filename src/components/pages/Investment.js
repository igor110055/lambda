import React from "react";
import { useHistory, useParams } from "react-router-dom";

import PreLoader from "../atoms/PreLoader";
import Container from "../atoms/Container";
import Button from "../atoms/Button";
import WalletIcon from "../atoms/WalletIcon";

import Entry from "../molecules/Entry";

import WalletChart from "../organisms/WalletChart";

import DashboardLayout from "../templates/Dashboard";

import { useTransaction } from "../../hooks/useTransactions";
import { useWallets } from "../../hooks/useWallets";

import { getCurrentProfit } from "../../utils/transactionUtils";
import { parseBalance } from "../../utils/parseBalance";

const Investment = () => {
  const { id } = useParams();
  const history = useHistory();

  const { transaction, loading, error } = useTransaction(id);

  const { wallets } = useWallets();
  const selectedWallet = wallets?.find(
    (wallet) => wallet.symbol === transaction?.wallet
  );

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

      <Container p="12px 0" wide>
        <WalletChart
          wallet={selectedWallet}
          h="280px"
          media={{
            breakpoint: "md",
            h: "360px",
          }}
        />
      </Container>

      <Container p="12px" m="12px 0" flex="center" wide>
        <Container bg="bg" p="12px" radius="8px" maxW="480px" wide>
          <Entry title="Amount">
            {transaction.amount.toLocaleString()} USD
          </Entry>
          <Entry title="Profit">
            +{parseBalance(getCurrentProfit(transaction))} USD
          </Entry>
          <Entry title="Duration">
            {transaction.duration} Day{transaction.duration > 1 ? "s" : ""}
          </Entry>
          <Container flex="center" wide>
            <Button
              bg="primary"
              p="8px"
              m="12px 0 0"
              radius="4px"
              full="full"
              to={`/dashboard/transactions/${id}`}
            >
              View Details
            </Button>
          </Container>
        </Container>
      </Container>
    </DashboardLayout>
  );
};

export default Investment;
