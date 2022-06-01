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
      heading="Your Wallets"
      wide
      p="0"
      hStyles={{
        p: "0 12px"
      }}
      {...props}
    >
      {loading ? (
        <Container p="0 12px" wide>
          <WalletItemFullCardLoader />
        </Container>
      ) : wallets.length ? (
        <Container p="0 12px" wide>
          {wallets.map((wallet) => (
            <WalletItemFullCard key={wallet._id} wallet={wallet} />
          ))}
        </Container>
      ) : (
        <Container minH="240px" p="0 12px" flex="center">
          <Text opacity="0.6" bold>
            No Wallets
          </Text>
        </Container>
      )}
    </Section>
  );
};

export default MyWallets;
