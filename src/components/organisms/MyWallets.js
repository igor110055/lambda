import React from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";

import Section from "../molecules/Section";
import { WalletItemFullCard } from "../molecules/WalletItem";
import { WalletItemFullCardLoader } from "../molecules/Loader";

import { useWallets } from "../../hooks/useWallets";

const MyWallets = (props) => {
  const { wallets, loading } = useWallets();

  return (
    <Section
      heading="My Wallets"
      wide
      text={{
        name: "View All",
        color: "grey",
        p: "0",
        to: "/dashboard/wallets",
      }}
      {...props}
    >
      {loading ? (
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
    </Section>
  );
};

export default MyWallets;
