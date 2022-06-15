import React from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";

import Tabs from "../molecules/Tabs";
import ControlledWithdrawalInput from "../molecules/ControlledWithdrawalInput";

import ConfirmationModal from "../organisms/ConfirmationModal";
import ProcessModal from "../organisms/ProcessModal";

import { useProfile } from "../../hooks/useProfile";
import { useWalletBalance } from "../../hooks/useBalance";
import { useToggle } from "../../hooks/useToggle";
import { useProcess } from "../../hooks/useProcess";
import { useTransactions } from "../../hooks/useTransactions";

import axiosInstance from "../../utils/axios";
import { rawBalance } from "../../utils/parseBalance";

const WalletActionTab = (props) => {
  const { profile } = useProfile();
  const { mutate } = useTransactions();
  const { show, processing, response, success, start, complete, fail, close, failContext } =
    useProcess();

  const makeTransaction = async (tx, cb) => {
    // console.log("submitting");
    const transaction = { ...tx, user: profile._id };
    try {
      start();
      await axiosInstance.post("/transactions", transaction);
      complete("Transaction Successful");
      mutate();
      cb()
    } catch (err) {
      // console.log(err.response);
      if (err.response.data.message === "Please upload Company ID") {
        fail(err.response.data.message, { message: "Click here to upload", to: "/confirmation/documents/start" });
      } else {
        fail(err.response.data.message);
      }
    }
  };

  return (
    <>
      <Tabs
        p="24px 0 12px"
        m="12px 0"
        // bg="actionBg"
        bordertop="1px solid"
        center
        textStyle={{
          bg: "bg",
          p: "12px 48px",
          m: "0 12px",
          radius: "12px",
        }}
        {...props}
      >
        <Container name="Withdraw" p="12px" wide>
          <Withdraw action={makeTransaction} />
        </Container>
        <Container name="Transfer" p="12px" wide>
          <Transfer action={makeTransaction} />
        </Container>
      </Tabs>
      <ProcessModal
        title="Completing Transaction"
        open={show}
        processing={processing}
        response={response}
        success={success}
        dismiss={close}
        failContext={failContext}
      />
    </>
  );
};

