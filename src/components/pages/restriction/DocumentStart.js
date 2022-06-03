import React from "react";
import { Redirect } from "react-router";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";

import AuthLayout from "../../templates/Auth";

import { useProfile } from "../../../hooks/useProfile";

const Requirement = ({ title }) => (
  <Container p="12px 16px" m="0 0 12px 0" bg="bg" radius="8px" wide>
    <Text p="0" m="0 0 8px 0" opacity="0.8" font="12px" weight="500">
      {title}
    </Text>
  </Container>
);
const DocumentStart = () => {
  const { profile } = useProfile();

  if (profile.isDocumentVerified) return <Redirect to="/dashboard" />;

  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text font="16px" p="0" align="center" bold>
          Submit Documents
        </Text>
        <Text
          font="11px"
          p="0"
          m="12px 0 0 0"
          align="center"
          opacity="0.6"
          bold
          multiline
        >
          We need to verify your information. Please submit the following
          documents
        </Text>
      </Container>

      <Container p="12px 0" wide>
        <Requirement
          title="1.) Photo of Company ID (front side)"
        />
        <Requirement
          title="2.) Photo of Company ID (back side)"
        />
        <Requirement
          title="3.) Take a selfie holding your Company ID"
        />
      </Container>

      <Container wide>
        <Button
          type="submit"
          bg="primary"
          radius="6px"
          p="12px 12px"
          m="12px 0"
          font="13px"
          full="true"
          bold="true"
          to="/confirmation/documents/1"
        >
          Start Verification
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default DocumentStart;
