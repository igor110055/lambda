import { parseBalance } from "./parseBalance";

// get payments not greater than current date
export const toDatePayments = (payments) =>
  payments?.filter(
    (payment) =>
      new Date(payment.date).setHours(0, 0, 0, 0) <=
      new Date().setHours(0, 0, 0, 0)
  );

// total
export const total = (payments) => {
  const balance = toDatePayments(payments)
    ?.filter((payment) => !payment.completed)
    ?.reduce((total, payment) => total + payment.amount, 0);
  return parseBalance(balance);
};
