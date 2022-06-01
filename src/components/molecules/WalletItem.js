import React from "react";
import { FaArrowUp, FaChevronRight, FaPlus } from "react-icons/fa";

import Container from "../atoms/Container";
import WalletIcon from "../atoms/WalletIcon";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import ChangeIcon from "../atoms/ChangeIcon";

import { useWalletBalance } from "../../hooks/useBalance";
import { useCoinValue } from "../../hooks/useCoinValue";

import { rawBalance } from "../../utils/parseBalance";

export const WalletItem = ({ wallet, ...props }) => {
  const { rate, change } = useCoinValue(wallet?.symbol);
  const negative = rawBalance(change) < 0;

  return (
    <Container
      p="12px 0"
      flex="space-between"
      pointer="pointer"
      wide="wide"
      to={`/dashboard/wallets/${wallet.symbol.toLowerCase()}`}
      {...props}
    >
      <WalletIcon symbol={wallet.symbol} />
      <Container
        w="calc(100% - 36px)"
        p="2px 0px 2px 12px"
        h="36px"
        flex="space-between"
      >
        <Container flexCol="flex-start" justify="space-between" o="hidden">
          <Text font="13px" p="0" bold>
            {wallet.name}
          </Text>
          <Text font="12px" p="0" opacity="0.6" bold>
            $ {rate}
          </Text>
        </Container>
        <Container flexCol="flex-end" justify="center">
          <Text
            font="10px"
            p="0"
            color={negative ? "danger" : "success"}
            flexalign
            bold
          >
            {negative ? "" : "+"} {change}%
            <ChangeIcon negative={negative ? "true" : undefined} />
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export const AdminWalletItem = ({
  wallet,
  nolink,
  action,
  placeholder,
  ...props
}) => {
  return (
    <Container
      p="12px 0"
      flex="space-between"
      pointer="true"
      wide="true"
      to={
        !nolink
          ? `/dashboard/admin/wallets/${wallet.symbol.toLowerCase()}`
          : undefined
      }
      onClick={action ? () => action(wallet) : undefined}
      {...props}
    >
      <WalletIcon symbol={wallet.symbol} />
      <Container
        w="calc(100% - 36px)"
        p="2px 0px 2px 12px"
        h="36px"
        flex="space-between"
      >
        <Container flexCol="flex-start" o="hidden">
          <Text font="13px" p="0" bold>
            {wallet.name}
          </Text>
        </Container>
        <Container flexCol="flex-end">
          <Text font="12px" p="0">
            {placeholder || wallet.symbol}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export const WalletItemCard = ({ wallet, ...props }) => {
  const { total } = useWalletBalance(wallet.symbol);

  return (
    <Container
      p="20px 18px"
      m="0 0 12px 0"
      radius="8px"
      bg="bg"
      pointer="pointer"
      display="grid"
      gap="16px"
      wide="wide"
      to={`/dashboard/wallets/${wallet.symbol.toLowerCase()}`}
      {...props}
    >
      <Container flex="flex-start" wide>
        <WalletIcon symbol={wallet.symbol} size="24px" />
        <Text m="0 0 0 8px" font="13px" p="0" bold>
          {wallet.name} Wallet
        </Text>
      </Container>
      <Container flex="flex-start" wide>
        <Text font="16px" p="0" bold>
          {total}
          <SubText p="0" m="0 0 0 4px">
            USD
          </SubText>
        </Text>
      </Container>
    </Container>
  );
};

export const AdminWalletItemCard = ({
  wallet,
  nolink,
  placeholder,
  ...props
}) => {
  return (
    <Container
      p="20px 18px"
      m="0 0 12px 0"
      radius="8px"
      bg="bg"
      pointer="pointer"
      display="grid"
      gap="16px"
      wide="wide"
      to={
        !nolink
          ? `/dashboard/admin/wallets/${wallet.symbol.toLowerCase()}`
          : undefined
      }
      {...props}
    >
      <Container flex="flex-start" wide>
        <WalletIcon symbol={wallet.symbol} size="24px" />
        <Text m="0 0 0 8px" font="13px" p="0" bold flexalign>
          {wallet.name} Wallet{" "}
          {placeholder && (
            <SubText p="0" font="12px" m="0 0 0 8px">
              {placeholder}
            </SubText>
          )}
        </Text>
        <Text p="0" m="0 0 0 auto">
          <SubText font="11px" p="0" flexalign>
            <FaChevronRight />
          </SubText>
        </Text>
      </Container>
    </Container>
  );
};

export const WalletItemFullCard = ({ wallet, ...props }) => {
  const { total } = useWalletBalance(wallet.symbol);
  const { amount } = useCoinValue(wallet?.symbol, total);

  return (
    <Container
      m="0 0 24px 0"
      radius="16px"
      bg="bg"
      display="grid"
      gap="12px"
      wide="wide"
      shadow
      {...props}
    >
      <Container
        p="16px"
        flex="flex-start"
        wide="true"
        to={`/dashboard/wallets/${wallet.symbol.toLowerCase()}`}
      >
        <WalletIcon symbol={wallet.symbol} size="32px" />
        <Text m="0 0 0 12px" p="0" bold>
          {wallet.name} Wallet
        </Text>
      </Container>
      <Container p="0 16px" flexCol="flex-start" wide>
        <Text font="16px" p="2px 0" bold>
          {amount}
          <SubText p="0" m="0 0 0 4px">
            {wallet.symbol}
          </SubText>
        </Text>
        <Text font="13px" p="2px 0" bold>
          <SubText font="10px" p="0" m="0 4px 0 0">
            Balance in USD
          </SubText>
          {total}
          <SubText font="inherit" p="0" m="0 0 0 4px">
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
          to={`/dashboard/wallets/${wallet.symbol.toLowerCase()}/deposit`}
        >
          <SubText font="11px" p="0" m="0 4px 0 0" flexalign>
            <FaPlus />
          </SubText>
          Deposit
        </Text>
        <Text
          font="12px"
          p="0"
          flexalign="true"
          to={{
            pathname: "/dashboard/wallets/withdraw",
            state: {
              wallet: wallet.symbol,
            },
          }}
        >
          <SubText font="11px" p="0" m="0 4px 0 0" flexalign>
            <FaArrowUp />
          </SubText>
          Withdraw
        </Text>
      </Container>
    </Container>
  );
};
