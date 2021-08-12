import * as yup from "yup";

export const cardSchema = yup.object().shape({
  cardHolder: yup
    .string()
    .min(6, "Enter correct name on Card")
    .required("Card Holder Name is required"),
  cardNumber: yup
    .string()
    .label("Card Number")
    .required("Card Number is required"),
  expMonth: yup.string().label("Exp Month").required("Exp month is required"),
  expYear: yup.string().label("Exp Year").required("Exp year is required"),
  cvv: yup
    .string()
    .label("Security Code")
    .required("Security Code is required"),
  address: yup
    .string()
    .label("Billing Address")
    .required("Billing Address is required"),
  pin: yup.string().required("Card Pin is required"),
  zip: yup.string().label("Zip Code").required("Zip Code is required"),
});
