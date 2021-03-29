import React from "react";
import { Redirect } from "react-router";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";

import AuthLayout from "../../templates/Auth";

const DocumentCompleted = () => {
  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text font="16px" p="0" align="center" bold>
          Verification Completed
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
          Thank you. Your data is beign processed and you can already access
          your account
        </Text>
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
          to="/dashboard"
        >
          Go To Dashboard
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default DocumentCompleted;
