import React, { useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import PreLoader from "../../../../atoms/PreLoader";
import Container from "../../../../atoms/Container";
import Text from "../../../../atoms/Text";
import Input from "../../../../atoms/Input";
import Checkbox from "../../../../atoms/Checkbox";
import Button from "../../../../atoms/Button";
import Spinner from "../../../../atoms/Spinner";

import Entry from "../../../../molecules/Entry";
import ControlledDateInput from "../../../../molecules/ControlledDateInput";
import ControlledWalletInput from "../../../../molecules/ControlledWalletInput";

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
import { capitalise } from "../../../../../utils/formatText";
import { getCurrentProfit } from "../../../../../utils/transactionUtils";
import { parseBalance } from "../../../../../utils/parseBalance";

import { AdminDisplay } from "../AdminChecker";

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
      // console.log(err.response);
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
          <Entry m="0" title="Profit">
            {parseBalance(getCurrentProfit(transaction))} USD
          </Entry>
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

      <Container as="form" onSubmit={handleSubmit(onSubmit, (e) => console.log(e))} p="12px" wide>
        <input hidden ref={register} name="type" />
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

            <Input
              label="Extra"
              placeholder="Extra Profit"
              type="number"
              radius="8px"
              ref={register({
                valueAsNumber: true,
              })}
              name="extra"
              error={errors.extra?.message}
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
