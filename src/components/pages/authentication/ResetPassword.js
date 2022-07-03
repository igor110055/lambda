import React, { useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Input from "../../atoms/Input";
import Checkbox from "../../atoms/Checkbox";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";

import PreLoader from "../../atoms/PreLoader";

import AuthLayout from "../../templates/Auth";

import { resetPasswordSchema } from "../../../validators/password";

import axiosInstance from "../../../utils/axios";

const initialState = {
  loading: true,
  valid: false,
};

const callbackReducer = (state, { type }) => {
  switch (type) {
    case "load":
      return { ...state, loading: true };

    case "success":
      return { loading: false, valid: true };

    case "error":
      return { loading: false, valid: false };

    default:
      break;
  }
};

const ResetPassword = () => {
  const history = useHistory();
  const { token } = useParams();

  const [{ loading, valid }, dispatch] = useReducer(
    callbackReducer,
    initialState
  );

  useEffect(() => {
    if (!token) {
      dispatch({
        type: "error",
      });
    }
    // console.log(token);
    const verifyToken = async () => {
      try {
        await axiosInstance.post("/auth/reset-password/token", {
          passwordResetToken: token,
        });
        dispatch({
          type: "success",
        });
      } catch (err) {
        // console.log(err.response);
        dispatch({
          type: "error",
        });
      }
    };
    verifyToken();
  }, [token]);

  const { register, handleSubmit, watch, formState, errors } = useForm({
    defaultValues: {
      password: "",
      pass: "",
      showPassword: false,
    },
    resolver: yupResolver(resetPasswordSchema),
  });

  const { showPassword } = watch();
  const { isSubmitting } = formState;

  const resetPassword = async ({ showPassword, ...formData }) => {
    formData.passwordResetToken = token;
    try {
      await axiosInstance.post("/auth/reset-password/change", formData);
      history.push("/account/login");
    } catch (err) {
      // console.log(err.response);
    }
  };

  if (loading) return <PreLoader />;

  if (!valid)
    return (
      <AuthLayout>
        <Container p="12px 0" wide>
          <Text p="0" m="0 0 012px 0" align="center" bold>
            Reset Password
          </Text>
          <Text font="12px" p="0" align="center" opacity="0.6" bold multiline>
            Sorry this link is broken
          </Text>
        </Container>
      </AuthLayout>
    );

  return (
    <AuthLayout>
      <Container p="12px 0" wide>
        <Text font="16px" p="0" align="center" bold>
          Reset Password
        </Text>
        <Text
          font="12px"
          p="0"
          m="12px 0 0 0"
          opacity="0.6"
          align="center"
          bold
          multiline
        >
          Updating your password would log you out of all devices
        </Text>
      </Container>

      <Container as="form" wide onSubmit={handleSubmit(resetPassword)}>
        <Input
          radius="6px"
          p="14px 12px"
          type={showPassword ? "text" : "password"}
          label="New Password"
          placeholder="New Password"
          ref={register}
          name="password"
          error={errors.password?.message}
        />
        <Input
          radius="6px"
          p="14px 12px"
          type={showPassword ? "text" : "password"}
          label="Confirm Password"
          placeholder="Confirm Password"
          ref={register}
          name="pass"
          error={errors.pass?.message}
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
          m="24px 0"
          full
          bold
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Reset Password"}
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default ResetPassword;
