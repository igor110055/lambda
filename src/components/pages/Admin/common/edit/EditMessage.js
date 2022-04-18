import React, { useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import PreLoader from "../../../../atoms/PreLoader";
import Container from "../../../../atoms/Container";
import Text from "../../../../atoms/Text";
import Input from "../../../../atoms/Input";
import Checkbox from "../../../../atoms/Checkbox";
import Textarea from "../../../../atoms/Textarea";
import Button from "../../../../atoms/Button";
import Spinner from "../../../../atoms/Spinner";

import ControlledDateInput from "../../../../molecules/ControlledDateInput";

import ConfirmationModal from "../../../../organisms/ConfirmationModal";

import { messageSchema } from "../../../../../validators/message";

import { useToggle } from "../../../../../hooks/useToggle";
import {
  useAdminMessage,
  useAdminUserMessages,
} from "../../../../../hooks/useMessages";

import axiosInstance from "../../../../../utils/axios";

import { AdminDisplay } from "../AdminChecker";

const EditMessage = () => {
  const { id, userId } = useParams();
  const history = useHistory();
  const { show, toggle } = useToggle();

  const { message, loading, mutate: mutateMessage } = useAdminMessage(id);
  const { mutate: mutateUserMessages } = useAdminUserMessages(userId);

  const { register, control, handleSubmit, reset, formState, errors } = useForm(
    {
      resolver: yupResolver(messageSchema),
    }
  );

  const { isSubmitting, isSubmitted, isDirty } = formState;

  useEffect(() => {
    if (message && !isSubmitted) {
      // console.log("will update");
      reset(message, {
        isDirty: false,
      });
    }
  }, [message, reset, isSubmitted]);

  const onSubmit = async (data) => {
    try {
      const { data: updatedMessage } = await axiosInstance.put(
        "/messages/" + message?._id,
        data
      );
      reset(updatedMessage, {
        isDirty: false,
      });
      mutateMessage();
      mutateUserMessages();
    } catch (err) {
      // console.log(err.response);
    }
  };

  const deleteMessage = async () => {
    try {
      await axiosInstance.delete("/messages/" + message?._id);
      mutateUserMessages();
      history.goBack();
    } catch (err) {
      // console.log(err.response);
    }
  };

  if (loading) return <PreLoader page />;

  if (!message) return <Redirect to="/dashboard/admin/messages" />;

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Update Message
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Update or delete this message
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

        <Textarea
          label="Body"
          placeholder="Message Body"
          rows="12"
          radius="8px"
          ref={register}
          name="body"
          error={errors.body?.message}
        />

        <ControlledDateInput
          label="Date"
          placeholder="Pick Date (leave blank for today's date)"
          radius="8px"
          control={control}
          name="date"
          error={errors.date?.message}
        />
        <Checkbox label="Message Read?" ref={register} name="read" />

        <AdminDisplay>
          <Container
            m="12px 0 0 0"
            display="grid"
            gap="12px"
            flow="column"
            wide
          >
            {/* delete message */}
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
            {/* update message */}
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
        title="Delete Message"
        message="Are you sure you want to delete this Message?"
        action={deleteMessage}
        dismiss={toggle}
        preventDismiss
      />
    </>
  );
};

export default EditMessage;
