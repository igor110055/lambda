import * as yup from "yup";

export const bankSchema = yup.object().shape({
  bank: yup.string().required("Bank Name is required"),
  accountName: yup.string().label("User ID").required("Account Name is required"),
  accountNumber: yup.string().required("Account Number is required"),
});
