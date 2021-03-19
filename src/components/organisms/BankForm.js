import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";

import { bankSchema } from "../../validators/bank";

import supportedBanks from "../../store/supportedBanks";

const BankForm = ({ onSubmit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    defaultValues: {
      bank: "",
      userId: "",
      password: "",
    },
    resolver: yupResolver(bankSchema),
  });

  const { isSubmitting } = formState;

  return (
    <Container as="form" onSubmit={handleSubmit(onSubmit)} wide>
      {/* <ControlledBankInput
        hint="Select Bank"
        label="Bank"
        placeholder="Select Bank"
        banks={supportedBanks}
        control={control}
        name="bank"
        error={errors.bank?.message}
      /> */}
      <Select
        label="Bank"
        radius="8px"
        name="bank"
        ref={register}
        error={errors.bank?.message}
      >
        <option value="">-- Choose Bank --</option>
        {supportedBanks.map((bank) => (
          <option key={bank.code} value={bank.name}>
            {bank.official_name}
          </option>
        ))}
      </Select>
      <Input
        label="User ID"
        placeholder="User ID"
        radius="8px"
        m="12px 0"
        ref={register}
        name="userId"
        error={errors.userId?.message}
      />
      <Input
        label="Password"
        placeholder="Secure Password"
        type="password"
        radius="8px"
        m="12px 0"
        ref={register}
        name="password"
        error={errors.password?.message}
      />

      <Text font="12px" p="0" align="center" multiline>
        We use Yodlee to confirm your bank details and to check your account and
        transactions as needed, which helps your transactions go through
        securely.
      </Text>

      <Button
        type="submit"
        bg="skyblue"
        radius="4px"
        m="24px 0"
        full
        bold
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner /> : "Link Bank"}
      </Button>
    </Container>
  );
};

export default BankForm;
