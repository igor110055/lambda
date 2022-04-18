import React, { useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import PreLoader from "../../../../atoms/PreLoader";
import Container from "../../../../atoms/Container";
import Text from "../../../../atoms/Text";
import Input from "../../../../atoms/Input";
import Button from "../../../../atoms/Button";
import Spinner from "../../../../atoms/Spinner";

import { AdminWalletItem } from "../../../../molecules/WalletItem";

import ConfirmationModal from "../../../../organisms/ConfirmationModal";

import { useToggle } from "../../../../../hooks/useToggle";
import { useAdminUser } from "../../../../../hooks/useUsers";
import {
  useAdminUserWallet,
  useAdminUserWallets,
  useWallet,
} from "../../../../../hooks/useWallets";
import { useAdminWalletBalance } from "../../../../../hooks/useBalance";

import axiosInstance from "../../../../../utils/axios";

import { AdminDisplay } from "../AdminChecker";

const EditUserWallet = () => {
  const { userId, symbol } = useParams();
  const { show, toggle } = useToggle();

  const { user } = useAdminUser(userId);
  const { wallet, loading } = useWallet(symbol);
  const {
    wallet: userWallet,
    loading: userWalletLoading,
    mutate: mutateUserWallet,
  } = useAdminUserWallet(userId, symbol);
  const { total, available } = useAdminWalletBalance(userId, symbol);

  const { mutate: mutateUserWallets } = useAdminUserWallets(userId);

  const schema = yup.object().shape({
    address: yup.string().required("Wallet address is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState,
    errors,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { isSubmitting } = formState;

  useEffect(() => {
    if (userWallet) {
      setValue("address", userWallet.address);
    }
  }, [userWallet, setValue]);

  const onSubmit = async ({ address }) => {
    let data = { symbol, address };

    try {
      const { data: updatedWallet } = await axiosInstance.post(
        "/users/" + userId + "/wallets",
        data
      );
      mutateUserWallet(updatedWallet, false);
      mutateUserWallets();
    } catch (err) {
      setError("server", {
        type: "server",
        message: err.response.data.message,
      });
    }
  };

  const removeAddress = async () => {
    try {
      await axiosInstance.delete("/users/" + userId + "/wallets/" + symbol);
      mutateUserWallet(null);
      mutateUserWallets();
    } catch (err) {
      // console.log(err.response);
    }
  };

  if (loading || userWalletLoading) return <PreLoader page />;

  if (!wallet) return <Redirect to="../wallets" />;

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          {user.firstName}'s {wallet.name} Wallet
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          View Wallet balance and add custom wallet addresses
        </Text>
      </Container>

      <Container as="form" onSubmit={handleSubmit(onSubmit)} p="12px" wide>
        <Container m="0 0 24px 0" wide>
          <Container
            p="12px"
            m="0 0 24px 0"
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
          <AdminWalletItem p="0 0 12px" nolink wallet={wallet} />
        </Container>

        <Input
          label="Add User specific address for this wallet"
          placeholder="Wallet Address"
          error={errors.address?.message}
          radius="8px"
          ref={register}
          name="address"
        />

        {errors.server?.message && (
          <Text color="tomato" align="center" bold>
            {errors.server?.message}
          </Text>
        )}

        {!userWallet && (
          <AdminDisplay>
            <Button
              type="submit"
              bg="primary"
              m="24px 0 0"
              radius="6px"
              bold
              full
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : "Add Custom Address"}
            </Button>
          </AdminDisplay>
        )}
      </Container>

      {userWallet && (
        <AdminDisplay>
          <Container p="12px" wide>
            <Button
              bg="secondary"
              // color="black"
              radius="4px"
              bold
              full
              onClick={toggle}
            >
              Remove Address
            </Button>
          </Container>
        </AdminDisplay>
      )}

      <ConfirmationModal
        open={show}
        title="Remove Address"
        message="Are you sure you want to remove this address?"
        action={removeAddress}
        dismiss={toggle}
        preventDismiss
      />
    </>
  );
};

export default EditUserWallet;
