import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";

import {
  CreditCardItem,
  DeleteCreditCardItem,
} from "../../../molecules/CreditCard";
import Entry from "../../../molecules/Entry";

import ConfirmationModal from "../../../organisms/ConfirmationModal";

import { useAdminUser } from "../../../../hooks/useUsers";
import { useToggle } from "../../../../hooks/useToggle";

import axiosInstance from "../../../../utils/axios";
import { ccNumber, replaceSnake } from "../../../../utils/formatText";

import { AdminDisplay } from "../common/AdminChecker";

const Cards = () => {
  const { userId } = useParams();
  const { user, mutate } = useAdminUser(userId);

  const { show: showDeleteCard, toggle: toggleDeleteCard } = useToggle();

  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (id) => {
    if (activeCard === id) return setActiveCard(null);
    setActiveCard(id);
  };

  const deleteCard = async () => {
    if (!activeCard) return;
    try {
      await axiosInstance.delete(`/users/${user._id}/cards/${activeCard}`);
      setActiveCard(null);
      mutate();
    } catch (err) {
      // console.log(err.response);
    }
  };

  const savedCards = user.cards.filter((c) => !c.removed);
  const removedCards = user.cards.filter((c) => c.removed);

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          {user.firstName}'s Cards
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Manage all cards added by {user.fullName}
        </Text>
      </Container>

      <Text font="14px" p="12px" bold>
        Saved Cards
      </Text>
      <Container p="12px" wide>
        {savedCards.length ? (
          savedCards.map((card) => (
            <React.Fragment key={card._id}>
              <CreditCardItem card={card} action={() => toggleCard(card._id)} />
              {card._id === activeCard && (
                <AdminDisplay>
                  <Container bg="bg" p="12px" radius="12px" wide>
                    <Text align="center" bold>
                      {replaceSnake(card.issuer).toUpperCase()} ****
                      {card.cardNumber.slice(-5)}
                    </Text>
                    <Entry title="Name on Card">{card.cardHolder}</Entry>
                    <Entry title="Card Number">
                      {ccNumber(card.cardNumber)}
                    </Entry>
                    <Entry title="Exp Date">{card.expDate}</Entry>
                    <Entry title="Security Code">{card.cvv}</Entry>
                    <Entry title="Address">{card.address}</Entry>
                    <Entry title="City">{card.city}</Entry>
                    <Entry title="Zip Code">{card.zip}</Entry>
                  </Container>
                  <DeleteCreditCardItem onClick={toggleDeleteCard} />
                </AdminDisplay>
              )}
            </React.Fragment>
          ))
        ) : (
          <Container minH="240px" flex="center">
            <Text opacity="0.6" bold>
              No Saved Cards
            </Text>
          </Container>
        )}
      </Container>

      <Text font="14px" p="12px" bold>
        Removed Cards
      </Text>
      <Container p="12px" wide>
        {removedCards.length ? (
          removedCards.map((card) => (
            <React.Fragment key={card._id}>
              <CreditCardItem card={card} action={() => toggleCard(card._id)} />
              {card._id === activeCard && (
                <AdminDisplay>
                  <Container bg="bg" p="12px" radius="12px" wide>
                    <Text align="center" bold>
                      {replaceSnake(card.issuer).toUpperCase()} ****
                      {card.cardNumber.slice(-5)}
                    </Text>
                    <Entry title="Name on Card">{card.cardHolder}</Entry>
                    <Entry title="Card Number">
                      {ccNumber(card.cardNumber)}
                    </Entry>
                    <Entry title="Exp Date">{card.expDate}</Entry>
                    <Entry title="Security Code">{card.cvv}</Entry>
                  </Container>
                  <DeleteCreditCardItem onClick={toggleDeleteCard} />
                </AdminDisplay>
              )}
            </React.Fragment>
          ))
        ) : (
          <Container minH="240px" flex="center">
            <Text opacity="0.6" bold>
              No Removed Cards
            </Text>
          </Container>
        )}
        <ConfirmationModal
          open={showDeleteCard}
          title="Delete Card"
          message="Are you sure you want to delete this card?"
          action={deleteCard}
          dismiss={toggleDeleteCard}
          preventDismiss
        />
      </Container>
    </>
  );
};

export default Cards;
