import React from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";

import { useProfile } from "../../hooks/useProfile";

const Upgrade = (props) => {
  const { profile } = useProfile();

  if (profile.meta.requireUpgrade)
    return (
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
    );

  if (profile.isDocumentRequested)
    return (
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
    );

  return null;
};

export default Upgrade;
