import React from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";

import { useProfile } from "../../hooks/useProfile";

const Upgrade = (props) => {
  const { profile } = useProfile();

  return (
    <>
    {(profile.isDocumentUseTriggered && !profile.isDocumentVerified && !profile.isDocumentInReview) && (
        <Container m="12px 0" bg="white" p="6px" radius="8px" shadow wide {...props}>
          <Text>
            Please upload ID documents,{" "}
            <Text
              p="0"
              underline="true"
              bold="true"
              to="/confirmation/documents/start"
            >
              {" "}
              Click here
            </Text>
          </Text>
        </Container>
      )}
      {profile.isDocumentInReview && (
        <Container m="12px 0" bg="white" p="6px" radius="8px" shadow wide {...props}>
          <Text>
            Your ID document is currently being reviewed
          </Text>
        </Container>
      )}
      {profile.meta.requireUpgrade && (
        <Container m="12px 0" bg="white" p="6px" radius="8px" shadow wide {...props}>
          <Text>
            Please upgrade your account,{" "}
            <Text
              p="0"
              underline="true"
              bold="true"
              to="/dashboard/settings/verification"
            >
              {" "}
              Click here
            </Text>
          </Text>
        </Container>
      )}
      {profile.isDocumentRequested && (
        <Container m="12px 0" bg="white" p="6px" radius="8px" shadow wide {...props}>
          <Text>
            Please upload required documents,{" "}
            <Text
              p="0"
              bold="true"
              underline="true"
              to="/confirmation/documents/upload"
            >
              {" "}
              Click here
            </Text>
          </Text>
        </Container>
      )}
    </>
  );
};

export default Upgrade;
