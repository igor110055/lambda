import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaPlus, FaTrash } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import BankBrand, { BankDefaultBrand } from "../atoms/BankBrand";

import supportedBanks from "../../store/supportedBanks";

const Wrapper = styled(Container)`
  transform: ${({ active }) => (active ? "scale(1)" : "scale(0.95)")};
  transition: transform 0.2s ease-in-out;
  box-shadow: 0px 4px 6px 3px rgba(0, 0, 0, 0.1);
`;

const bankColor = (name) => {
  const bank = supportedBanks.find((b) => b.name === name);
  return bank
    ? { bg: bank?.color, text: "black" }
    : { bg: "#EFF1ED", text: "black" };
};

export const Bank = ({ bank, action, active, ...props }) => {
  const { bg, text } = bankColor(bank.bank);
  return (
    <Wrapper
      p="12px 16px 24px"
      h="220px"
      w="200px"
      radius="14px"
      pointer
      o="hidden"
      position="relative"
      flexCol="flex-start"
      justify="space-between"
      bg={bg}
      color={text}
      active={active}
      onClick={() => (action ? action(bank) : undefined)}
      {...props}
    >
      <Container flex="flex-start" align="flex-start" wide>
        <BankDefaultBrand size="36px" color={text} />
      </Container>
      <Container flexCol="flex-start" wide>
        <Container>
          <Text font="18px" p="0" m="0 0 24px 0" opacity="0.8" bold>
            {bank.userId}
          </Text>
        </Container>
        <Container flex="space-between">
          <Text p="0" opacity="0.8" bold>
            {bank.bank.toUpperCase()}
          </Text>
        </Container>
      </Container>
    </Wrapper>
  );
};

export const NoBank = () => {
  return (
    <Container
      h="220px"
      w="200px"
      radius="14px"
      pointer
      flex="center"
      bg="secondary"
      color="white"
      // border="1px dashed"
    >
      <Text p="0" font="13px" opacity="0.6">
        No Linked Bank
      </Text>
    </Container>
  );
};

export const AdminBankItem = ({ bank, action, ...props }) => {
  return (
    <Container
      p="12px 0"
      flex="space-between"
      pointer="true"
      wide="true"
      onClick={action ? () => action(bank) : undefined}
      {...props}
    >
      <BankBrand logo={bank.name} />
      <Container
        w="calc(100% - 36px)"
        p="2px 0px 2px 12px"
        h="36px"
        flex="space-between"
      >
        <Container flexCol="flex-start" o="hidden">
          <Text font="13px" p="0" bold>
            {bank.name}
          </Text>
        </Container>
        <Container flexCol="flex-end">
          <Text font="12px" p="0">
            {bank.code.toUpperCase()}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export const BankItem = ({ bank, action, ...props }) => {
  const selectedBank = supportedBanks.find((b) => b.name === bank.bank);

  return (
    <Container
      p="12px"
      m="12px 0"
      border="1px solid"
      radius="12px"
      flex="space-between"
      wide="true"
      onClick={() => (action ? action(bank) : undefined)}
      {...props}
    >
      <Container flexCol="flex-start" wide>
        <Text font="13px" p="0" m="0 0 4px 0" bold>
          {bank.userId}
        </Text>
        <Text font="10px" p="0" opacity="0.6">
          {bank.bank.toUpperCase()}
        </Text>
      </Container>

      <BankDefaultBrand size="26px" logo={bank.bank} bg={selectedBank?.color} />
    </Container>
  );
};

export const AddBankItem = ({ bank, ...props }) => {
  const { pathname } = useLocation();

  return (
    <Container
      p="12px"
      m="12px 0"
      bg="bg"
      radius="12px"
      flex="center"
      pointer="true"
      wide="true"
      to={{
        pathname: "/dashboard/settings/banks",
        state: {
          add: true,
          redirect: pathname,
        },
      }}
      {...props}
    >
      <SubText font="11px" p="0" m="0 8px 0 0" flexalign>
        <FaPlus />
      </SubText>
      <SubText font="12px" p="0" m="0">
        Link New Bank
      </SubText>
    </Container>
  );
};

export const DeleteBankItem = ({ bank, action, ...props }) => {
  return (
    <Container
      p="12px"
      m="12px 0"
      bg="bg"
      color="danger"
      radius="12px"
      flex="center"
      pointer
      wide="true"
      onClick={() => (action ? action(bank) : undefined)}
      {...props}
    >
      <SubText font="12px" p="0" m="0">
        Delete Bank
      </SubText>
      <SubText font="11px" p="0" m="0 0 0 8px" flexalign>
        <FaTrash />
      </SubText>
    </Container>
  );
};
