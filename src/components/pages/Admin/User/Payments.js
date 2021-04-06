import React from "react";
import { useParams } from "react-router-dom";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";

import AddButton from "../../../molecules/AddButton";
import PaymentItem from "../../../molecules/PaymentItem";
import { PaymentsLoader } from "../../../molecules/Loader";

import { useAdminUser } from "../../../../hooks/useUsers";
import { useAdminUserPayments } from "../../../../hooks/usePayments";

import { AdminDisplay } from "../common/AdminChecker";

const Payments = () => {
  const { userId } = useParams();

  const { user } = useAdminUser(userId);
  const { payments, loading } = useAdminUserPayments(userId);

  return (
    <>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          {user.firstName}'s Payments
        </Text>
        <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
          Manage all payments for {user.fullName}
        </Text>
      </Container>

      <AdminDisplay>
        <AddButton title="Request Payment" to="./payments/add" />
      </AdminDisplay>

      <Container p="12px" wide>
        {loading ? (
          <PaymentsLoader />
        ) : payments.length ? (
          payments.map((payment) => (
            <PaymentItem
              key={payment._id}
              payment={payment}
              to={`/dashboard/admin/users/${payment.user}/payments/${payment._id}`}
              message="Edit Payment"
            />
          ))
        ) : (
          <Container minH="240px" flex="center">
            <Text opacity="0.6" bold>
              No Payments
            </Text>
          </Container>
        )}
      </Container>
    </>
  );
};

export default Payments;
