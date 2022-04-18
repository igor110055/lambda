import React from "react";
import { useParams, useRouteMatch } from "react-router-dom";

import Container from "../../../atoms/Container";
import Button from "../../../atoms/Button";

import WalletBalance from "../../../molecules/WalletBalance";

import WalletChart from "../../../organisms/WalletChart";
import WalletActionTab from "../../../organisms/WalletActionTab";
import RecentTransactions from "../../../organisms/RecentTransactions";

import { useWallet } from "../../../../hooks/useWallets";

const Home = () => {
  const { url } = useRouteMatch();
  const { symbol } = useParams();

  const { wallet } = useWallet(symbol);

  return (
    <Container display="grid" gap="12px" wide>
      <Container p="24px 12px 12px" wide>
        <WalletBalance wallet={wallet} />
        <Container m="12px 0 0" display="grid" gap="12px" flow="column" wide>
          <Button
            p="12px"
            bg="primary"
            radius="6px"
            full="true"
            bold="true"
            to={`${url}/deposit`}
          >
            Deposit
          </Button>
          <Button
            p="12px"
            bg="secondary"
            // color="black"
            radius="6px"
            full="true"
            bold="true"
            to={{
              pathname: "./withdraw",
              state: {
                wallet: symbol,
              },
            }}
          >
            Withdraw
          </Button>
        </Container>
      </Container>

      {/* wallet chart start */}
      <Container p="12px 0" bordertop="1px solid" wide>
        <WalletChart
          wallet={wallet}
          intervals={["1M", "1w", "1hr", "30m", "15m", "Now"]}
          h="240px"
          media={{
            breakpoint: "md",
            h: "280px",
          }}
        />
      </Container>
      {/* wallet chart end */}

      <WalletActionTab />
      <RecentTransactions wallet={symbol} />
    </Container>
  );
};

export default Home;
