import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../../../../atoms/Container";
import Text from "../../../../atoms/Text";
import Select from "../../../../atoms/Select";
import Input from "../../../../atoms/Input";
import Button from "../../../../atoms/Button";
import Spinner from "../../../../atoms/Spinner";

import ControlledDateInput from "../../../../molecules/ControlledDateInput";

import { transactionSchema } from "../../../../../validators/transaction";

import { useAdminUser } from "../../../../../hooks/useUsers";
import { useAdminUserTransactions } from "../../../../../hooks/useTransactions";
import { useAdminWalletBalance } from "../../../../../hooks/useBalance";

import axiosInstance from "../../../../../utils/axios";

import { AdminOnly } from "../AdminChecker";
import { fiatWallets } from "../../../../../store/supportedWallets";

const AddFiatTransaction = () => {
  const history = useHistory();
  const { userId } = useParams();

  const { user } = useAdminUser(userId);
  const { mutate } = useAdminUserTransactions(userId);

  const defaultValues = {
    type: "deposit",
    wallet: fiatWallets.find(w => true).id,
    amount: null,
    date: new Date(),
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
  const { wallet } = watch();

  const { total, available } = useAdminWalletBalance(userId, wallet);

  const onSubmit = async (data) => {
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

  return (
    <AdminOnly>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Add Fiat Transaction
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
        <input hidden name="type" ref={register} />

        <Select
          radius="8px"
          label="Wallet"
          ref={register}
          name="wallet"
          error={errors.type?.message}
        >
          {fiatWallets.map((w) => (
            <option value={w.id}>{w.name} Account</option>
          ))}
        </Select>

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

export default AddFiatTransaction;
