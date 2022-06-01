import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaPlus, FaTrash } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import BankBrand, { BankDefaultBrand } from "../atoms/BankBrand";

const Wrapper = styled(Container)`
  transform: ${({ active }) => (active ? "scale(1)" : "scale(0.95)")};
  transition: transform 0.2s ease-in-out;
  box-shadow: 0px 4px 6px 3px rgba(0, 0, 0, 0.1);
`;

export const Bank = ({ bank, action, active, ...props }) => {
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
      bg={active ? "primary" : "actionBg"}
      color="white"
      active={active}
      onClick={() => (action ? action(bank) : undefined)}
      {...props}
    >
      <Container flex="flex-start" align="flex-start" wide>
        <BankDefaultBrand size="36px" color="white" />
      </Container>
      <Container flexCol="flex-start" wide>
        <Container>
          <Text font="16px" p="0" m="0 0 24px 0" opacity="0.8" bold>
            {bank.accountName}
          </Text>
          <Text font="14px" p="0" m="0 0 24px 0" opacity="0.8" bold>
            {bank.accountNumber}
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
      border="1px dashed"
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
      <BankBrand />
      <Container
        w="calc(100% - 36px)"
        p="2px 0px 2px 12px"
        h="36px"
        flex="space-between"
      >
        <Container flexCol="flex-start" o="hidden">
          <Text font="13px" p="0" bold>
            {bank.accountName}
          </Text>
        </Container>
        <Container flexCol="flex-end">
          <Text font="12px" p="0">
            {bank.bank.toUpperCase()}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export const BankItem = ({ bank, action, ...props }) => {

  return (
    <Container
      p="12px"
      m="12px 0"
      border="1px solid"
      radius="4px"
      flex="space-between"
      wide="true"
      onClick={() => (action ? action(bank) : undefined)}
      {...props}
    >
      <Container flexCol="flex-start" wide>
        <Text font="13px" p="0" m="0 0 4px 0" bold>
          {bank.accountName}
        </Text>
        <Text font="10px" p="0" opacity="0.6">
          {bank.bank.toUpperCase()}
        </Text>
      </Container>

      <BankDefaultBrand size="26px" />
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
