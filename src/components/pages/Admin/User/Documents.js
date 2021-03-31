import React from "react";
import { useParams } from "react-router-dom";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";

import { useAdminUser } from "../../../../hooks/useUsers";

import DocumentItem from "../../../molecules/DocumentItem";

const Documents = () => {
  const { userId } = useParams();
  const { user } = useAdminUser(userId);

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
          date={user.idFront?.date}
          url={user.idFront?.url}
        />
        <DocumentItem
          title="ID Bank"
          date={user.idBack?.date}
          url={user.idBack?.url}
        />
        <DocumentItem
          title="Document Selfie"
          date={user.documentSelfie?.date}
          url={user.documentSelfie?.url}
        />
      </Container>

      <Text font="13px" p="12px" bold>
        Other Documents
      </Text>
      <Container p="12px" wide>
        {user.documents.map((document) => (
          <DocumentItem
            title={document.name}
            date={document.date}
            url={document.url}
          />
        ))}
      </Container>
    </>
  );
};

export default Documents;
