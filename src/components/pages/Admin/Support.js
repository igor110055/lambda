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

import { useAdminSupport } from "../../../hooks/useAdminSupport";

import axiosInstance from "../../../utils/axios";

const Support = () => {
  const history = useHistory();

  const { support, mutate } = useAdminSupport();

  const supportSchema = yup.object().shape({
    whatsapp: yup.string(),
  });

  const { register, handleSubmit, formState, reset, errors } = useForm({
    resolver: yupResolver(supportSchema),
  });

  const { isSubmitting, isSubmitted, isDirty } = formState;

  useEffect(() => {
    if (support && !isSubmitted) {
      // console.log("will update");
      reset(support, {
        isDirty: false,
      });
    }
  }, [support, reset, isSubmitted]);

  const onSubmit = async (data) => {
    if (support) {
      data.id = support._id;
    }
    console.log(data);
    try {
      const { data: updatedSupport } = await axiosInstance.post("/support", data);
      reset(updatedSupport, {
        isDirty: false,
      });
      mutate();
    } catch (err) {
      console.log(err.response);
    }
  };

  const deleteSupport = async () => {
    if (!support) return
    try {
      await axiosInstance.delete(`/support/${support._id}`);
      mutate()
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
          Support Details
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Update Support details
        </Text>
      </Container>

      <Container as="form" p="12px" wide onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="WhatsApp Number"
          placeholder="WhatsApp Number"
          type="tel"
          error={errors.whatsapp?.message}
          radius="8px"
          ref={register}
          name="whatsapp"
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
        {support && (
          <Button
            bg="danger"
            m="12px 0 0 0"
            radius="6px"
            bold
            full
            onClick={deleteSupport}
          >
            Delete Support
          </Button>
        )}
      </Container>
    </>
  );
};

export default Support;
