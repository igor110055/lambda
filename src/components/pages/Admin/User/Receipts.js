import React from "react";
import { useParams } from "react-router-dom";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";

import DocumentItem from "../../../molecules/DocumentItem";

import { useAdminUser } from "../../../../hooks/useUsers";

const Receipts = () => {
  const { userId } = useParams();
  const { user } = useAdminUser(userId);

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          {user.firstName}'s Receipts
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Manage all receipts added by {user.fullName}
        </Text>
      </Container>

      <Container p="12px" wide>
        {user.receipts.map((document) => (
          <DocumentItem
            key={document.cloudId}
            title={new Date(document.date).toDateString()}
            document={document}
          />
        ))}
      </Container>
    </>
  );
};

export default Receipts;
