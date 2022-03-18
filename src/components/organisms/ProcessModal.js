import React from "react";
import styled, { keyframes } from "styled-components";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";

import Modal from "../molecules/Modal";

const spin = keyframes`
  0% {
      transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingIcon = styled(CgSpinner)`
  width: 64px;
  height: 64px;
  margin: 12px;

  color: ${({ theme }) => theme.colors.primary};

  animation: ${spin} 0.8s linear infinite;
`;

const SuccessIcon = styled(FaCheckCircle)`
  width: 64px;
  height: 64px;
  margin: 12px;

  color: ${({ theme }) => theme.colors.success};
`;

const ErrorIcon = styled(FaTimesCircle)`
  width: 64px;
  height: 64px;
  margin: 12px;

  color: ${({ theme }) => theme.colors.danger};
`;

const ProcessModal = ({
  title,
  open,
  dismiss,
  processing,
  response,
  success,
}) => {
  return (
    <Modal open={open} dismiss={dismiss} preventDismiss>
      <Container
        flexCol="center"
        maxW="480px"
        w="90vw"
        h="auto"
        bg="bgContrast"
        p="16px"
        radius="12px"
      >
        <Text font="14px" p="0 0 12px" align="center" bold>
          {title}
        </Text>

        {processing ? (
          <LoadingIcon />
        ) : success ? (
          <SuccessIcon />
        ) : (
          <ErrorIcon />
        )}

        <Text align="center" font="11px" p="12px 0" bold multiline>
          {response}
        </Text>

        {processing ? (
          <Button
            bg="secondary"
            color="text"
            p="12px"
            m="12px 0"
            full
            disabled
          >
            <Spinner />
          </Button>
        ) : (
          <Button bg="actionBg" p="12px" m="12px 0" bold full onClick={dismiss}>
            Ok
          </Button>
        )}
      </Container>
    </Modal>
  );
};

export default ProcessModal;
