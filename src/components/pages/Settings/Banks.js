import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import Container from "../../atoms/Container";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import SubText from "../../atoms/SubText";

import Section from "../../molecules/Section";
import { Bank, NoBank } from "../../molecules/Bank";
import Entry from "../../molecules/Entry";
import { TransactionItem } from "../../molecules/TransactionItem";
import { TransactionsLoader } from "../../molecules/Loader";

import BankForm from "../../organisms/BankForm";
import ConfirmationModal from "../../organisms/ConfirmationModal";
import ProcessModal from "../../organisms/ProcessModal";

import { useProfile } from "../../../hooks/useProfile";
import { useTransactions } from "../../../hooks/useTransactions";
import { useToggle } from "../../../hooks/useToggle";
import { useProcess } from "../../../hooks/useProcess";

import axiosInstance from "../../../utils/axios";

const Banks = () => {
  const { state } = useLocation();
  const history = useHistory();

  const { show: showRemoveBank, toggle: toggleRemoveBank } = useToggle();
  const { show: showAddBank, toggle: toggleAddBank } = useToggle(state?.add);

  const [activeBank, setActiveBank] = useState(null);

  const { profile, mutate: mutateProfile } = useProfile();
  const { transactions, loading } = useTransactions();

  const userBanks = profile.banks?.filter((bank) => !bank.removed);

  const bankTransactions = activeBank
    ? transactions?.filter(
        (tx) => tx.type === "withdrawal" && tx.method === activeBank._id
      )
    : [];

  useEffect(() => {
    const available = profile.banks?.filter((bank) => !bank.removed);

    if (available?.length) {
      setActiveBank(available[0]);
    } else {
      setActiveBank(null);
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
    toggleAddBank();
  };

  const addBank = async ({ bankName, ...bank }) => {
    if (bankName) bank.bank = bankName;
    try {
      start();
      await axiosInstance.post("/profile/bank", bank);
      complete("Bank Linked Successfully");
      mutateProfile();
      if (state?.redirect) history.push(state.redirect);
    } catch (err) {
      console.log(err.response);
      fail();
    }
  };

  const removeBank = async () => {
    try {
      await axiosInstance.delete("/profile/bank/" + activeBank._id);
      await mutateProfile();
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <Container wide>
      <Container p="12px 12px 24px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Linked Banks
        </Text>
        <Container p="12px 0" wide>
          <Text p="0" font="12px" opacity="0.6" bold>
            Manage banks linked to your account
          </Text>
        </Container>
        <Container m="12px 0 0" flex="flex-start" wide>
          <Button
            p="8px 24px"
            radius="6px"
            bg="primary"
            color="white"
            onClick={toggleAddBank}
          >
            <SubText p="0" m="0 8px 0 0" bold flexalign>
              <FaPlus />
            </SubText>
            <SubText p="0" m="0" bold>
              Link Bank
            </SubText>
          </Button>
          <Button
            p="8px 20px"
            m="0 0 0 12px"
            radius="6px"
            bg="secondary"
            // color="black"
            bold="true"
            to="/dashboard/wallets/withdraw"
          >
            Withdraw
          </Button>
        </Container>
      </Container>

      {showAddBank && (
        <Container p="24px 12px" wide>
          <BankForm onSubmit={addBank} />
          <ProcessModal
            title="Linking Bank"
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
          {userBanks.length ? (
            userBanks.map((bank) => (
              <Bank
                key={bank._id}
                action={setActiveBank}
                bank={bank}
                active={bank._id === activeBank?._id}
              />
            ))
          ) : (
            <NoBank />
          )}
        </Container>
      </Container>

      {activeBank && (
        <Container p="12px" wide>
          <Container bg="bg" p="12px" radius="8px" wide>
            <Text align="center" bold>
              {activeBank.bank.toUpperCase()}
            </Text>
            <Entry title="Account Name">{profile.fullName}</Entry>
            <Entry title="User ID">{activeBank.userId}</Entry>
            <Entry title="Bank">{activeBank.bank}</Entry>

            <Button
              bg="danger"
              m="12px 0"
              font="12px"
              radius="4px"
              full
              bold
              onClick={toggleRemoveBank}
            >
              Remove Bank
            </Button>
            <ConfirmationModal
              open={showRemoveBank}
              title="Unlink Bank"
              message="Are you sure you want to unlink this bank?"
              action={removeBank}
              dismiss={toggleRemoveBank}
              preventDismiss
            />
          </Container>
        </Container>
      )}

      {activeBank && (
        <Section heading="Bank Transactions" wide>
          {loading ? (
            <TransactionsLoader />
          ) : (
            <Container minH="240px" scroll wide>
              {bankTransactions.length ? (
                bankTransactions.map((transaction) => (
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

export default Banks;
