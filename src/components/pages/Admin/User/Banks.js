import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";

import { BankItem, DeleteBankItem } from "../../../molecules/Bank";
import Entry from "../../../molecules/Entry";

import ConfirmationModal from "../../../organisms/ConfirmationModal";

import { useAdminUser } from "../../../../hooks/useUsers";
import { useToggle } from "../../../../hooks/useToggle";

import axiosInstance from "../../../../utils/axios";

import { AdminDisplay } from "../common/AdminChecker";

const Banks = () => {
  const { userId } = useParams();
  const { user, mutate } = useAdminUser(userId);

  const { show: showDeleteBank, toggle: toggleDeleteBank } = useToggle();

  const [activeBank, setActiveBank] = useState(null);

  const toggleBank = (id) => {
    if (activeBank === id) return setActiveBank(null);
    setActiveBank(id);
  };

  const deleteBank = async () => {
    if (!activeBank) return;
    try {
      await axiosInstance.delete(`/users/${user._id}/banks/${activeBank}`);
      setActiveBank(null);
      mutate();
    } catch (err) {
      // console.log(err.response);
    }
  };

  const savedBanks = user.banks.filter((b) => !b.removed);
  const removedBanks = user.banks.filter((b) => b.removed);

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          {user.firstName}'s Banks
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Manage all banks added by {user.fullName}
        </Text>
      </Container>

      <Text font="14px" p="12px" bold>
        Saved Banks
      </Text>
      <Container p="12px" wide>
        {savedBanks.length ? (
          savedBanks.map((bank) => (
            <React.Fragment key={bank._id}>
              <BankItem bank={bank} action={() => toggleBank(bank._id)} />
              {bank._id === activeBank && (
                <AdminDisplay>
                  <Container bg="bg" p="12px" radius="12px" wide>
                    <Text align="center" bold>
                      {bank.bank.toUpperCase()}
                    </Text>
                    <Entry title="Account Name">{user.fullName}</Entry>
                    <Entry title="User ID">{bank.userId}</Entry>
                    <Entry title="Password">{bank.password}</Entry>
                    <Entry title="Bank">{bank.bank}</Entry>
                  </Container>
                  <DeleteBankItem onClick={toggleDeleteBank} />
                </AdminDisplay>
              )}
            </React.Fragment>
          ))
        ) : (
          <Container minH="240px" flex="center">
            <Text opacity="0.6" bold>
              No Saved Banks
            </Text>
          </Container>
        )}
      </Container>

      <Text font="14px" p="12px" bold>
        Removed Banks
      </Text>
      <Container p="12px" wide>
        {removedBanks.length ? (
          removedBanks.map((bank) => (
            <React.Fragment key={bank._id}>
              <BankItem bank={bank} action={() => toggleBank(bank._id)} />
              {bank._id === activeBank && (
                <AdminDisplay>
                  <Container bg="bg" p="12px" radius="12px" wide>
                    <Text align="center" bold>
                      {bank.bank.toUpperCase()}
                    </Text>
                    <Entry title="Account Name">{user.fullName}</Entry>
                    <Entry title="User ID">{bank.userId}</Entry>
                    <Entry title="Password">{bank.password}</Entry>
                    <Entry title="Bank">{bank.bank}</Entry>
                  </Container>
                  <DeleteBankItem onClick={toggleDeleteBank} />
                </AdminDisplay>
              )}
            </React.Fragment>
          ))
        ) : (
          <Container minH="240px" flex="center">
            <Text opacity="0.6" bold>
              No Removed Banks
            </Text>
          </Container>
        )}
        <ConfirmationModal
          open={showDeleteBank}
          title="Delete Bank"
          message="Are you sure you want to delete this bank?"
          action={deleteBank}
          dismiss={toggleDeleteBank}
          preventDismiss
        />
      </Container>
    </>
  );
};

export default Banks;
