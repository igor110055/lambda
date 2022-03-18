import React from "react";
import styled from "styled-components";
import { useBalance } from "../../hooks/useBalance";
import { useProfile } from "../../hooks/useProfile";
import { useWallets } from "../../hooks/useWallets";
import { capitalise } from "../../utils/formatText";
import Container from "../atoms/Container";
import Text from "../atoms/Text";
import { WalletItemLoader } from "../molecules/Loader";
import ProfilePic from "../molecules/ProfilePic";
import { WalletItem } from "../molecules/WalletItem";

const Wrapper = styled.div`
  grid-area: userbar;

  position: relative;
  height: 100%;

  /* background-color: ${({ theme }) => theme.colors.bgContrast}; */

  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }

  border-radius: 6px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const Userbar = () => {
  const { profile } = useProfile();
  const { total, available } = useBalance();
  const { wallets, loading: loadingWallets } = useWallets();

  return (
    <Container as="aside" z="1" wide o="hidden">
      <Wrapper open>
        <Container bg="bgContrast" p="12px" radius="6px" wide>
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

          {/* balance start */}
          <Container
            p="12px"
            m="12px 0"
            radius="8px"
            flex="space-between"
            bg="bg"
            wide
          >
            <Container flexCol="flex-start">
              <Text font="10px" p="0 4px" opacity="0.6" bold>
                Total Balance
              </Text>
              <Text font="18px" p="12px 0 0" bold>
                $ {total}
              </Text>
            </Container>
            <Container flexCol="flex-end">
              <Text font="10px" p="0 4px" opacity="0.6" bold>
                Available Balance
              </Text>
              <Text font="18px" p="12px 0 0" bold>
                $ {available}
              </Text>
            </Container>
          </Container>
          {/* balance end */}
        </Container>

        <Container
          bg="bgContrast"
          p="12px"
          m="12px 0 0"
          maxH="calc(100% - 230px - 12px)"
          radius="6px"
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
