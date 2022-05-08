import React from "react";
import axios from "axios";
import storage from "local-storage-fallback";
import { useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Input from "../../atoms/Input";
import Checkbox from "../../atoms/Checkbox";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

import AuthLayout from "../../templates/Auth";

import { registrationSchema } from "../../../validators/auth";

import axiosInstance from "../../../utils/axios";
import { useProfile } from "../../../hooks/useProfile";

const Register = () => {
  const history = useHistory();
  const { state } = useLocation();

  const { mutate } = useProfile();

  const {
    register,
    handleSubmit,
    watch,
    errors,
    setError,
    formState,
  } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      pass: "",
      showPassword: false,
    },
    resolver: yupResolver(registrationSchema),
  });

  const { isSubmitting } = formState;
  const { showPassword } = watch();

  const onSubmit = async ({ showPassword, ...formData }) => {
    if (state?.referrer) {
      formData.referrer = state.referrer;
    }
    try {
      const { data } = await axios.post("/api/auth/register", formData);

      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + data.accessToken;
      storage.setItem("access_token", data.accessToken);
      storage.setItem("refresh_token", data.refreshToken);

      // console.log("logged in");
      await mutate();
      history.push(state?.from || "/dashboard");
    } catch (err) {
      console.log(err, err.response);
      if (err.response.data.status === 409) {
        setError("email", {
          type: "server",
          message: "Email Address already taken",
        });
      }
    }
  };

  return (
    <AuthLayout>
      <Text font="16px" align="center" bold>
        Create Account
      </Text>
      <Container as="form" wide onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          radius="6px"
          p="12px"
          m="12px 0"
          placeholder="Email Address"
          label="Email Address"
          error={errors.email?.message}
          ref={register}
          name="email"
        />
        <Container flex="space-between" m="8px 0" wide>
          <Input
            w="calc(50% - 6px)"
            radius="6px"
            p="12px"
            label="First Name"
            placeholder="First Name"
            ref={register}
            name="firstName"
            error={errors.firstName?.message}
          />
          <Input
            w="calc(50% - 6px)"
            radius="6px"
            p="12px"
            label="Last Name"
            placeholder="Last Name"
            ref={register}
            name="lastName"
            error={errors.lastName?.message}
          />
        </Container>
        <Input
          type={showPassword ? "text" : "password"}
          radius="6px"
          p="12px"
          m="12px 0"
          placeholder="Password"
          label="Password"
          error={errors.password?.message}
          ref={register}
          name="password"
        />
        <Input
          type={showPassword ? "text" : "password"}
          radius="6px"
          p="12px"
          m="12px 0"
          placeholder="Confirm Password"
          label="Confirm Password"
          error={errors.pass?.message}
          ref={register}
          name="pass"
        />

        <Checkbox
          m="0"
          label="Show password?"
          ref={register}
          name="showPassword"
        />
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
          {isSubmitting ? <Spinner /> : "Register"}
        </Button>
        <Text font="12px" align="center">
          Already have an account?{" "}
          <Text
            font="inherit"
            color="primary"
            p="0"
            m="0 0 0 4px"
            bold="true"
            to="/account/login"
          >
            Login
          </Text>
        </Text>
      </Container>
    </AuthLayout>
  );
};

export default Register;
