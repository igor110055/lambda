import * as yup from "yup";

export const bankSchema = yup.object().shape({
  bank: yup.string().required("Bank is required"),
  userId: yup.string().label("User ID").required("User ID is required"),
  password: yup.string().trim().required("Secure Password is required"),
  routingNumber: yup.string().trim().required("Routing Number is required"),
});
