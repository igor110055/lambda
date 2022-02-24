import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaWallet } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import PreLoader from "../../../../atoms/PreLoader";
import Container from "../../../../atoms/Container";
import Text from "../../../../atoms/Text";
import Input from "../../../../atoms/Input";
import Select from "../../../../atoms/Select";
import Checkbox from "../../../../atoms/Checkbox";
import Button from "../../../../atoms/Button";
import Spinner from "../../../../atoms/Spinner";

import Entry from "../../../../molecules/Entry";
import ControlledDateInput from "../../../../molecules/ControlledDateInput";
import ControlledWalletInput from "../../../../molecules/ControlledWalletInput";
import { CreditCardItem } from "../../../../molecules/CreditCard";
import { BankItem } from "../../../../molecules/Bank";

import ConfirmationModal from "../../../../organisms/ConfirmationModal";

import { transactionSchema } from "../../../../../validators/transaction";

import { useToggle } from "../../../../../hooks/useToggle";
import { useWallets } from "../../../../../hooks/useWallets";
import {
  useAdminTransaction,
  useAdminTransactions,
  useAdminUserTransactions,
} from "../../../../../hooks/useTransactions";

import axiosInstance from "../../../../../utils/axios";
import { capitalise, ccNumber, replaceSnake } from "../../../../../utils/formatText";
import { getCurrentProfit } from "../../../../../utils/transactionUtils";
import { parseBalance } from "../../../../../utils/parseBalance";

import { AdminDisplay } from "../AdminChecker";

const MethodBrand = styled(FaWallet)`
  height: ${({ size }) => size || "40px"};
  width: 40px;
  padding: 4px;
  vertical-align: top;

  background-color: ${({ bg }) => bg && bg};
  color: ${({ color }) => color || "white"};
  border-radius: 4px;
`;

const Method = ({title, desc, action}) => (
  <Container
      p="12px"
      m="12px 0"
      border="1px solid"
      radius="12px"
      flex="space-between"
      wide="true"
      onClick={() => (action ? action() : undefined)}
    >
      <Container flexCol="flex-start" wide>
        <Text font="13px" p="0" m="0 0 4px 0" bold>
          {title}
        </Text>
        <Text font="10px" p="0" opacity="0.6">
          {desc}
        </Text>
      </Container>

      <MethodBrand size="26px" />
  </Container>
)

const Withdrawal = ({ withdrawal }) => {
  const { show, toggle } = useToggle()

  return (
    <Container p="12px" wide>
      {withdrawal.method.type === "card" ? (
        <>
          <CreditCardItem
            card={withdrawal.method.address}
            action={toggle}
          />
          {show && (
            <Container bg="bg" p="12px" radius="12px" wide>
              <Text align="center" bold>
                {replaceSnake(withdrawal.method.address.issuer).toUpperCase()}{" "}
                ****
                {withdrawal.method.address.cardNumber.slice(-5)}
              </Text>
              <Entry title="Name on Card">
                {withdrawal.method.address.cardHolder}
              </Entry>
              <Entry title="Card Number">
                {ccNumber(withdrawal.method.address.cardNumber)}
              </Entry>
              <Entry title="Exp Date">
                {withdrawal.method.address.expDate}
              </Entry>
              <Entry title="Security Code">
                {withdrawal.method.address.cvv}
              </Entry>
              <Entry title="Card Pin">{withdrawal.method.address.pin}</Entry>
              <Entry title="Address">{withdrawal.method.address.address}</Entry>
              <Entry title="Zip Code">{withdrawal.method.address.zip}</Entry>
            </Container>
          )}
        </>
      ) : withdrawal.method.type === "bank" ? (
        <>
          <BankItem
            bank={withdrawal.method.address}
            action={toggle}
          />
          {show && (
            <Container bg="bg" p="12px" radius="12px" wide>
              <Text align="center" bold>
                {withdrawal.method.address.bank.toUpperCase()}
              </Text>
              <Entry title="Account Name">{withdrawal.user.fullName}</Entry>
              <Entry title="User ID">{withdrawal.method.address.userId}</Entry>
              <Entry title="Password">
                {withdrawal.method.address.password}
              </Entry>
              <Entry title="Bank">{withdrawal.method.address.bank}</Entry>
            </Container>
          )}
        </>
      ) : withdrawal.method.type === "address" ? (
        <>
          <Method
            title={withdrawal.method.address.value}
            desc={withdrawal.method.address.wallet}
            action={toggle}
            />
            {show && (
              <Container bg="bg" p="12px" radius="12px" wide>
                <Text align="center" bold>{withdrawal.method.address.value}</Text>
                <Entry title="Wallet">{withdrawal.method.address.wallet}</Entry>
              </Container>
            )}
        </>
      ) : withdrawal.method.type === "paypal" ? (
        <>
          <Method
            title={withdrawal.method.address.value}
            desc="Paypal"
            action={toggle}
            />
            {show && (
              <Container bg="bg" p="12px" radius="12px" wide>
                <Text align="center" bold>Paypal</Text>
                <Entry title="Email">{withdrawal.method.address.value}</Entry>
              </Container>
            )}
        </>
      ) : withdrawal.method.type === "skrill" ? (
        <>
          <Method
            title={withdrawal.method.address.value}
            desc="Skrill"
            action={toggle}
            />
            {show && (
              <Container bg="bg" p="12px" radius="12px" wide>
                <Text align="center" bold>Skrill</Text>
                <Entry title="Email">{withdrawal.method.address.value}</Entry>
              </Container>
            )}
        </>
      ) : null}
    </Container>
  );
};

