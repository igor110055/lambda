import React from "react";
import styled from "styled-components";
import { FaInfoCircle } from "react-icons/fa";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Button from "../atoms/Button";

import Modal from "../molecules/Modal";

const InfoIcon = styled(FaInfoCircle)`
  width: 64px;
  height: 64px;
  margin: 12px;
  color: ${({ theme }) => theme.colors.primary};
`;

const ConfirmationModal = ({
  title,
  message,
  action: cb,
  open,
  dismiss,
  preventDismiss,
}) => {
  const action = () => {
    cb();
    dismiss();
  };

  return (
    <Modal open={open} dismiss={dismiss} preventDismiss={preventDismiss}>
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
        <InfoIcon />
        <Text font="12px" p="12px 0" align="center" multiline>
          {message}
        </Text>
        <Container m="12px 0" display="grid" flow="column" gap="12px" wide>
          <Button
            bg="secondary"
            p="12px"
            bold
            full
            onClick={dismiss}
          >
            Cancel
          </Button>
          <Button bg="primary" p="12px" bold full onClick={action}>
            Continue
          </Button>
        </Container>
      </Container>
    </Modal>
  );
};

export default ConfirmationModal;
