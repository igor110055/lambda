import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

import PhoneInput from "../../molecules/PhoneInput";

import AuthLayout from "../../templates/Auth";

import { useProfile } from "../../../hooks/useProfile";

import { profileSchema } from "../../../validators/profile";

import axiosInstance from "../../../utils/axios";

import countries from "../../../store/countries";

const KYC = () => {
  const history = useHistory();
  const { profile, mutate } = useProfile();

  const { register, handleSubmit, errors, formState } = useForm({
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      profile: {
        phone: "",
        gender: "",
        city: "",
        country: countries.find((c) => c.code === "US")?.name || "",
      },
    },
    resolver: yupResolver(profileSchema),
  });

  const {
    profile: { country },
  } = watch();

  const { isSubmitting } = formState;

  const onSubmit = async (formData) => {
    try {
      await axiosInstance.put("/profile", formData);
      await mutate();
      history.push("/dashboard");
    } catch (err) {
      // console.log(err);
    }
  };

  if (profile.profile) return <Redirect to="/dashboard" />;

  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text font="16px" p="0" align="center" bold>
          KYC Verification
        </Text>
        <Text
          font="12px"
          p="0"
          m="12px 0 0 0"
          align="center"
          opacity="0.6"
          bold
          multiline
        >
          Kindly complete identification process to complete verification
        </Text>
      </Container>
      <Container as="form" wide onSubmit={handleSubmit(onSubmit)}>
        <input hidden ref={register} name="firstName" />
        <input hidden ref={register} name="lastName" />
        <Select
          radius="6px"
          p="12px"
          label="Country"
          ref={register}
          name="profile.country"
          error={errors.profile?.country?.message}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </Select>
        <Input
          radius="6px"
          p="12px"
          label="City"
          placeholder="City"
          ref={register}
          name="profile.city"
          error={errors.profile?.city?.message}
        />
        {country === "United States" && (
          <Input
            radius="6px"
            p="12px"
            label="Social Security Number"
            placeholder="SSN"
            ref={register}
            name="profile.ssn"
            error={errors.profile?.ssn?.message}
          />
        )}

        <PhoneInput
          radius="6px"
          p="12px"
          type="tel"
          label="Phone Number"
          placeholder="Phone Number"
          ref={register}
          name="profile.phone"
          error={errors.profile?.phone?.message}
        />
        <Select
          radius="6px"
          p="12px"
          label="Gender"
          ref={register}
          name="profile.gender"
          error={errors.profile?.gender?.message}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>

        <Button
          type="submit"
          bg="primary"
          radius="2px"
          p="14px 12px"
          m="12px 0"
          font="13px"
          full
          bold
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Submit"}
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default KYC;
