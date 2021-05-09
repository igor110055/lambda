import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import PreLoader from "../../../../atoms/PreLoader";
import Container from "../../../../atoms/Container";
import Text from "../../../../atoms/Text";
import Select from "../../../../atoms/Select";
import Input from "../../../../atoms/Input";
import Checkbox from "../../../../atoms/Checkbox";
import Button from "../../../../atoms/Button";
import Spinner from "../../../../atoms/Spinner";

import ControlledWalletInput from "../../../../molecules/ControlledWalletInput";
import ControlledDateInput from "../../../../molecules/ControlledDateInput";
import ControlledWithdrawalInput from "../../../../molecules/ControlledWithdrawalInput";

import { transactionSchema } from "../../../../../validators/transaction";

import { useAdminUser } from "../../../../../hooks/useUsers";
import { useAdminUserTransactions } from "../../../../../hooks/useTransactions";
import { useWallets } from "../../../../../hooks/useWallets";
import { useAdminWalletBalance } from "../../../../../hooks/useBalance";

import axiosInstance from "../../../../../utils/axios";
import { rawBalance } from "../../../../../utils/parseBalance";

import { AdminOnly } from "../AdminChecker";

const autoIncrementProfit =
  process.env.REACT_APP_AUTO_INCREMENT_PROFIT?.toLowerCase() === "true";

const AddTransaction = () => {
  const history = useHistory();
  const { userId } = useParams();

  const { user } = useAdminUser(userId);
  const { mutate } = useAdminUserTransactions(userId);
  const { wallets, loading: loadingWallets } = useWallets();

  const defaultValues = {
    type: "deposit",
    wallet: "BTC",
    amount: null,
    description: "",
    date: new Date(),
    receiver_email: "", // transfer
    method: "", // withdrawal
    profit: null, // investment
    extra: null, // investment
    duration: 7, // investment
    autoIncrement: autoIncrementProfit ? true : false, // investment
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState,
    setError,
    errors,
  } = useForm({
    defaultValues,
    resolver: yupResolver(transactionSchema),
  });

  const { isSubmitting } = formState;
  const { type, wallet } = watch();

  const { total, available } = useAdminWalletBalance(userId, wallet);
  const balance = rawBalance(available);

  const onSubmit = async (data) => {
    const expenses = ["investment", "transfer", "withdrawal"];
    if (expenses.includes(data.type) && data.amount > balance) {
      setError("amount", {
        type: "server",
        message: "Insufficient Balance",
      });
      return;
    }
    if (data.type === "transfer") {
      try {
        const { data: recipient } = await axiosInstance.post("/profile/email", {
          email: data.receiver_email,
        });
        if (recipient.email === user.email) {
          return setError("receiver_email", {
            type: "server",
            message: "Cannot transfer to same user",
          });
        }
        data.receiver = recipient._id;
        delete data.receiver_email;
      } catch (error) {
        setError("receiver_email", {
          type: "server",
          message: "Unable to find receipient",
        });
      }
    }
    try {
      await axiosInstance.post("/transactions", { ...data, user: userId });
      mutate();
      history.push("../transactions");
    } catch (err) {
      setError(
        "server",
        {
          type: "server",
          message: err.response.data.message,
        },
        {
          shouldRevalidate: true,
        }
      );
    }
  };

  return loadingWallets ? (
    <PreLoader page />
  ) : (
    <AdminOnly>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Add Transaction
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Add transaction to {user.fullName}'s account.
        </Text>
      </Container>

      <Container p="12px" wide>
        <Container
          p="12px"
          m="0 0 12px 0"
          radius="8px"
          flex="space-between"
          bg="bg"
          wide
        >
          <Container flexCol="flex-start">
            <Text font="10px" p="0 4px" opacity="0.6" bold>
              Total Balance
            </Text>
            <Text font="18px" p="12px 0 0" bold>
              $ {total}
            </Text>
          </Container>
          <Container flexCol="flex-end">
            <Text font="10px" p="0 4px" opacity="0.6" bold>
              Available Balance
            </Text>
            <Text font="18px" p="12px 0 0" bold>
              $ {available}
            </Text>
          </Container>
        </Container>
      </Container>

      <Container as="form" p="12px" wide onSubmit={handleSubmit(onSubmit)}>
        <Select
          radius="8px"
          label="Type"
          ref={register}
          name="type"
          error={errors.type?.message}
        >
          <option value="deposit">Deposit</option>
          <option value="investment">Investment</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="transfer">Transfer</option>
          <option value="income">Income</option>
        </Select>

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

        {type === "transfer" && (
          <Input
            label="Recipient"
            placeholder="Recipient"
            radius="8px"
            ref={register}
            name="receiver_email"
            error={errors.receiver_email?.message}
          />
        )}

        {type === "withdrawal" && (
          <ControlledWithdrawalInput
            radius="8px"
            label="Withdrawal Method"
            placeholder="Withdrawal Method"
            cards={user.cards}
            banks={user.banks}
            noadd
            control={control}
            name="method"
            error={errors.method?.message}
          />
        )}

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
          placeholder="Pick Date (leave blank for today's date)"
          radius="8px"
          control={control}
          name="date"
          error={errors.date?.message}
        />
        {type === "investment" && (
          <>
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

        {errors.server?.message && (
          <Text color="danger" align="center" bold>
            {errors.server?.message}
          </Text>
        )}

        <Button
          type="submit"
          bg="primary"
          m="24px 0"
          radius="4px"
          bold
          full
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Submit"}
        </Button>
      </Container>
    </AdminOnly>
  );
};

export default AddTransaction;
