import React from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import Entry from "./Entry";

const PaymentItem = ({ payment, href, to, message, webPayment, ...props }) => {
  return (
    <Container
      p="12px"
      m="0 0 12px 0"
      radius="8px"
      bg="bg"
      display="block"
      wide="true"
      {...props}
    >
      <Text align="center" font="14px" bold>
        {payment.title}
      </Text>

      <Entry
        p="4px"
        title="Amount"
        titleStyle={{
          bold: true,
          opacity: "0.6",
        }}
      >
        {payment.amount}
      </Entry>

      <Entry
        p="4px"
        title="Date"
        titleStyle={{
          bold: true,
          opacity: "0.6",
        }}
      >
        {new Date(payment.date).toDateString()}
      </Entry>

      <Entry
        p="4px"
        title="Status"
        titleStyle={{
          bold: true,
          opacity: "0.6",
        }}
      >
        {payment.completed ? "Completed" : "Pending"}
      </Entry>

      <Button
        p="8px"
        m="12px 0 4px"
        bg="primary"
        full="true"
        bold="true"
        as={href ? "a" : undefined}
        href={href}
        to={to}
      >
        {message || "Pay Now"}
      </Button>
      {webPayment && (
        <Button
          p="8px"
          m="4px 0"
          bg="secondary"
          color="black"
          full="true"
          bold="true"
          to="/dashboard/wallets/btc/deposit"
        >
          Pay with web wallet
        </Button>
      )}
    </Container>
  );
};

export default PaymentItem;
