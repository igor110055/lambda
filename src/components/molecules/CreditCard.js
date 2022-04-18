import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaPlus, FaTrash } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import CardBrand from "../atoms/CardBrand";

import { ccNumber, replaceSnake } from "../../utils/formatText";

const Wrapper = styled(Container)`
  transform: ${({ active }) => (active ? "scale(1)" : "scale(0.95)")};
  transition: transform 0.2s ease-in-out;
  box-shadow: 0px 4px 6px 3px rgba(0, 0, 0, 0.1);
`;

const cardColor = (issuer) => {
  switch (issuer) {
    case "mastercard":
      return { bg: "#3D3A4B", text: "white" };
    case "visa":
      return { bg: "#EFF1ED", text: "black" };
    case "american-express":
      return { bg: "#D8E1FF", text: "black" };
    case "discover":
      return { bg: "#E3D8C9", text: "black" };
    default:
      return { bg: "#321c10", text: "white" };
  }
};

export const CreditCard = ({ card, action, active, ...props }) => {
  const { bg, text } = cardColor(card.issuer);
  return (
    <Wrapper
      p="12px 16px 24px"
      h="200px"
      w="280px"
      radius="14px"
      pointer
      o="hidden"
      position="relative"
      flexCol="flex-start"
      justify="space-between"
      bg={bg}
      color={text}
      active={active}
      onClick={() => (action ? action(card) : undefined)}
      {...props}
    >
      <Container flex="flex-start" align="flex-start" wide>
        <CardBrand size="48px" logo={card.issuer} />
      </Container>
      <Container flexCol="flex-start" wide>
        <Container>
          <Text font="18px" p="0" m="0 0 24px 0" opacity="0.8" bold>
            {ccNumber(card.cardNumber)}
          </Text>
        </Container>
        <Container flex="space-between">
          <Text p="0" opacity="0.8" bold>
            {card.cardHolder}
          </Text>
          <Text font="12px" p="0" opacity="0.8" bold>
            {card.expDate}
          </Text>
        </Container>
      </Container>
    </Wrapper>
  );
};

export const NoCard = () => {
  return (
    <Container
      h="180px"
      w="280px"
      radius="14px"
      pointer
      flex="center"
      bg="secondary"
      color="white"
      // border="1px dashed"
    >
      <Text p="0" font="13px" opacity="0.6">
        No Saved Card
      </Text>
    </Container>
  );
};

export const CreditCardItem = ({ card, action, ...props }) => {
  return (
    <Container
      p="12px"
      m="12px 0"
      border="1px solid"
      radius="12px"
      flex="space-between"
      wide="true"
      onClick={() => (action ? action(card) : undefined)}
      {...props}
    >
      <Container flexCol="flex-start" wide>
        <Text font="13px" p="0" m="0 0 4px 0" bold>
          {replaceSnake(card.issuer).toUpperCase()} ****
          {card.cardNumber.slice(-5)}
        </Text>
        <Text font="10px" p="0" opacity="0.6">
          {card.cardHolder.toUpperCase()}
        </Text>
      </Container>

      <CardBrand size="32px" logo={card.issuer} />
    </Container>
  );
};

export const AddCreditCardItem = ({ card, ...props }) => {
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
        pathname: "/dashboard/settings/cards",
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
        Add New Card
      </SubText>
    </Container>
  );
};

export const DeleteCreditCardItem = ({ card, action, ...props }) => {
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
      onClick={() => (action ? action(card) : undefined)}
      {...props}
    >
      <SubText font="12px" p="0" m="0">
        Delete Card
      </SubText>
      <SubText font="11px" p="0" m="0 0 0 8px" flexalign>
        <FaTrash />
      </SubText>
    </Container>
  );
};
