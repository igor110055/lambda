import React from "react";

import Text from "../atoms/Text";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";

import { useMessages } from "../../hooks/useMessages";
import { usePayments } from "../../hooks/usePayments";

const Pending = () => {
  const { messages } = useMessages();
  const { payments } = usePayments();

  const pendingMessage = messages?.reduce(
    (acc, message) => (!message.read ? acc + 1 : acc),
    0
  );
  const pendingPayment = payments?.reduce(
    (acc, payment) => (!payment.completed ? acc + 1 : acc),
    0
  );

  return (
    <>
      {pendingMessage > 0 && (
        <Text flexalign p="0 12px" m="12px 0 12px" font="13px" opacity="0.8">
          You have {pendingMessage < 2 && "a"} new message
          {pendingMessage >= 2 && "s"}
          <Badge m="0 0 0 12px" bg="primary" size="18px" font="10px" bold>
            {pendingMessage}
          </Badge>
          <Button
            font="12px"
            p="0 12px"
            m="0 0 0 auto"
            bg="bg"
            color="text"
            radius="12px"
            bold="bold"
            to="/dashboard/messages"
          >
            View
          </Button>
        </Text>
      )}
      {pendingPayment > 0 && (
        <Text flexalign p="0 12px" m="12px 0 12px" font="13px" opacity="0.8">
          You have {pendingPayment < 2 && "a"} pending payment
          {pendingPayment >= 2 && "s"}
          <Badge m="0 0 0 12px" bg="primary" size="18px" font="10px" bold>
            {pendingPayment}
          </Badge>
          <Button
            font="12px"
            p="0 12px"
            m="0 0 0 auto"
            bg="bg"
            color="text"
            radius="12px"
            bold="true"
            to="/dashboard/payments"
          >
            View
          </Button>
        </Text>
      )}
    </>
  );
};

export default Pending;
