import React, { useEffect } from "react";
import { useLocation } from "react-router";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";

import AuthLayout from "../../templates/Auth";

import { useProfile } from "../../../hooks/useProfile";

const DocumentCompleted = () => {
  const { state } = useLocation();
  const { mutate } = useProfile();

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text font="16px" p="0" align="center" bold>
          {state?.title || "Verification Completed"}
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
          {state?.message ||
            "Thank you. Your documents are being processed"}
        </Text>
      </Container>
      <Container wide>
        <Button
          type="submit"
          bg="primary"
          radius="6px"
          p="12px 12px"
          m="12px 0"
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
