import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../../atoms/Container";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";

import ControlledDateInput from "../../molecules/ControlledDateInput";

import ConfirmationModal from "../../organisms/ConfirmationModal";

import { useToggle } from "../../../hooks/useToggle";
import { useProfile } from "../../../hooks/useProfile";

import { profileSchema } from "../../../validators/profile";

import axiosInstance from "../../../utils/axios";

import countries from "../../../store/countries";

const PersonalInformation = () => {
  const history = useHistory();
  const { profile, mutate } = useProfile();

  const {
    show: showConfirmationModal,
    toggle: toggleConfirmationModal,
  } = useToggle();

  const {
    register,
    control,
    handleSubmit,
    formState,
    getValues,
    errors,
    setError,
  } = useForm({
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      profile: {
        phone: profile.profile?.phone,
        gender: profile.profile?.gender,
        dob: profile.profile?.dob,
        city: profile.profile?.city,
        zipCode: profile.profile?.zipCode,
        country: profile.profile?.country,
        employmentStatus: profile.profile?.employmentStatus,
      },
    },
    resolver: yupResolver(profileSchema),
  });

  const { isSubmitting } = formState;

  const updateProfile = async () => {
    const formData = getValues();

    try {
      await axiosInstance.put("/profile", formData);
      mutate();
      history.push("/dashboard/settings");
    } catch (err) {
      if (err.response?.data?.message?.includes("profile.phone")) {
        setError("profile.phone", {
          types: "server",
          message: "Invalid Phone",
        });
      }
    }
  };

  return (
    <Container wide>
      <Container flexCol="center" h="120px">
        <Text p="0" m="0 0 12px 0" font="14px" bold>
          Personal Information
        </Text>
        <Text p="0" font="12px" opacity="0.6" align="center" bold multiline>
          Update your name and profile information
        </Text>
      </Container>

      <Container
        as="form"
        p="12px"
        onSubmit={handleSubmit(toggleConfirmationModal)}
      >
        <Container flex="space-between" m="8px 0" wide>
          <Input
            w="calc(50% - 6px)"
            radius="8px"
            label="First Name"
            placeholder="First Name"
            ref={register}
            name="firstName"
            error={errors.firstName?.message}
          />
          <Input
            w="calc(50% - 6px)"
            radius="8px"
            label="Last Name"
            placeholder="Last Name"
            ref={register}
            name="lastName"
            error={errors.lastName?.message}
          />
        </Container>

        <Select
          radius="8px"
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
          radius="8px"
          label="Zip Code"
          placeholder="Zip Code"
          ref={register}
          name="profile.zipCode"
          error={errors.profile?.zipCode?.message}
        />
        <Input
          radius="8px"
          label="City"
          placeholder="City"
          ref={register}
          name="profile.city"
          error={errors.profile?.city?.message}
        />
        <Input
          radius="8px"
          type="tel"
          label="Phone Number"
          placeholder="Phone Number"
          ref={register}
          name="profile.phone"
          error={errors.profile?.phone?.message}
        />
        <Select
          radius="8px"
          label="Employment Status"
          ref={register}
          name="profile.employmentStatus"
          error={errors.profile?.employmentStatus?.message}
        >
          <option value="Employed">Employed</option>
          <option value="Unemployed">Unemployed</option>
          <option value="Self Employed">Self Employed</option>
          <option value="Retired">Retired</option>
        </Select>
        <Select
          radius="8px"
          label="Gender"
          ref={register}
          name="profile.gender"
          error={errors.profile?.gender?.message}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <ControlledDateInput
          label="Date of Birth"
          hint="Pick Date"
          placeholder="Date of Birth"
          radius="8px"
          control={control}
          name="profile.dob"
          error={errors.profile?.dob?.message}
        />

        <Button
          type="submit"
          bg="primary"
          m="24px 0"
          full
          radius="4px"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing" : "Update Profile"}
        </Button>
        <ConfirmationModal
          open={showConfirmationModal}
          title="Update Profile"
          message="Are you sure you want to continue?"
          action={updateProfile}
          dismiss={toggleConfirmationModal}
        />
      </Container>
    </Container>
  );
};

export default PersonalInformation;