function Transfer({ action }) {
  const { profile } = useProfile();
  const { symbol } = useParams();
  const { available } = useWalletBalance(symbol);

  const {
    show: showTransferModal,
    open: openTransferModal,
    close: closeTransferModal,
  } = useToggle();

  const balance = rawBalance(available);

  const schema = yup.object().shape({
    amount: yup
      .number()
      .typeError("Minimum amount is 100 USD")
      .required("Amount is required")
      .min(100, "Minimum amount is 100 USD")
      .max(balance, "You do not have sufficient balance"),
    email: yup.string().email("Invalid Email").required("Recipient is required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset,
    getValues,
    setValue,
    setError,
    errors,
  } = useForm({
    defaultValues: {
      amount: null,
      email: "",
      receiver: "",
      receiver_name: "",
    },
    resolver: yupResolver(schema),
  });

  const { amount, receiver_name } = watch();
  const { isSubmitting } = formState;

  const setMax = () =>
    setValue("amount", balance, {
      shouldValidate: true,
    });

  const getReceiver = async ({ email }) => {
    try {
      const { data: receiver } = await axiosInstance.post("/profile/email", {
        email,
      });
      if (receiver.email === profile.email) {
        return setError("email", {
          type: "server",
          message: "Cannot transfer to own address",
        });
      }
      setValue("receiver", receiver._id);
      setValue("receiver_name", `${receiver.firstName} ${receiver.lastName}`);
      openTransferModal();
    } catch (err) {
      setError("email", {
        type: "server",
        message: "Unable to find receipient",
      });
    }
  };

  const makeTransfer = () => {
    const { email, receiver_name, ...formData } = getValues();
    // console.log("submiting transfer");
    action({ ...formData, type: "transfer", wallet: symbol }, () => reset({
      amount: null,
      email: "",
      receiver: "",
      receiver_name: "",
    }));
  };

  return (
    <Container as="form" onSubmit={handleSubmit(getReceiver)} wide>
      <Text p="24px 8px 0" bold flexalign justify="flex-end">
        {available} USD
        <SubText
          bg="bg"
          color="text"
          font="11px"
          p="6px 8px"
          m="0 0 0 12px"
          radius="4px"
          bold
          pointer
          onClick={setMax}
        >
          MAX
        </SubText>
      </Text>
      <Input
        radius="4px"
        label="Amount"
        placeholder="Amount in USD"
        type="number"
        p="24px 12px"
        m="12px 0"
        ref={register({
          valueAsNumber: true,
        })}
        name="amount"
        error={errors.amount?.message}
      />
      <Input
        radius="4px"
        type="email"
        label="Recipient Email"
        placeholder="Recipient Email Address"
        m="12px 0"
        p="24px 12px"
        ref={register}
        name="email"
        error={errors.email?.message}
      />
      <input ref={register} name="receiver" hidden />
      <input ref={register} name="receiver_name" hidden />

      <Button
        type="submit"
        bg="primary"
        bold
        full
        m="24px 0 0"
        p="24px"
        radius="4px"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner /> : "Transfer"}
      </Button>

      <ConfirmationModal
        open={showTransferModal}
        dismiss={closeTransferModal}
        action={makeTransfer}
        title="Confirm Transfer"
        message={`You are about to transfer ${amount} USD to ${receiver_name} from your ${symbol.toUpperCase()} wallet`}
      />
    </Container>
  );
}

function Withdraw({ action }) {
  const { profile } = useProfile();
  const { symbol } = useParams();
  const { available } = useWalletBalance(symbol);

  const {
    show: showWithdrawalModal,
    open: openWithdrawalModal,
    close: closeWithdrawalModal,
  } = useToggle();

  const balance = rawBalance(available);
  const minimumWithdrawal = parseInt(process.env.REACT_APP_MINIMUM_WITHDRAWAL) || 2000;

  const schema = yup.object().shape({
    amount: yup
      .number()
      .typeError("Amount is required")
      .required("Amount is required")
      .min(minimumWithdrawal, "Amount too low")
      .max(balance, "You do not have sufficient balance"),
    method: yup.object({
      type: yup.string().required("Method type is required"),
      address: yup.mixed().required("Method address is required")
    }).typeError("Withdrawal method is required").required("Withdrawal method is required")
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState,
    setValue,
    getValues,
    reset,
    errors,
  } = useForm({
    defaultValues: {
      amount: null,
      method: null,
    },
    resolver: yupResolver(schema),
  });

  const { amount } = watch();
  const { isSubmitting } = formState;

  const setMax = () =>
    setValue("amount", balance, {
      shouldValidate: true,
    });

  const makeWithdrawal = async () => {
    const formData = getValues();
    action({ ...formData, type: "withdrawal", wallet: symbol, status: "pending" }, () => reset({
      amount: null,
      method: null,
    }));
  };

  return (
    <Container as="form" onSubmit={handleSubmit(openWithdrawalModal)} wide>
      <Text p="24px 8px 0" bold flexalign justify="flex-end">
        {available} USD
        <SubText
          bg="bg"
          color="text"
          font="11px"
          p="6px 8px"
          m="0 0 0 12px"
          radius="4px"
          bold
          pointer
          onClick={setMax}
        >
          MAX
        </SubText>
      </Text>
      <Input
        radius="4px"
        label="Amount"
        placeholder="Amount in USD"
        type="number"
        m="12px 0"
        p="24px 12px"
        ref={register({
          valueAsNumber: true,
        })}
        name="amount"
        error={errors.amount?.message}
      />
      <ControlledWithdrawalInput
        radius="4px"
        m="12px 0"
        p="12px 12px"
        label="Withdrawal Method"
        placeholder="Withdrawal Method"
        cards={profile.cards}
        banks={profile.banks}
        control={control}
        name="method"
        error={errors.method?.message}
      />

      <Button
        type="submit"
        bg="primary"
        full
        m="24px 0 0"
        p="24px"
        radius="4px"
        bold
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner /> : "Withdraw"}
      </Button>

      <ConfirmationModal
        open={showWithdrawalModal}
        dismiss={closeWithdrawalModal}
        action={makeWithdrawal}
        title="Confirm Withdrawal"
        message={`Withdraw ${amount} USD from your ${symbol.toUpperCase()} wallet`}
      />
    </Container>
  )
}

export default WalletActionTab;
