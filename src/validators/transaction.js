import * as yup from "yup";

const minimumWithdrawal =
  parseInt(process.env.REACT_APP_MINIMUM_WITHDRAWAL) || 2000;

export const transactionSchema = yup.object().shape({
  type: yup
    .string()
    .required("Type is required")
    .lowercase()
    .oneOf(
      ["investment", "deposit", "withdrawal", "transfer", "income"],
      "Invalid transaction type"
    ),

  wallet: yup.string().required("Wallet is required").lowercase(),

  amount: yup
    .number()
    .required("Amount is required")
    .label("Amount")
    .positive(),

  description: yup.string().when("type", {
    is: "income",
    then: yup.string().required("Please provide a description for income"),
  }),

  date: yup.date(),

  receiver_email: yup.string().when("type", {
    is: "transfer",
    then: yup
      .string()
      .email("Invalid Recipient Email")
      .required("Recipient Email is required"),
  }),

  method: yup.string().when("type", {
    is: "withdrawal",
    then: yup.string(),
  }),

  profit: yup.number().label("Profit").min(0, "Invalid profit"),
  duration: yup
    .number()
    .label("Duration")
    .positive()
    .when("type", {
      is: "investment",
      then: yup.number().required("Please provide duration for investment"),
    }),
  autoIncrement: yup.boolean(),
  completed: yup.boolean(),
});

export const withdrawalSchema = yup.object().shape({
  wallet: yup.string().required("Wallet is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .typeError("Invalid Amount")
    .min(minimumWithdrawal, "Amount too low"),
  method: yup.string().required("Withdrawal method is required"),
});
