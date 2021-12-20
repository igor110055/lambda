import React from "react";
import Container from "../atoms/Container";
import AuthNavBar from "../organisms/AuthNavBar";

const Auth = ({ children }) => {
  return (
    <Container
      flex="center"
      bg="bgImage"
      m="48px 0 0 0"
      h="calc(100% - 48px)"
      minH="calc(100vh - 48px)"
    >
      <AuthNavBar />

      <Container
        p="16px"
        m="64px 0"
        bg="bgContrast"
        radius="6px"
        maxW="calc(100vw - 28px)"
        w="400px"
        h="auto"
      >
        {children}
      </Container>
    </Container>
  );
};

export default Auth;
