import * as yup from "yup";

export const emailSchema = yup.object().shape({
  from: yup.string(),
  customFrom: yup.string().matches(/^[a-zA-Z]+$/, "Invalid sender"),
  email: yup
    .string()
    .required("Email is required")
    .label("Email")
    .email("Must be a valid email address")
    .lowercase(),
  title: yup.string().required("Title is required"),
});

export const userEmailSchema = yup.object().shape({
  from: yup.string(),
  customFrom: yup.string().matches(/^[a-zA-Z]+$/, "Invalid sender"),
  title: yup.string().required("Title is required"),
});
