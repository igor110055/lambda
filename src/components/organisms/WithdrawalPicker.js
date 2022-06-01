import React, { useState } from "react";
import {
  FaChevronLeft,
  FaUniversity,
} from "react-icons/fa";

import Container from "../atoms/Container";
import SubText from "../atoms/SubText";
import Text from "../atoms/Text";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { BankItem, AddBankItem } from "../molecules/Bank";
import Modal from "../molecules/Modal";
import WalletInput from "../molecules/WalletInput";

import supportedWallets from "../../store/supportedWallets";

const ViewButton = ({ title, icon, ...props }) => (
  <Container
    p="24px"
    m="12px 0"
    border="1px solid"
    radius="4px"
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
  const [view, setView] = useState("bank");

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
            {bankWithdrawal && (
              <ViewButton
                title="Withdraw to Bank"
                icon={<FaUniversity />}
                onClick={() => setView("bank")}
              />
            )}
          </Container>
        ) : view === "bank" ? (
          <Banks banks={banks} action={action} noadd={noadd} />
        ) : view === "address" ? (
          <Address banks={banks} action={action} noadd={noadd} />
        ) : null}
      </Container>
    </Modal>
  );
};

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
  const [address, setAddress] = useState({ value: "", error: null });
  const [wallet, setWallet] = useState({ value: "BTC", error: null });

  const handleAddressChange = (e) => {
    setAddress({ error: null, value: e.target.value });
  };

  const handleWalletChange = (e) => {
    setWallet({ error: null, value: e.target.value });
  };

  const action = () => {
    if (!address.value)
      return setAddress((a) => ({
        ...a,
        error: "Please Enter Wallet Address",
      }));
    if (!wallet.value)
      return setWallet((w) => ({ ...w, error: "Please Select Wallet" }));
    parentAction({ value: address.value, wallet: wallet.value }, "address");
  };

  return (
    <Container h="calc(100% - 48px)" flexCol="center">
      <Input
        radius="8px"
        label="Wallet Address"
        placeholder="Enter wallet address"
        onChange={handleAddressChange}
        value={address.value}
        error={address.error}
      />
      <WalletInput
        label="Select wallet"
        onChange={handleWalletChange}
        wallet={wallet.value}
        wallets={supportedWallets}
        error={wallet.error}
      />
      <Button bg="primary" full m="12px 0" radius="8px" onClick={action}>
        Done
      </Button>
    </Container>
  );
}

export default WithdrawalPicker;
