import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { usePayments } from "../../hooks/usePayments";
import Button from "../atoms/Button";
import Container from "../atoms/Container";
import SubText from "../atoms/SubText";
import Text from "../atoms/Text";
import { PaymentsLoader } from "../molecules/Loader/PaymentsLoader";
import PaymentItem from "../molecules/PaymentItem";
import DashboardLayout from "../templates/Dashboard";

const Payments = () => {
  const { payments, loading } = usePayments();

  return (
    <DashboardLayout>
      <Container p="12px" borderbottom="1px solid" wide>
        <Text font="16px" p="12px 0" bold>
          Pending Payments
        </Text>
        <Container p="12px 0" wide>
          <Text p="0" font="12px" opacity="0.6" bold multiline>
            View all your outstanding payments. NB: payments not cleared may
            leave funds inaccessible
          </Text>
        </Container>
        <Container m="12px 0 0" flex="flex-start" wide>
          <Button
            p="8px 24px"
            radius="6px"
            bg="primary"
            bold="true"
            to="/dashboard/wallets"
          >
            My Accounts
          </Button>
          <Button
            p="8px 20px"
            m="0 0 0 12px"
            radius="6px"
            bg="secondary"
            flexalign="true"
            to="/dashboard"
          >
            <SubText font="inherit" bold="true" p="0" m="0 8px 0 0" flexalign>
              <FaArrowLeft />
            </SubText>
            <SubText font="inherit" bold="true" p="0" m="0">
              Go Back
            </SubText>
          </Button>
        </Container>
      </Container>

      {loading ? (
        <Container p="12px" wide>
          <PaymentsLoader />
        </Container>
      ) : (
        <Container display="grid" gap="16px" minH="240px" p="12px" wide>
          {payments.length ? (
            payments.map((payment) => (
              <PaymentItem key={payment._id} payment={payment} />
            ))
          ) : (
            <Container minH="240px" flexCol="center">
              <Text opacity="0.6" bold>
                No pending payment
              </Text>
            </Container>
          )}
        </Container>
      )}
    </DashboardLayout>
  );
};

export default Payments;
