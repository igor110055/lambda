import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

import { useAdminBank } from "../../../hooks/useAdminBank";

import axiosInstance from "../../../utils/axios";

const Bank = () => {
  const history = useHistory();
  const { bank, mutate } = useAdminBank();

  const bankSchema = yup.object().shape({
    bankName: yup.string().required("Bank Name is required"),
    accountName: yup.string().required("Account Name is required"),
    accountNumber: yup.string().required("Account Number is required"),
    branch: yup.string(),
    type: yup.string(),
    reference: yup.string().required("Reference is required"),
  });

  const { register, handleSubmit, formState, reset, errors } = useForm({
    resolver: yupResolver(bankSchema),
  });

  const { isSubmitting, isSubmitted, isDirty } = formState;

  useEffect(() => {
    if (bank && !isSubmitted) {
      // console.log("will update");
      reset(bank, {
        isDirty: false,
      });
    }
  }, [bank, reset, isSubmitted]);

  const onSubmit = async (data) => {
    if (bank) {
      data.id = bank._id;
    }
    console.log(data);
    try {
      const { data: updatedBank } = await axiosInstance.post("/bank", data);
      reset(updatedBank, {
        isDirty: false,
      });
      mutate();
    } catch (err) {
      console.log(err.response);
    }
  };

  const deleteBank = async () => {
    try {
      await axiosInstance.post("/bank/delete", { id: bank?._id });
      await mutate();
      reset();
      history.goBack();
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Bank Details
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Update Bank details
        </Text>
      </Container>

      <Container as="form" p="12px" wide onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Recipient Name"
          placeholder="Recipient Name"
          error={errors.accountName?.message}
          radius="8px"
          ref={register}
          name="accountName"
        />
        <Input
          label="Bank Name"
          placeholder="Bank Name"
          error={errors.bankName?.message}
          radius="8px"
          ref={register}
          name="bankName"
        />
        <Input
          label="Account Number"
          placeholder="Account Number"
          type="tel"
          error={errors.accountNumber?.message}
          radius="8px"
          ref={register}
          name="accountNumber"
        />
        <Input
          label="Branch"
          placeholder="Branch"
          type="text"
          error={errors.branch?.message}
          radius="8px"
          ref={register}
          name="branch"
        />
        <Input
          label="Type"
          placeholder="Type"
          type="text"
          error={errors.type?.message}
          radius="8px"
          ref={register}
          name="type"
        />
        <Input
          label="Reference"
          placeholder="Reference"
          type="text"
          error={errors.reference?.message}
          radius="8px"
          ref={register}
          name="reference"
        />

        <Button
          bg="primary"
          m="24px 0 0 0"
          radius="6px"
          bold
          full
          disabled={isSubmitting}
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

      <Container p="12px" wide>
        {bank && (
          <Button
            bg="danger"
            m="12px 0 0 0"
            radius="6px"
            bold
            full
            onClick={deleteBank}
          >
            Delete Bank
          </Button>
        )}
      </Container>
    </>
  );
};

export default Bank;
