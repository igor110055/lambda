import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";
import SubText from "../../../atoms/SubText";
import Input from "../../../atoms/Input";
import Textarea from "../../../atoms/Textarea";
import Button from "../../../atoms/Button";

import ProcessModal from "../../../organisms/ProcessModal";
import ConfirmationModal from "../../../organisms/ConfirmationModal";

import { useAdminUser } from "../../../../hooks/useUsers";
import { useProcess } from "../../../../hooks/useProcess";
import { useToggle } from "../../../../hooks/useToggle";

import axiosInstance from "../../../../utils/axios";

import { AdminOnly } from "../common/AdminChecker";

const DocumentRequest = () => {
  const { userId } = useParams();
  const { user, mutate } = useAdminUser(userId);

  const { show: showModal, open: openModal, close: closeModal } = useToggle();
  const {
    show: showCancelModal,
    open: openCancelModal,
    close: closeCancelModal,
  } = useToggle();

  const {
    show,
    processing,
    response,
    success,
    start,
    complete,
    fail,
    close: closeProcess,
  } = useProcess();

  const defaultValues = {
    documentName: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState,
    reset,
    errors,
  } = useForm({
    defaultValues,
  });

  const { isSubmitting } = formState;

  const close = () => {
    closeProcess();
    reset();
    mutate();
  };

  useEffect(() => {
    if (user) {
      reset(
        {
          documentName: user.requestedDocument || "",
          description:
            user.requestedDocumentDescription ||
            "Upload a copy of your document. Ensure the document is clearly visible",
        },
        {
          isDirty: false,
        }
      );
    }
  }, [user, reset]);

  const requestDocument = async () => {
    const data = getValues();

    try {
      start();
      const { resp } = await axiosInstance.post(
        `/users/${userId}/request-document`,
        data
      );
      complete(resp);
    } catch (err) {
      console.log(err.response);
      fail("Something went wrong");
    }
  };

  const cancelRequest = async () => {
    try {
      start();
      const { resp } = await axiosInstance.delete(
        `/users/${userId}/request-document`
      );
      complete(resp);
    } catch (err) {
      console.log(err.response);
      fail("Something went wrong");
    }
  };

  return (
    <AdminOnly>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Request Document
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Enter the name of document you want to be uploaded (eg. Driver's
          License)
        </Text>
        {user.isDocumentRequested && (
          <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
            Currently requested document:
            <SubText bold font="14px">
              {user.requestedDocument}
            </SubText>
          </Text>
        )}
      </Container>

      <Container as="form" p="12px" wide onSubmit={handleSubmit(openModal)}>
        <Input
          label="Document Name"
          placeholder="Name of document"
          radius="8px"
          ref={register({
            required: true,
          })}
          name="documentName"
          error={errors.documentName?.message}
        />
        <Textarea
          label="Description"
          placeholder="Short description"
          rows="6"
          radius="8px"
          ref={register}
          name="description"
          error={errors.description?.message}
        />

        <Button
          type="submit"
          bg="primary"
          m="24px 0"
          radius="4px"
          bold
          full
          disabled={isSubmitting}
        >
          {user.isDocumentRequested ? "Update Request" : "Request"}
        </Button>
      </Container>
      {user.isDocumentRequested && (
        <Container p="12px">
          <Button
            type="submit"
            bg="danger"
            radius="4px"
            bold
            full
            onClick={openCancelModal}
          >
            Cancel Request
          </Button>
        </Container>
      )}

      <ConfirmationModal
        open={showModal}
        dismiss={closeModal}
        action={requestDocument}
        title="Request Document"
        message="Are you sure you want to make this request?"
      />

      <ConfirmationModal
        open={showCancelModal}
        dismiss={closeCancelModal}
        action={cancelRequest}
        title="Cancel Request"
        message="Are you sure you want to cancel this request?"
      />

      <ProcessModal
        title="Requesting"
        open={show}
        processing={processing}
        response={response}
        success={success}
        dismiss={close}
      />
    </AdminOnly>
  );
};

export default DocumentRequest;
