import React from "react";
import { useProfile } from "../../hooks/useProfile";
import Container from "../atoms/Container";
import Text from "../atoms/Text";

const Upgrade = (props) => {
  const { profile } = useProfile();

  if (profile.meta.requireUpgrade)
    return (
      <Container p="12px" wide {...props}>
        <Container bg="primary" p="6px" radius="8px" wide>
          <Text>
            Please Upgrade Your Account,{" "}
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
      </Container>
    );

  if (profile.isDocumentRequested)
    return (
      <Container p="12px" wide {...props}>
        <Container bg="primary" p="6px" radius="8px" wide>
          <Text>
            Please Upload Required documents,{" "}
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
      </Container>
    );

  return null;
};

export default Upgrade;
