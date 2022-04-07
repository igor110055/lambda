import React, { useEffect, useState } from "react";
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
import ControlledWalletInput from "../molecules/ControlledWalletInput";

import ConfirmationModal from "./ConfirmationModal";
import ProcessModal from "./ProcessModal";

import { useProfile } from "../../hooks/useProfile";
import { useWalletBalance } from "../../hooks/useBalance";
import { useToggle } from "../../hooks/useToggle";
import { useProcess } from "../../hooks/useProcess";
import { useTransactions } from "../../hooks/useTransactions";

import axiosInstance from "../../utils/axios";
import { parseBalance, rawBalance } from "../../utils/parseBalance";
import { getFiat } from "../../store/supportedWallets";
import { useWallets } from "../../hooks/useWallets";

const FiatActionTab = (props) => {
  const { profile } = useProfile();
  const { mutate } = useTransactions();
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

  const { wallets = [] } = useWallets();

  const makeTrade = async (tx) => {
    // console.log("submitting");
    const transaction = { ...tx, user: profile._id };
    try {
      start();
      await axiosInstance.post("/transactions/trade", transaction);
      complete("Transaction Successful");
      mutate();
    } catch (err) {
      console.log(err.response);
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
        <Container name="Buy" p="12px" wide>
          <Buy action={makeTrade} wallets={wallets} />
        </Container>
        <Container name="Sell" p="12px" wide>
          <Sell action={makeTrade} wallets={wallets} />
        </Container>
      </Tabs>
      <ProcessModal
        title="Completing Trade"
        open={show}
        processing={processing}
        response={response}
        success={success}
        dismiss={close}
      />
    </>
  );
};

function Buy({ action, wallets }) {
  const { id } = useParams();

  const wallet = getFiat(id)

  const { available } = useWalletBalance(id);

  const { show, open, close } = useToggle();

  const balance = rawBalance(available);

  const schema = yup.object().shape({
    wallet: yup.string("Wallet is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .typeError("Invalid Amount")
      .min(100, "Minimum amount is 100 USD")
      .max(balance, "You do not have sufficient balance"),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState,
    reset,
    setValue,
    getValues,
    errors,
  } = useForm({
    defaultValues: {
      wallet: null || "BTC",
      amount: null,
    },
    resolver: yupResolver(schema),
  });

  const { amount, wallet: selectedWallet } = watch();
  const { isSubmitting } = formState;

  const charges = (amount) => Math.min(12, 0.02383*amount)

  const makeTrade = async () => {
    const formData = getValues();
    // console.log("submitting investment");
    action({
      ...formData,
      type: "buy",
      wallet: id,
      walletName: wallet.name,
      crypto_wallet: formData.wallet,
      charges: charges(formData.amount)
    });
    reset({
      wallet: formData.wallet,
      amount: null,
    });
  };

  const setMax = () =>
    setValue("amount", balance, {
      shouldValidate: true,
    });

  return (
    <Container as="form" onSubmit={handleSubmit(open)} wide>
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

      <ControlledWalletInput
        color="white"
        radius="8px"
        label="Select Wallet"
        placeholder="Select Wallet"
        wallets={wallets}
        control={control}
        name="wallet"
        error={errors.wallet?.message}
      />

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
        {isSubmitting ? <Spinner /> : "Buy"}
      </Button>

      <ConfirmationModal
        open={show}
        dismiss={close}
        action={makeTrade}
        title="Confirm Trade"
        message={`You are about to buy ${amount} USD of ${selectedWallet} from your ${wallet?.name} Account. You will be charged ${parseBalance(charges(amount))} USD`}
      />
    </Container>
  );
}

function Sell({ action, wallets }) {
  const { id } = useParams();
  
  const wallet = getFiat(id)
  
  const { show, open, close } = useToggle();
  
  const [sellWallet, setSellWallet] = useState("BTC")

  const { available } = useWalletBalance(sellWallet);
  const balance = rawBalance(available);

  const schema = yup.object().shape({
    wallet: yup.string("Wallet is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .typeError("Invalid Amount")
      .min(100, "Minimum amount is 100 USD")
      .max(balance, "You do not have sufficient balance"),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState,
    reset,
    setValue,
    getValues,
    errors,
  } = useForm({
    defaultValues: {
      wallet: null || "BTC",
      amount: null,
    },
    resolver: yupResolver(schema),
  });

  const { amount, wallet: selectedWallet } = watch();
  const { isSubmitting } = formState;

  useEffect(() => {
    setSellWallet(selectedWallet)
  }, [selectedWallet])

  const charges = (amount) => Math.min(26, 0.08183*amount)

  const makeTrade = async () => {
    const formData = getValues();
    // console.log("submitting investment");
    action({
      ...formData,
      type: "sell",
      wallet: id,
      walletName: wallet.name,
      crypto_wallet: formData.wallet,
      charges: charges(formData.amount)
    });
    reset({
      wallet: formData.wallet,
      amount: null,
    });
  };

  const setMax = () =>
    setValue("amount", balance, {
      shouldValidate: true,
    });

  return (
    <Container as="form" onSubmit={handleSubmit(open)} wide>
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

      <ControlledWalletInput
        color="white"
        radius="8px"
        label="Select Wallet"
        placeholder="Select Wallet"
        wallets={wallets}
        control={control}
        name="wallet"
        error={errors.wallet?.message}
      />

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
        {isSubmitting ? <Spinner /> : "Sell"}
      </Button>

      <ConfirmationModal
        open={show}
        dismiss={close}
        action={makeTrade}
        title="Confirm Trade"
        message={`You are about to sell ${amount} USD of ${selectedWallet} to your ${wallet?.name} Account. You will be charged ${parseBalance(charges(amount))} USD`}
      />
    </Container>
  );
}

export default FiatActionTab;
