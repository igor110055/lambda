import * as yup from "yup";

export const profileSchema = yup.object({
  firstName: yup.string().trim().required("First Name is required"),
  lastName: yup.string().trim().required("Last Name is required"),
  profile: yup
    .object({
      phone: yup.string().required("Phone Number is required"),
      gender: yup.string().required("Gender is required"),
      city: yup.string().required("City is required"),
      country: yup.string().required("Country is required"),
    })
    .required("Profile is required"),
});
