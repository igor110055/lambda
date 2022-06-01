import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";

import { bankSchema } from "../../validators/bank";

const BankForm = ({ onSubmit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    defaultValues: {
      bank: "",
      accountName: "",
      accountNumber: "",
    },
    resolver: yupResolver(bankSchema),
  });

  const { isSubmitting } = formState;

  return (
    <Container as="form" onSubmit={handleSubmit(onSubmit)} wide>
      <Input
        label="Bank Name"
        placeholder="Bank Name"
        radius="8px"
        m="12px 0"
        ref={register}
        name="bank"
        error={errors.bankName?.message}
        />
      <Input
        label="Account Name"
        placeholder="Account Name"
        radius="8px"
        m="12px 0"
        ref={register}
        name="accountName"
        error={errors.accountName?.message}
      />
      <Input
        label="Account Number"
        placeholder="Account Number"
        type="tel"
        radius="8px"
        m="12px 0"
        ref={register}
        name="accountNumber"
        error={errors.accountNumber?.message}
      />

      <Text font="12px" p="0" align="center" multiline>
        We use Yodlee to confirm your bank details and to check your account and
        transactions as needed, which ensures your transactions go through
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
