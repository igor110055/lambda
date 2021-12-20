import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useWalletBalance } from "../../../hooks/useBalance";
import { useProcess } from "../../../hooks/useProcess";
import { useProfile } from "../../../hooks/useProfile";
import { useToggle } from "../../../hooks/useToggle";
import { useTransactions } from "../../../hooks/useTransactions";
import { useWallets } from "../../../hooks/useWallets";
import axiosInstance from "../../../utils/axios";
import { rawBalance } from "../../../utils/parseBalance";
import { withdrawalSchema } from "../../../validators/transaction";
import Button from "../../atoms/Button";
import Container from "../../atoms/Container";
import Input from "../../atoms/Input";
import PreLoader from "../../atoms/PreLoader";
import Spinner from "../../atoms/Spinner";
import SubText from "../../atoms/SubText";
import Text from "../../atoms/Text";
import ControlledWalletInput from "../../molecules/ControlledWalletInput";
import ControlledWithdrawalInput from "../../molecules/ControlledWithdrawalInput";
import WalletBalance from "../../molecules/WalletBalance";
import ConfirmationModal from "../../organisms/ConfirmationModal";
import ProcessModal from "../../organisms/ProcessModal";
import RecentWithdrawals from "../../organisms/RecentWithdrawals";
import DashboardLayout from "../../templates/Dashboard";

const Withdraw = () => {
  const { state } = useLocation();

  const { profile } = useProfile();
  const { wallets, loading: loadingWallets } = useWallets();
  const { mutate: mutateTransactions } = useTransactions();

  const { show, processing, response, success, start, complete, fail, close } =
    useProcess();

  const {
    show: showWithdrawalModal,
    open: openWithdrawalModal,
    close: closeWithdrawalModal,
  } = useToggle();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState,
    setValue,
    setError,
    getValues,
    reset,
    errors,
  } = useForm({
    defaultValues: {
      amount: null,
      wallet: state?.wallet || "BTC",
      method: "",
      address: "",
    },
    resolver: yupResolver(withdrawalSchema),
  });

  const { amount, wallet } = watch();
  const { isSubmitting } = formState;

  const selectedWallet = wallets?.find(
    (w) => w?.symbol.toLowerCase() === wallet?.toLowerCase()
  );

  const { available } = useWalletBalance(wallet);
  const balance = rawBalance(available);

  const setMax = () =>
    setValue("amount", balance, {
      shouldValidate: true,
    });

  const makeWithdrawal = async () => {
    const formData = getValues();
    const isAddress = formData.method?.startsWith("address://");
    if (isAddress) {
      formData.address = formData.method?.slice("address://".length);
      delete formData.method;
    }
    if (formData.amount > balance) {
      setError("amount", {
        type: "server",
        message: "You do not have sufficient balance",
      });
      return;
    }
    const transaction = { ...formData, user: profile._id, type: "withdrawal" };
    try {
      start();
      await axiosInstance.post("/transactions", transaction);
      complete(
        "Your withdrawal is currently being processed, you will be contacted by email soon"
      );
      mutateTransactions();
      reset({
        amount: null,
        wallet: formData.wallet,
      });
    } catch (err) {
      console.log(err.response);
      fail(
        err.response.data.message === "Account Restricted"
          ? "Your Account has been temporarily restricted"
          : undefined
      );
    }
  };

  return loadingWallets ? (
    <DashboardLayout>
      <PreLoader page />
    </DashboardLayout>
  ) : (
    <DashboardLayout>
      {selectedWallet && (
        <Container p="24px 12px 12px" wide>
          <WalletBalance wallet={selectedWallet} />
          <Container m="12px 0 0" display="grid" gap="12px" flow="column" wide>
            <Button
              bg="primary"
              p="12px"
              radius="6px"
              bold="true"
              to="/dashboard/settings/cards"
            >
              Manage Cards
            </Button>
            <Button
              bg="secondary"
              p="12px"
              radius="6px"
              bold="true"
              to="/dashboard/wallets"
            >
              All Wallets
            </Button>
          </Container>
        </Container>
      )}

      <Container
        as="form"
        p="12px 12px 24px"
        m="24px 0"
        bg="actionBg"
        wide
        onSubmit={handleSubmit(openWithdrawalModal)}
      >
        <Text color="white" p="24px 8px 0" bold flexalign justify="flex-end">
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
          placeholder="Amount"
          type="number"
          m="12px 0"
          ref={register({
            valueAsNumber: true,
          })}
          name="amount"
          error={errors.amount?.message}
        />
        <ControlledWithdrawalInput
          color="white"
          radius="8px"
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
          bg="white"
          color="black"
          full
          m="24px 0"
          p="14px"
          radius="8px"
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
          message={`Withdraw ${amount} USD from your ${wallet.toUpperCase()} wallet`}
        />

        <ProcessModal
          title="Request Successful"
          open={show}
          processing={processing}
          response={response}
          success={success}
          dismiss={close}
        />
      </Container>

      <RecentWithdrawals />
    </DashboardLayout>
  );
};

export default Withdraw;
