import React from "react";
// import { FaWallet } from "react-icons/fa";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
// import SubText from "../../atoms/SubText";
// import Button from "../../atoms/Button";

import InvestmentCard from "../../molecules/InvestmentCard";
import { WalletItemFullCard } from "../../molecules/WalletItem";
import { WalletItemFullCardLoader } from "../../molecules/Loader";

import Upgrade from "../../organisms/Upgrade";
import Pending from "../../organisms/Pending";

import DashboardLayout from "../../templates/Dashboard";

import { useTransactions } from "../../../hooks/useTransactions";
import { useWallets } from "../../../hooks/useWallets";
// import { useBalance } from "../../../hooks/useBalance";

import { toDateTransactions } from "../../../utils/balanceReducers";

const Home = () => {
  const { investments } = useTransactions();
  const { wallets, loading: loadingWallets } = useWallets();
  // const { total, bonus, profit, deposit } = useBalance();

  const activeInvestments = toDateTransactions(investments)?.filter(
    (investment) => {
      const date = new Date(investment.date);
      const endDate = new Date(
        date.setDate(date.getDate() + investment.duration)
      );
      const active = new Date() < endDate;

      return active;
    }
  );

  return (
    <DashboardLayout>
      <Upgrade />

      {/* <Container p="12px" wide>
        <Container bg="bg" p="12px" m="12px 0 0" radius="8px" wide>
          <Container flex="space-between" wide>
            <Container p="12px" flexCol="space-between" wide>
              <Text
                p="0"
                m="0 0 8px 0"
                font="10px"
                opacity="0.6"
                bold
                flexalign
              >
                <SubText font="14px" p="0" m="0 6px 0 0" flexalign>
                  <FaWallet />
                </SubText>
                Total Balance
              </Text>
              <Text p="0" font="20px" bold>
                $ {total}
              </Text>
            </Container>
            <Container
              p="12px"
              radius="8px"
              flexCol="space-between"
              align="flex-end"
              wide
            >
              <Text p="0" m="0 0 8px 0" font="10px" opacity="0.6" bold>
                Bonus
              </Text>
              <Text p="0" font="14px" bold>
                $ {bonus}
              </Text>
            </Container>
          </Container>
          <Container flex="space-between" wide>
            <Container p="12px" flexCol="space-between" wide>
              <Text p="0" m="0 0 8px 0" font="10px" opacity="0.6" bold>
                Deposits
              </Text>
              <Text p="0" font="16px" bold>
                $ {deposit}
              </Text>
            </Container>
            <Container p="12px" flexCol="space-between" align="flex-end" wide>
              <Text p="0" m="0 0 8px 0" font="10px" opacity="0.6" bold>
                Profit
              </Text>
              <Text p="0" font="16px" bold>
                $ {profit}
              </Text>
            </Container>
          </Container>
          <Button
            m="12px 0 0"
            bg="primary"
            full="true"
            bold="true"
            to="/dashboard/wallets/withdraw"
          >
            Withdraw
          </Button>
        </Container>
      </Container> */}

      <Container p="12px 0" wide>
        <Pending />
      </Container>

      {activeInvestments?.length > 0 && (
        <>
          <Text font="16px" p="12px" bold>
            Active Investments
          </Text>
          <Container
            p="12px"
            display="grid"
            flow="column"
            gap="12px"
            scrollX
            wide
          >
            {activeInvestments.map((investment) => (
              <InvestmentCard key={investment._id} investment={investment} />
            ))}
          </Container>
        </>
      )}

      <Text font="16px" p="12px" bold>
        My Wallets
      </Text>
      <Container p="12px" wide>
        {loadingWallets ? (
          <WalletItemFullCardLoader />
        ) : wallets.length ? (
          wallets.map((wallet) => (
            <WalletItemFullCard key={wallet._id} wallet={wallet} />
          ))
        ) : (
          <Container minH="240px" flex="center">
            <Text opacity="0.6" bold>
              No Wallets
            </Text>
          </Container>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Home;
