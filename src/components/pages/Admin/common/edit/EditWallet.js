import React, { useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import PreLoader from "../../../../atoms/PreLoader";
import Container from "../../../../atoms/Container";
import Text from "../../../../atoms/Text";
import Input from "../../../../atoms/Input";
import Button from "../../../../atoms/Button";
import Spinner from "../../../../atoms/Spinner";

import { AdminWalletItem } from "../../../../molecules/WalletItem";

import ConfirmationModal from "../../../../organisms/ConfirmationModal";

import { walletUpdateSchema } from "../../../../../validators/wallet";

import { useToggle } from "../../../../../hooks/useToggle";
import { useWallet, useWallets } from "../../../../../hooks/useWallets";

import axiosInstance from "../../../../../utils/axios";

import { AdminDisplay } from "../AdminChecker";

const EditWallet = () => {
  const history = useHistory();
  const { symbol } = useParams();
  const { show, toggle } = useToggle();

  const { wallet, loading, mutate: mutateWallet } = useWallet(symbol);
  const { mutate: mutateWallets } = useWallets();

  const {
    register,
    handleSubmit,
    setValue,
    formState,
    reset,
    errors,
  } = useForm({
    resolver: yupResolver(walletUpdateSchema),
  });

  const { isSubmitting, isSubmitted, isDirty } = formState;

  useEffect(() => {
    if (wallet) {
      setValue("address", wallet.address);
    }
  }, [wallet, setValue]);

  const onSubmit = async (formData) => {
    let data = formData;

    try {
      const { data: updatedWallet } = await axiosInstance.put(
        "/wallets/" + wallet.symbol,
        data
      );
      mutateWallet(updatedWallet, false);
      reset(
        {
          address: updatedWallet.address,
        },
        {
          isDirty: false,
        }
      );
    } catch (err) {
      // console.log(err.response);
    }
  };

  const deleteWallet = async () => {
    try {
      await axiosInstance.delete("/wallets/" + wallet?.symbol);
      mutateWallets();
      history.push("../wallets");
    } catch (err) {
      // console.log(err.response);
    }
  };

  if (loading) return <PreLoader page />;

  if (!wallet) return <Redirect to="/dashboard/admin/wallets" />;

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Update Wallet
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Update or remove this wallet
        </Text>
      </Container>

      <Container as="form" onSubmit={handleSubmit(onSubmit)} p="12px" wide>
        <AdminWalletItem p="0 0 24px" nolink wallet={wallet} />

        <Input
          label="Wallet Address"
          placeholder="Wallet Address"
          error={errors.address?.message}
          radius="12px"
          ref={register}
          name="address"
        />

        <AdminDisplay>
          <Container
            m="12px 0 0 0"
            display="grid"
            gap="12px"
            flow="column"
            wide
          >
            {/* delete wallet */}
            <Button
              bg="secondary"
              // color="black"
              m="24px 0"
              radius="6px"
              bold
              full
              onClick={toggle}
            >
              Delete
            </Button>
            {/* update wallet */}
            <Button
              bg="primary"
              type="submit"
              m="24px 0"
              radius="6px"
              bold
              full
              disabled={isSubmitting || !isDirty}
            >
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
        title="Delete Wallet"
        message="Are you sure you want to delete this wallet?"
        action={deleteWallet}
        dismiss={toggle}
        preventDismiss
      />
    </>
  );
};

export default EditWallet;
