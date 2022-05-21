import React, { useEffect, useState } from "react";
import { FaArrowUp, FaChevronRight, FaWallet } from "react-icons/fa";

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

const Dashboard = () => {
  const { profile } = useProfile();
  const { total, available } = useBalance();
  const { wallets, loading: loadingWallets } = useWallets();

  const [selectedWallet, setSelectedWallet] = useState(null);

  useEffect(() => {
    if (wallets) setSelectedWallet(wallets[0]);
  }, [wallets]);

  return (
    <DashboardLayout>
      <Upgrade />

      {/* portfolio start */}
      <Container p="12px" wide>
        <Text font="16px" p="12px 0" bold>
          Welcome {profile.firstName},
        </Text>

        <Container
          color="white"
          radius="8px"
          bg="board"
          display="grid"
          gap="12px"
          wide
        >
          <Container
            p="16px"
            flex="flex-start"
            wide="true"
            to="/dashboard/wallets"
          >
            <Text p="0" bold flexalign>
              <SubText font="24px" p="0" m="0 8px 0 0" opacity="0.6" flexalign>
                <FaWallet />
              </SubText>
              Total Balance
            </Text>
            <Text p="0" m="0 0 0 auto">
              <SubText font="11px" p="0" flexalign>
                <FaChevronRight />
              </SubText>
            </Text>
          </Container>
          <Container p="0 16px" flexCol="flex-start" wide>
            <Text font="20px" p="2px 0" bold>
              {total}
              <SubText font="18px" p="0" m="0 0 0 4px">
                USD
              </SubText>
            </Text>
            <Text font="16px" p="2px 0" bold>
              <SubText font="12px" p="0" m="0 8px 0 0">
                Available
              </SubText>
              {available}
              <SubText font="14px" p="0" m="0 0 0 4px">
                USD
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
              to="/dashboard/wallets"
            >
              <SubText font="11px" p="0" m="0 6px 0 0" flexalign>
                <FaWallet />
              </SubText>
              My Wallets
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
      </Container>
      {/* portfolio end */}

      <Pending />

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

      {/* top wallets start */}
      <Text font="16px" p="0 12px 12px" bold>
        Top Wallets
      </Text>
      <Container p="12px" display="grid" flow="column" gap="12px" scrollX wide>
        {loadingWallets ? (
          Array(3)
            .fill()
            .map((_, i) => <Loader key={i} h="200px" w="280px" radius="8px" />)
        ) : wallets.length ? (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet._id}
              wallet={wallet}
              action={setSelectedWallet}
              to="wallet-preview"
              scrollto="true"
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

      <RecentTransactions />
      <MyWallets />
    </DashboardLayout>
  );
};

export default Dashboard;
