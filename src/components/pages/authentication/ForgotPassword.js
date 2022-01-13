import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

import AuthLayout from "../../templates/Auth";

import { forgotPasswordSchema } from "../../../validators/password";

const ForgotPassword = () => {
  const [done, setDone] = useState(false);

  const { register, handleSubmit, errors, setError, formState } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { isSubmitting } = formState;

  const onSubmit = async ({ email }) => {
    try {
      await axios.post(
        "/api/auth/reset-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setDone(true);
    } catch (err) {
      // console.log(err.response);
      setError("email", {
        type: "server",
        message: "Unable to find account",
      });
    }
  };

  return (
    <AuthLayout>
      {done ? (
        <Text multiline>
          Please check your email to continue. We have sent you a link to reset
          your password
        </Text>
      ) : (
        <>
          <Container p="12px 0" wide>
            <Text font="16px" p="0" align="center" bold>
              Reset Password
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
              Enter your email address to find your account
            </Text>
          </Container>
          <Container as="form" wide onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="email"
              radius="6px"
              p="14px 12px"
              m="12px 0"
              placeholder="Email Address"
              label="Email Address"
              error={errors.email?.type !== "server" && errors.email?.message}
              ref={register}
              name="email"
            />

            {errors.email?.type === "server" && (
              <Text
                font="12px"
                p="0"
                m="24px 0 0"
                color="red"
                align="center"
                bold
              >
                {errors.email?.message}
              </Text>
            )}

            <Button
              type="submit"
              bg="primary"
              radius="2px"
              p="14px 12px"
              m="12px 0"
              full
              bold
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : "Reset Password"}
            </Button>
            <Text font="12px" align="center">
              Remember your password?{" "}
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
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
