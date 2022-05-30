import React from "react";
import styled from "styled-components";

import Container from "../atoms/Container";
import Text from "../atoms/Text";

import { WalletItem } from "../molecules/WalletItem";
import { WalletItemLoader } from "../molecules/Loader";
import ProfilePic from "../molecules/ProfilePic";

import { useWallets } from "../../hooks/useWallets";
import { useProfile } from "../../hooks/useProfile";

import { capitalise } from "../../utils/formatText";

const Wrapper = styled.div`
  grid-area: userbar;

  position: relative;
  height: 100%;

  /* background-color: ${({ theme }) => theme.colors.bgContrast}; */

  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }

  border-radius: 8px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const Userbar = () => {
  const { profile } = useProfile();
  const { wallets, loading: loadingWallets } = useWallets();

  return (
    <Container as="aside" z="1" wide o="hidden">
      <Wrapper open>
        <Container bg="bgContrast" p="12px" radius="8px" wide>
          {/* profile start */}
          <Container p="12px" flexCol="center" wide>
            <ProfilePic size="48px" />
            <Text
              p="0"
              m="12px 0 4px"
              font="12px"
              bold="true"
              flexalign="true"
              opacity="0.6"
            >
              {profile.fullName}
            </Text>
            <Text p="0" font="10px" bold="true" flexalign="true" opacity="0.4">
              {capitalise(profile.plan)}
            </Text>
          </Container>
          {/* profile end */}
        </Container>

        <Container
          bg="bgContrast"
          p="12px"
          m="12px 0 0"
          maxH="calc(100% - 230px - 12px)"
          radius="8px"
          scroll
          wide
        >
          {/* wallets start */}
          {loadingWallets ? (
            <WalletItemLoader />
          ) : wallets.length ? (
            wallets.map((wallet) => (
              <WalletItem key={wallet._id} wallet={wallet} />
            ))
          ) : (
            <Container flex="center">
              <Text opacity="0.6" bold>
                No Wallets
              </Text>
            </Container>
          )}
          {/* wallets end */}
        </Container>
      </Wrapper>
    </Container>
  );
};

export default Userbar;
