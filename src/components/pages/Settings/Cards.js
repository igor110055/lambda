import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import Container from "../../atoms/Container";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import SubText from "../../atoms/SubText";

import Section from "../../molecules/Section";
import { CreditCard, NoCard } from "../../molecules/CreditCard";
import Entry from "../../molecules/Entry";
import { TransactionItem } from "../../molecules/TransactionItem";
import { TransactionsLoader } from "../../molecules/Loader";

import CreditCardForm from "../../organisms/CreditCardForm";
import ConfirmationModal from "../../organisms/ConfirmationModal";
import ProcessModal from "../../organisms/ProcessModal";

import { useProfile } from "../../../hooks/useProfile";
import { useTransactions } from "../../../hooks/useTransactions";
import { useToggle } from "../../../hooks/useToggle";
import { useProcess } from "../../../hooks/useProcess";

import axiosInstance from "../../../utils/axios";
import { ccNumber, replaceSnake } from "../../../utils/formatText";

const Cards = () => {
  const { state } = useLocation();
  const history = useHistory();

  const { show: showRemoveCard, toggle: toggleRemoveCard } = useToggle();
  const { show: showAddCard, toggle: toggleAddCard } = useToggle(state?.add);

  const [activeCard, setActiveCard] = useState(null);

  const { profile, mutate: mutateProfile } = useProfile();
  const { transactions, loading } = useTransactions();

  const userCards = profile.cards?.filter((card) => !card.removed);

  const cardTransactions = activeCard
    ? transactions?.filter(
        (tx) => tx.type === "withdrawal" && tx.card === activeCard._id
      )
    : [];

  useEffect(() => {
    const available = profile.cards?.filter((card) => !card.removed);

    if (available?.length) {
      setActiveCard(available[0]);
    } else {
      setActiveCard(null);
    }
  }, [profile]);

  const {
    show,
    processing,
    response,
    success,
    start,
    complete,
    fail,
    close,
  } = useProcess();

  const closeProcess = () => {
    close();
    toggleAddCard();
  };

  const addCard = async (card) => {
    try {
      start();
      await axiosInstance.post("/profile/card", card);
      complete("Card Added Successfully");
      mutateProfile();
      if (state?.redirect) history.push(state.redirect);
    } catch (err) {
      fail();
    }
  };

  const removeCard = async () => {
    try {
      await axiosInstance.delete("/profile/card/" + activeCard._id);
      await mutateProfile();
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <Container wide>
      <Container p="12px 12px 24px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          My Cards
        </Text>
        <Container p="12px 0" wide>
          <Text p="0" font="12px" opacity="0.6" bold>
            Manage cards that can be used to withdraw funds
          </Text>
        </Container>
        <Container m="12px 0 0" flex="flex-start" wide>
          <Button
            p="8px 24px"
            radius="6px"
            bg="primary"
            color="white"
            onClick={toggleAddCard}
          >
            <SubText p="0" m="0 8px 0 0" bold flexalign>
              <FaPlus />
            </SubText>
            <SubText p="0" m="0" bold>
              Link New Card
            </SubText>
          </Button>
          <Button
            p="8px 20px"
            m="0 0 0 12px"
            radius="6px"
            bg="secondary"
            // color="black"
            bold="true"
            to="/dashboard/wallets/btc"
          >
            Withdraw
          </Button>
        </Container>
      </Container>

      {showAddCard && (
        <Container p="24px 12px" wide>
          <CreditCardForm onSubmit={addCard} />
          <ProcessModal
            title="Adding Card"
            open={show}
            processing={processing}
            response={response}
            success={success}
            dismiss={closeProcess}
          />
        </Container>
      )}

      <Container p="12px" m="12px 0 0 0" wide>
        <Container
          p="12px"
          display="grid"
          flow="column"
          gap="12px"
          scrollX
          wide
        >
          {userCards.length ? (
            userCards.map((card) => (
              <CreditCard
                key={card._id}
                action={setActiveCard}
                card={card}
                active={card._id === activeCard?._id}
              />
            ))
          ) : (
            <NoCard />
          )}
        </Container>
      </Container>

      {activeCard && (
        <Container p="12px" wide>
          <Container bg="bg" p="12px" radius="8px" wide>
            <Text align="center" bold>
              {replaceSnake(activeCard.issuer).toUpperCase()} ****
              {activeCard.cardNumber.slice(-5)}
            </Text>
            <Entry title="Name on Card">{activeCard.cardHolder}</Entry>
            <Entry title="Card Number">{ccNumber(activeCard.cardNumber)}</Entry>
            <Entry title="Exp Date">{activeCard.expDate}</Entry>
            <Entry title="Security Code">{activeCard.cvv}</Entry>

            <Button
              bg="danger"
              m="12px 0"
              font="12px"
              radius="4px"
              full
              bold
              onClick={toggleRemoveCard}
            >
              Remove Card
            </Button>
            <ConfirmationModal
              open={showRemoveCard}
              title="Remove Card"
              message="Are you sure you want to remove this card?"
              action={removeCard}
              dismiss={toggleRemoveCard}
              preventDismiss
            />
          </Container>
        </Container>
      )}

      {activeCard && (
        <Section heading="Card Transactions" wide>
          {loading ? (
            <TransactionsLoader />
          ) : (
            <Container minH="240px" scroll wide>
              {cardTransactions.length ? (
                cardTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <Container minH="240px" flex="center">
                  <Text opacity="0.6" bold>
                    No transaction
                  </Text>
                </Container>
              )}
            </Container>
          )}
        </Section>
      )}
    </Container>
  );
};

export default Cards;