import React, { useEffect, useState } from "react";
import { FaArrowUp, FaChevronRight, FaPlus, FaWallet } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";

import WalletCard from "../molecules/WalletCard";
import WalletPreview from "../molecules/WalletPreview";
import Loader, { WalletPreviewLoader } from "../molecules/Loader";

import Upgrade from "../organisms/Upgrade";
import Pending from "../organisms/Pending";
import WalletChart from "../organisms/WalletChart";
import MyWallets from "../organisms/MyWallets";
import RecentTransactions from "../organisms/RecentTransactions";

import DashboardLayout from "../templates/Dashboard";

import { useProfile } from "../../hooks/useProfile";
import { useWallets } from "../../hooks/useWallets";
import { useBalance } from "../../hooks/useBalance";
import Button from "../atoms/Button";
import styled from "styled-components";

const CtaIcon = styled(FaPlus)`
  font-size: 28px;
  
  &:hover {
    transform: rotate(360deg);
    transition: all 1s ease-in-out 0s;
  }
`

const Dashboard = () => {
  const { profile } = useProfile();
  const { total } = useBalance();
  const { wallets, loading: loadingWallets } = useWallets();

  const [selectedWallet, setSelectedWallet] = useState(null);

  useEffect(() => {
    if (wallets) setSelectedWallet(wallets[0]);
  }, [wallets]);

  return (
    <DashboardLayout>
      <Upgrade />

      {/* portfolio start */}
      <Container p="0 12px 140px" bg="board" wide>
        <Container m="0 0 12px 0" wide>
          <Text color="white" font="16px" p="12px 0" bold>
            Welcome {profile.firstName},
          </Text>
          <Container m="18px 0 0" flex wide>
            <Button p="8px 18px" m="0 12px 0 0" bg="white" color="primary" bold="true" to="/dashboard/wallets/btc/deposit">Deposit</Button>
            <Button p="8px 18px" bg="white" color="primary" bold="true" to="/dashboard/wallets/withdraw">Withdraw</Button>
          </Container>
        </Container>
      </Container>
      <Container p="12px" m="-140px 0 0 0" flex wide>
        <Container
          color="black"
          radius="8px"
          bg="white"
          display="grid"
          gap="12px"
          h="240px"
          w="auto"
          flexGrow
          shadow
        >
          <Container
            p="16px"
            flex="flex-start"
            wide="true"
            to="/dashboard/wallets/btc"
          >
            <Text p="0" bold flexalign>
              <SubText font="24px" p="0" m="0 8px 0 0" opacity="0.6" flexalign>
                <FaWallet />
              </SubText>
              {profile.email}
            </Text>
            <Text p="0" m="0 0 0 auto">
              <SubText font="11px" p="0" flexalign>
                <FaChevronRight />
              </SubText>
            </Text>
          </Container>
          <Container p="0 16px" flexCol="center" wide>
            <Text font="20px" p="0" bold>
              {total}
              <SubText font="18px" p="0" m="0 0 0 4px">
                USD
              </SubText>
            </Text>
            <Text font="16px" p="0" bold>
              <SubText font="12px" p="0">
                Total Balance
              </SubText>
            </Text>
          </Container>
          <Container p="16px" flex="flex-start" bordertop="1px solid" wide>
            <Text
              font="12px"
              p="0"
              m="0 24px 0 0"
              flexalign="true"
              bold="true"
              to="/dashboard/wallets/btc/deposit"
            >
              <SubText font="11px" p="0" m="0 6px 0 0" flexalign>
                <FaWallet />
              </SubText>
              Deposit
            </Text>
            <Text
              font="12px"
              p="0"
              flexalign="true"
              bold="true"
              to="/dashboard/wallets/withdraw"
            >
              <SubText font="11px" p="0" m="0 6px 0 0" flexalign>
                <FaArrowUp />
              </SubText>
              Withdraw
            </Text>
          </Container>
        </Container>
        <Container
          radius="8px"
          m="0 0 0 12px"
          bg="actionBg"
          color="white"
          display="grid"
          gap="12px"
          shadow="true"
          w="240px"
          h="240px"
          flex="center"
          media={{
            targetBelow: true,
            breakpoint: "sm",
            display: "none"
          }}
          to="/dashboard/wallets/btc/deposit"
        >
          <CtaIcon />
        </Container>
      </Container>
      {/* portfolio end */}

      <Pending />

      {/* top wallets start */}
      <Container m="12px 0 0" p="12px" display="grid" flow="column" gap="12px" scrollX wide>
        {loadingWallets ? (
          Array(3)
            .fill()
            .map((_, i) => <Loader key={i} h="64px" w="200px" radius="8px" />)
        ) : wallets.length ? (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet._id}
              wallet={wallet}
              action={setSelectedWallet}
              smooth={true}
              duration={400}
              offset={-50}
            />
          ))
        ) : (
          <Container minH="200px" flex="center">
            <Text opacity="0.6" bold>
              No Wallets
            </Text>
          </Container>
        )}
      </Container>
      {/* top wallets end */}

      {/* wallet preview start */}
      {!selectedWallet ? (
        <WalletPreviewLoader />
      ) : (
        <Container p="12px 0" id="wallet-preview" wide>
          <WalletPreview wallet={selectedWallet} />
          <WalletChart
            wallet={selectedWallet}
            reverse
            h="300px"
            media={{
              breakpoint: "md",
              h: "364px",
            }}
          />
        </Container>
      )}
      {/* wallet preview end */}

      <RecentTransactions />
      <MyWallets />

    </DashboardLayout>
  );
};

export default Dashboard;
