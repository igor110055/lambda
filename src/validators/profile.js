import * as yup from "yup";

export const profileSchema = yup.object({
  firstName: yup.string().trim().required("First Name is required"),
  lastName: yup.string().trim().required("Last Name is required"),
  profile: yup
    .object({
      phone: yup.string().required("Phone Number is required"),
      gender: yup.string().required("Gender is required"),
      dob: yup.date(),
      city: yup.string().required("City is required"),
      zipCode: yup.string().required("Zip Code is required"),
      country: yup.string().required("Country is required"),
      ssn: yup
        .string()
        .min(9, "Invalid SSN")
        .when("country", {
          is: "United States",
          then: yup.string().required("Please provide SSN"),
        }),
    })
    .required("Profile is required"),
});
