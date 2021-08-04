import React, { useState } from "react";
import { FaChevronLeft, FaCreditCard, FaUniversity } from "react-icons/fa";

import Container from "../atoms/Container";
import SubText from "../atoms/SubText";
import Text from "../atoms/Text";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { CreditCardItem, AddCreditCardItem } from "../molecules/CreditCard";
import { BankItem, AddBankItem } from "../molecules/Bank";
import Modal from "../molecules/Modal";

const ViewButton = ({ title, icon, ...props }) => (
  <Container
    p="14px"
    m="12px 0"
    bg="bg"
    radius="12px"
    flex="center"
    pointer
    wide
    {...props}
  >
    <SubText font="12px" p="0" m="0">
      {title}
    </SubText>
    <SubText font="11px" p="0" m="0 0 0 8px" flexalign>
      {icon}
    </SubText>
  </Container>
);

const WithdrawalPicker = ({
  title,
  cards = [],
  banks = [],
  action: cb,
  open,
  dismiss: dismissModal,
  noadd,
}) => {
  const [view, setView] = useState("intro");

  const dismiss = () => {
    dismissModal();
    setView("intro");
  };

  const action = (selected, type) => {
    cb({ selected, type });
    dismiss();
  };

  const bankWithdrawal =
    process.env.REACT_APP_BANK_WITHDRAWAL?.toLowerCase() === "true";

  return (
    <Modal open={open} dismiss={dismiss}>
      <Container
        flexCol="center"
        w="95%"
        h="400px"
        maxW="480px"
        maxH="80vh"
        bg="bgContrast"
        p="12px"
        radius="12px"
      >
        <Container position="relative" wide>
          <Container
            display={view !== "intro" ? "block" : "none"}
            position="absolute"
            top="8px"
            left="4px"
            w="24px"
            h="24px"
            onClick={() => setView("intro")}
          >
            <FaChevronLeft />
          </Container>
          <Text align="center" font="14px" p="8px 0 20px" bold>
            {title || "Withdrawal Method"}
          </Text>
        </Container>
        {view === "intro" ? (
          <Container flexCol="center" h="calc(100% - 48px)" scroll>
            <ViewButton
              title="Withdraw to Card"
              icon={<FaCreditCard />}
              onClick={() => setView("card")}
            />
            {bankWithdrawal && (
              <ViewButton
                title="Withdraw to Bank"
                icon={<FaUniversity />}
                onClick={() => setView("bank")}
              />
            )}
            <ViewButton
              title="Withdraw to Wallet Address"
              icon={<FaCreditCard />}
              onClick={() => setView("address")}
            />
          </Container>
        ) : view === "card" ? (
          <Cards cards={cards} action={action} noadd={noadd} />
        ) : view === "bank" ? (
          <Banks banks={banks} action={action} noadd={noadd} />
        ) : (
          view === "address" && <Address action={action} />
        )}
      </Container>
    </Modal>
  );
};

function Cards({ cards, action: parentAction, noadd }) {
  const action = (selected) => parentAction(selected, "card");

  return (
    <Container h="calc(100% - 48px)" scroll>
      {cards
        .filter((c) => !c.removed)
        .map((card) => (
          <CreditCardItem key={card._id} nolink action={action} card={card} />
        ))}
      {!noadd && <AddCreditCardItem />}
      {!cards.length && (
        <Container minH="120px" flex="center" wide>
          <Text opacity="0.6" bold>
            No card
          </Text>
        </Container>
      )}
    </Container>
  );
}

function Banks({ banks, action: parentAction, noadd }) {
  const action = (selected) => parentAction(selected, "bank");

  return (
    <Container h="calc(100% - 48px)" scroll>
      {banks
        .filter((b) => !b.removed)
        .map((bank) => (
          <BankItem key={bank._id} nolink action={action} bank={bank} />
        ))}
      {!noadd && <AddBankItem />}
      {!banks.length && (
        <Container minH="120px" flex="center" wide>
          <Text opacity="0.6" bold>
            No bank linked
          </Text>
        </Container>
      )}
    </Container>
  );
}

function Address({ action: parentAction }) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError(null);
    setAddress(e.target.value);
  };

  const action = () => {
    if (!address) return setError("Please Enter Wallet Address");
    parentAction("address://" + address, "address");
  };

  return (
    <Container h="calc(100% - 48px)" flexCol="center">
      <Input
        radius="8px"
        label="Wallet Address"
        placeholder="Enter wallet address"
        onChange={handleChange}
        value={address}
        error={error}
      />
      <Button bg="primary" full m="12px 0" radius="8px" onClick={action}>
        Done
      </Button>
    </Container>
  );
}

export default WithdrawalPicker;
