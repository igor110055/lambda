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

import { useProfile } from "../../../hooks/useProfile";

import { loginSchema } from "../../../validators/auth";

import axiosInstance from "../../../utils/axios";

const Login = () => {
  const history = useHistory();
  const { state } = useLocation();

  const { mutate } = useProfile();

  const { register, handleSubmit, watch, errors, setError, formState } =
    useForm({
      defaultValues: {
        email: "",
        password: "",
        showPassword: false,
      },
      resolver: yupResolver(loginSchema),
    });

  const { isSubmitting } = formState;
  const { showPassword } = watch();

  const onSubmit = async ({ showPassword, ...formData }) => {
    try {
      const { data } = await axios.post("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + data.accessToken;
      storage.setItem("access_token", data.accessToken);
      storage.setItem("refresh_token", data.refreshToken);

      // console.log("logged in");
      await mutate();
      history.push(state?.from || "/dashboard");
    } catch (err) {
      const status = err.response.data.status;
      setError("email", {
        type: "server",
        message:
          status === 401 || status === 422
            ? "Invalid Email Address or Password"
            : "Something went wrong",
      });
    }
  };

  return (
    <AuthLayout>
      <Text font="16px" align="center" bold>
        Login
      </Text>
      <Container as="form" wide onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          radius="6px"
          p="12px"
          m="12px 0"
          placeholder="Email Address"
          label="Email Address"
          error={errors.email?.type !== "server" && errors.email?.message}
          ref={register}
          name="email"
        />

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

        <Checkbox
          m="0"
          label="Show password?"
          ref={register}
          name="showPassword"
        />

        {errors.email?.type === "server" && (
          <Text font="12px" p="0" m="12px 0 0" color="red" align="center" bold>
            {errors.email?.message}
          </Text>
        )}
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
          {isSubmitting ? <Spinner /> : "Login"}
        </Button>
        <Text font="12px" align="center">
          Don't have an account?{" "}
          <Text
            font="inherit"
            color="primary"
            p="0"
            m="0 0 0 4px"
            bold="true"
            to="/account/register"
          >
            Create an Account
          </Text>
        </Text>
        <Text font="12px" p="0 0 12px" align="center">
          Forgot password?
          <Text
            color="primary"
            font="inherit"
            p="0"
            m="0 0 0 4px"
            bold="true"
            to="/account/forgot-password"
          >
            Click here
          </Text>
        </Text>
      </Container>
    </AuthLayout>
  );
};

export default Login;
