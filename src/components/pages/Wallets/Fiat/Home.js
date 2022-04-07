import React from "react";
import { useParams, useRouteMatch } from "react-router-dom";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";

import FiatBalance from "../../../molecules/FiatBalance";

import WalletChart from "../../../organisms/WalletChart";
import FiatActionTab from "../../../organisms/FiatActionTab";
import RecentTransactions from "../../../organisms/RecentTransactions";

import { useWallet } from "../../../../hooks/useWallets";
import { useProfile } from "../../../../hooks/useProfile";

import { getFiat } from "../../../../store/supportedWallets";

const Home = () => {
  const { url } = useRouteMatch();
  const { id } = useParams();

  const { symbol } = getFiat(id);
  
  const { wallet } = useWallet(symbol);
  
  const { profile } = useProfile();

  return (
    <Container display="grid" gap="12px" wide>
      <Container p="24px 12px 12px" wide>
        <FiatBalance id={id} />
        {!profile.meta.fiatEnabled && (
            <Container bg="secondary" p="2px 6px" m="0 0 24px" radius="6px" wide>
              <Text multiline>
                Fiat Accounts are currently not active on your account, contact support to activate.
              </Text>
            </Container>
        )}
        <Container m="12px 0 0" display="grid" gap="12px" flow="column" wide>
          <Button
            p="12px"
            bg="primary"
            radius="6px"
            full="true"
            bold="true"
            to={`${url}/fund`}
          >
            Fund
          </Button>
          <Button
            p="12px"
            bg="secondary"
            color="black"
            radius="6px"
            full="true"
            bold="true"
            to={{
              pathname: "../withdraw",
              state: {
                wallet: id,
                fiat: true,
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

      <FiatActionTab />
      <RecentTransactions wallet={id} />
    </Container>
  );
};

export default Home;
