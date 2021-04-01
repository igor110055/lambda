import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";

import DocumentItem from "../../../molecules/DocumentItem";

import ConfirmationModal from "../../../organisms/ConfirmationModal";

import { useAdminUser } from "../../../../hooks/useUsers";
import { useToggle } from "../../../../hooks/useToggle";

import axiosInstance from "../../../../utils/axios";

const Documents = () => {
  const { userId } = useParams();
  const { user, mutate } = useAdminUser(userId);

  const [id, setId] = useState();

  const {
    show: showDeleteDocument,
    toggle: toggleDeleteDocument,
  } = useToggle();

  const destroyPrompt = (cloudId) => {
    setId(cloudId);
    toggleDeleteDocument();
  };

  const destroy = async () => {
    try {
      await axiosInstance.delete(
        `/users/${user._id}/documents/${encodeURIComponent(id)}`
      );
      mutate();
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          {user.firstName}'s Documents
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Manage all documents added by {user.fullName}
        </Text>
      </Container>

      <Text font="13px" p="12px" bold>
        ID Documents
      </Text>
      <Container p="12px" wide>
        <DocumentItem
          title="ID Front"
          document={user.idFront}
          destroy={destroyPrompt}
        />
        <DocumentItem
          title="ID Back"
          document={user.idBack}
          destroy={destroyPrompt}
        />
        <DocumentItem
          title="Document Selfie"
          document={user.documentSelfie}
          destroy={destroyPrompt}
        />
      </Container>

      <Text font="13px" p="12px" bold>
        Other Documents
      </Text>
      <Container p="12px" wide>
        {user.documents.map((document) => (
          <DocumentItem
            key={document.cloudId}
            title={document.name}
            document={document}
            destroy={destroyPrompt}
          />
        ))}
      </Container>

      <ConfirmationModal
        open={showDeleteDocument}
        title="Delete Document"
        message="Are you sure you want to delete this document?"
        action={destroy}
        dismiss={toggleDeleteDocument}
        preventDismiss
      />
    </>
  );
};

export default Documents;
