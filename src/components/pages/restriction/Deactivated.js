import React from "react";
import { Redirect } from "react-router-dom";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";

import AuthLayout from "../../templates/Auth";

import { useProfile } from "../../../hooks/useProfile";

const Deactivated = () => {
  const { profile, logout } = useProfile();

  if (profile.meta.isActive) return <Redirect to="/dashboard" />;

  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text p="0" m="0 0 012px 0" align="center" bold>
          Account Disabled
        </Text>
        <Text font="12px" p="0" align="center" opacity="0.6" bold multiline>
          Your account has been deactivated
        </Text>
      </Container>
      <Container wide>
        <Text font="12px" align="center" opacity="0.6" bold multiline>
          If you think this is a mistake kindly send us a message
        </Text>
        <Button
          type="submit"
          bg="secondary"
          // color="black"
          radius="2px"
          m="12px 0"
          full
          bold
          onClick={logout}
        >
          Log Out
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default Deactivated;
