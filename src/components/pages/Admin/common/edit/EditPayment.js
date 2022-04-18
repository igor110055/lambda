import React, { useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import PreLoader from "../../../../atoms/PreLoader";
import Container from "../../../../atoms/Container";
import Text from "../../../../atoms/Text";
import Input from "../../../../atoms/Input";
import Checkbox from "../../../../atoms/Checkbox";
import Button from "../../../../atoms/Button";
import Spinner from "../../../../atoms/Spinner";

import ControlledDateInput from "../../../../molecules/ControlledDateInput";

import ConfirmationModal from "../../../../organisms/ConfirmationModal";

import { paymentSchema } from "../../../../../validators/payment";

import { useToggle } from "../../../../../hooks/useToggle";
import {
  useAdminPayment,
  useAdminUserPayments,
} from "../../../../../hooks/usePayments";

import axiosInstance from "../../../../../utils/axios";

import { AdminDisplay } from "../AdminChecker";

const EditPayment = () => {
  const { id, userId } = useParams();
  const history = useHistory();
  const { show, toggle } = useToggle();

  const { payment, loading, mutate: mutatePayment } = useAdminPayment(id);
  const { mutate: mutateUserPayments } = useAdminUserPayments(userId);

  const { register, control, handleSubmit, reset, formState, errors } = useForm(
    {
      resolver: yupResolver(paymentSchema),
    }
  );

  const { isSubmitting, isSubmitted, isDirty } = formState;

  useEffect(() => {
    if (payment && !isSubmitted) {
      // console.log("will update");
      reset(payment, {
        isDirty: false,
      });
    }
  }, [payment, reset, isSubmitted]);

  const onSubmit = async (data) => {
    try {
      const { data: updatedPayment } = await axiosInstance.put(
        "/payments/" + payment?._id,
        data
      );
      reset(updatedPayment, {
        isDirty: false,
      });
      mutatePayment();
      mutateUserPayments();
    } catch (err) {
      // console.log(err.response);
    }
  };

  const deletePayment = async () => {
    try {
      await axiosInstance.delete("/payments/" + payment?._id);
      mutateUserPayments();
      history.goBack();
    } catch (err) {
      // console.log(err.response);
    }
  };

  if (loading) return <PreLoader page />;

  if (!payment) return <Redirect to="/dashboard/admin/payments" />;

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Update Payment
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Update or delete this payment request
        </Text>
      </Container>

      <Container as="form" onSubmit={handleSubmit(onSubmit)} p="12px" wide>
        <Input
          label="Title"
          placeholder="Title"
          radius="8px"
          ref={register}
          name="title"
          error={errors.title?.message}
        />

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
        <Checkbox label="Payment Completed?" ref={register} name="completed" />

        <AdminDisplay>
          <Container
            m="12px 0 0 0"
            display="grid"
            gap="12px"
            flow="column"
            wide
          >
            {/* delete payment */}
            <Button
              bg="secondary"
              // color="black"
              radius="6px"
              bold
              full
              onClick={toggle}
            >
              Delete
            </Button>
            {/* update payment */}
            <Button bg="primary" radius="6px" bold full disabled={isSubmitting}>
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
        title="Delete Payment"
        message="Are you sure you want to delete this Payment?"
        action={deletePayment}
        dismiss={toggle}
        preventDismiss
      />
    </>
  );
};

export default EditPayment;
