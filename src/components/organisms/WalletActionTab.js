import React from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";

import Tabs from "../molecules/Tabs";

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
  const { show, processing, response, success, start, complete, fail, close } =
    useProcess();

  const makeTransaction = async (tx) => {
    // console.log("submitting");
    const transaction = { ...tx, user: profile._id };
    try {
      start();
      await axiosInstance.post("/transactions", transaction);
      complete("Transaction Successful");
      mutate();
    } catch (err) {
      // console.log(err.response);
      fail(
        err.response.data.message === "Account Restricted"
          ? "Your Account has been temporarily restricted"
          : undefined
      );
    }
  };

  return (
    <>
      <Tabs
        p="24px 0 12px"
        m="12px 0"
        bg="actionBg"
        center
        textStyle={{
          bg: "bg",
          p: "12px 48px",
          m: "0 12px",
          radius: "12px",
        }}
        {...props}
      >
        <Container name="Invest" p="12px" wide>
          <Invest action={makeTransaction} />
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
      />
    </>
  );
};

function Invest({ action }) {
  const { symbol } = useParams();
  const { available } = useWalletBalance(symbol);

  const {
    show: showInvestmentModal,
    open: openInvestmentModal,
    close: closeInvestmentModal,
  } = useToggle();

  const balance = rawBalance(available);

  const schema = yup.object().shape({
    amount: yup
      .number()
      .typeError("Minimum amount is 100 USD")
      .required("Amount is required")
      .min(100, "Minimum amount is 100 USD")
      .max(balance, "You do not have sufficient balance"),
    duration: yup.number().required(),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState,
    reset,
    setValue,
    getValues,
    errors,
  } = useForm({
    defaultValues: {
      amount: null,
      duration: 7,
    },
    resolver: yupResolver(schema),
  });

  const { amount } = watch();
  const { isSubmitting } = formState;

  const autoIncrementProfit =
    process.env.REACT_APP_AUTO_INCREMENT_PROFIT &&
    process.env.REACT_APP_AUTO_INCREMENT_PROFIT.toLowerCase() === "true";

  const makeInvestment = async () => {
    const formData = getValues();
    // console.log("submitting investment");
    action({
      ...formData,
      type: "investment",
      wallet: symbol,
      autoIncrement: autoIncrementProfit,
    });
    reset({
      amount: null,
      duration: 7,
    });
  };

  const setMax = () =>
    setValue("amount", balance, {
      shouldValidate: true,
    });

  return (
    <Container as="form" onSubmit={handleSubmit(openInvestmentModal)} wide>
      <Text color="white" p="12px 8px 0" bold flexalign justify="flex-end">
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
        color="white"
        radius="8px"
        label="Amount"
        placeholder="Amount in USD"
        type="number"
        ref={register({
          valueAsNumber: true,
        })}
        name="amount"
        error={errors.amount?.message}
      />
      <Select
        color="white"
        radius="8px"
        label="Duration"
        ref={register({
          valueAsNumber: true,
        })}
        name="duration"
      >
        <option value="7">7 Days</option>
        <option value="14">14 Days</option>
        <option value="21">21 Days</option>
        <option value="30">1 Month</option>
        <option value="60">2 Months</option>
        <option value="90">3 Months</option>
      </Select>

      <Button
        type="submit"
        bg="white"
        color="black"
        bold
        full
        m="24px 0 0"
        p="14px"
        radius="8px"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner /> : "Invest"}
      </Button>

      <ConfirmationModal
        open={showInvestmentModal}
        dismiss={closeInvestmentModal}
        action={makeInvestment}
        title="Confirm Investment"
        message={`You are about to invest ${amount} USD from your ${symbol.toUpperCase()} wallet`}
      />
    </Container>
  );
}

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
    email: yup.string().email("Invalid Email").required("Email is required"),
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
    action({ ...formData, type: "transfer", wallet: symbol });
    reset({
      amount: null,
      email: "",
      receiver: "",
      receiver_name: "",
    });
  };

  return (
    <Container as="form" onSubmit={handleSubmit(getReceiver)} wide>
      <Text color="white" p="12px 8px 0" bold flexalign justify="flex-end">
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
        color="white"
        radius="8px"
        label="Amount"
        placeholder="Amount in USD"
        type="number"
        ref={register({
          valueAsNumber: true,
        })}
        name="amount"
        error={errors.amount?.message}
      />
      <Input
        color="white"
        radius="8px"
        type="email"
        label="Recipient Email"
        placeholder="Recipient Email Address"
        ref={register}
        name="email"
        error={errors.email?.message}
      />
      <input ref={register} name="receiver" hidden />
      <input ref={register} name="receiver_name" hidden />

      <Button
        type="submit"
        bg="white"
        color="black"
        bold
        full
        m="24px 0 0"
        p="14px"
        radius="8px"
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

export default WalletActionTab;