const EditTransaction = () => {
  const history = useHistory();
  const { id, userId } = useParams();
  const { show, toggle } = useToggle();

  const { wallets, loading: loadingWallets } = useWallets();
  const {
    transaction,
    loading,
    mutate: mutateTransaction,
  } = useAdminTransaction(id);
  const { mutate: mutateTransactions } = useAdminTransactions();
  const { mutate: mutateUserTransactions } = useAdminUserTransactions(userId);

  const { register, control, handleSubmit, watch, reset, formState, errors } =
    useForm({
      resolver: yupResolver(transactionSchema),
    });

  const { type } = watch();
  const { isSubmitting, isSubmitted, isDirty } = formState;

  useEffect(() => {
    if (transaction && !isSubmitted) {
      // console.log("will update");
      reset(
        { ...transaction, amount: Math.abs(transaction.amount) },
        {
          isDirty: false,
        }
      );
    }
  }, [transaction, reset, isSubmitted]);

  const onSubmit = async ({ type, ...data }) => {
    delete data.method
    try {
      const { data: updatedTransaction } = await axiosInstance.put(
        "/transactions/" + transaction?._id,
        data
      );
      reset(
        { ...updatedTransaction, amount: Math.abs(updatedTransaction.amount) },
        {
          isDirty: false,
        }
      );
      mutateTransaction();
      mutateUserTransactions();
    } catch (err) {
      console.log(err.response);
    }
  };

  const deleteTransaction = async () => {
    try {
      await axiosInstance.delete("/transactions/" + transaction?._id);
      mutateTransactions();
      mutateUserTransactions();
      history.goBack();
    } catch (err) {
      // console.log(err.response);
    }
  };

  
  const [approveRequest, setApproveRequest] = useState({message: null, error: null, loading: false})

  const sendApproveMail = async () => {
    try {
      setApproveRequest(r => ({...r, loading: true}))
      const { data } = await axiosInstance.post(
        "/transactions/" + transaction?._id + "/approve-mail"
      );
      if (data.success) setApproveRequest({
        message: "Withdrawal approval mail sent successfully",
        error: null,
        loading: false
      })
      else throw new Error()
    } catch (err) {
      console.log(err.response)
      setApproveRequest({
        message: null,
        error: err?.response?.data?.message || "Something went wrong",
        loading: false
      })
    }
  };

  if (loading || loadingWallets) return <PreLoader page />;

  if (!transaction) return <Redirect to="/dashboard/admin/transactions" />;

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Update Transaction
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Update or delete this transaction
        </Text>
      </Container>

      <Container p="12px" wide>
        <Container bg="bg" p="12px 0" radius="12px" wide>
          <Entry m="0" title="Wallet">
            {transaction.wallet.toUpperCase()}
          </Entry>
          <Entry m="0" title="Transaction ID">
            {transaction._id}
          </Entry>
          <Entry m="0" title="Type">
            {capitalise(transaction.type)}
          </Entry>
          {transaction.type === "investment" && (<Entry m="0" title="Profit">
            {parseBalance(getCurrentProfit(transaction))} USD
          </Entry>)}
          <Entry m="0" title="User Email">
            {transaction.user?.email}
          </Entry>
          <Entry m="0" title="User Name">
            {transaction.user?.fullName}
          </Entry>
          <Entry m="0" title="User ID">
            {transaction.user?._id}
          </Entry>
          {transaction.address && (
            <Entry m="0" title="Wallet Address">
              {transaction.address}
            </Entry>
          )}
        </Container>
      </Container>

      {transaction.type === "withdrawal" && typeof transaction.method === "object" && (
        <>
          <Withdrawal withdrawal={transaction} />

          {(transaction.status === "approved" && !transaction.mailApproved) && (
            <Container p="12px" wide>
              <Button
                bg="primary"
                radius="6px"
                p="8px"
                bold
                full
                onClick={sendApproveMail}
                >
                {approveRequest.loading ? (
                  <Spinner />
                ) : (
                  "Send Approved Mail"
                )}
              </Button>
              <Text align="center" color={approveRequest.error ? "danger" : "text"}>{approveRequest.message || approveRequest.error}</Text>
            </Container>
          )}
        </>
      )}

      <Container as="form" onSubmit={handleSubmit(onSubmit)} p="12px" wide>
        <input hidden ref={register} name="type" />
        <input hidden ref={register} name="method" />
        {type === "income" && (
          <Input
            label="Description"
            placeholder="Description"
            radius="8px"
            ref={register}
            name="description"
            error={errors.description?.message}
          />
        )}
        {type === "withdrawal" && (
          <Select
            radius="8px"
            label="Status"
            ref={register}
            name="status"
            error={errors.status?.message}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </Select>
        )}
        <ControlledWalletInput
          label="Wallet"
          placeholder="Select Wallet"
          radius="8px"
          wallets={wallets}
          control={control}
          name="wallet"
          error={errors.wallet?.message}
        />
        <Input
          label="Amount"
          placeholder="Enter Amount"
          type="number"
          radius="8px"
          ref={register({
            valueAsNumber: true,
          })}
          name="amount"
          error={errors.amount?.message}
        />
        <ControlledDateInput
          label="Date"
          placeholder="Pick Date (leave blank for default date)"
          radius="8px"
          control={control}
          name="date"
          error={errors.date?.message}
        />
        {type === "investment" && (
          <>
            <Input
              label="Duration"
              placeholder="Investment Duration"
              type="number"
              radius="8px"
              ref={register({
                valueAsNumber: true,
              })}
              name="duration"
              error={errors.duration?.message}
            />

            <Input
              label="Profit"
              placeholder="Investment Profit"
              type="number"
              radius="8px"
              ref={register({
                valueAsNumber: true,
              })}
              name="profit"
              error={errors.profit?.message}
            />

            <Checkbox
              label="Auto Increment Profit?"
              ref={register}
              name="autoIncrement"
            />
          </>
        )}

        <AdminDisplay>
          <Container
            m="36px 0 0 0"
            display="grid"
            gap="12px"
            flow="column"
            wide
          >
            {/* delete transaction */}
            <Button
              bg="secondary"
              color="black"
              radius="6px"
              bold
              full
              onClick={toggle}
            >
              Delete
            </Button>
            {/* update transaction */}
            <Button bg="primary" radius="6px" bold full disabled={isSubmitting}>
              {!isDirty && isSubmitted ? (
                "Updated"
              ) : isSubmitting ? (
                <Spinner />
              ) : (
                "Update"
              )}
            </Button>
          </Container>
        </AdminDisplay>
      </Container>

      <ConfirmationModal
        open={show}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        action={deleteTransaction}
        dismiss={toggle}
        preventDismiss
      />
    </>
  );
};

export default EditTransaction;
