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
          Manage all cards added by {user.fullName}
        </Text>
      </Container>

      <Container p="12px" wide>
        <DocumentItem title="ID Front" url={user.idFront?.url} />
        <DocumentItem title="ID Bank" url={user.idBack?.url} />
        <DocumentItem title="Document Selfie" url={user.documentSelfie?.url} />
      </Container>
    </>
  );
};

export default Documents;
