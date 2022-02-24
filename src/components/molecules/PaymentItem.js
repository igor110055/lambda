import React from "react";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import Entry from "./Entry";

const PaymentItem = ({ payment, ...props }) => {
  return (
    <Container
      p="0 12px 12px"
      m="0 0 12px"
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
    </Container>
  );
};

export default PaymentItem;
