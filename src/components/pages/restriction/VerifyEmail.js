import React, { useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";

import PreLoader from "../../atoms/PreLoader";

import AuthLayout from "../../templates/Auth";

import { useProfile } from "../../../hooks/useProfile";

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

const VerifyEmail = () => {
  const { token } = useParams();
  const history = useHistory();
  const { mutate } = useProfile();

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
    const verifyEmail = async () => {
      try {
        // console.log(token);
        const { data } = await axiosInstance.post("/auth/verify-email", {
          emailToken: token,
        });
        // console.log(data);
        dispatch({
          type: "success",
          payload: data,
        });
      } catch (err) {
        // console.log(err.response);
        dispatch({
          type: "error",
        });
      }
    };
    verifyEmail();
  }, [token]);

  const login = async () => {
    await mutate();
    history.push("/dashboard");
  };

  if (loading) return <PreLoader />;

  if (!valid)
    return (
      <AuthLayout>
        <Container p="12px 0" wide>
          <Text p="0" m="0 0 012px 0" align="center" bold>
            Email Verification
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
        <Text p="0" m="0 0 012px 0" align="center" bold>
          Email Verification
        </Text>
        <Text font="12px" p="0" align="center" opacity="0.6" bold multiline>
          Your email has been verified
        </Text>
      </Container>
      <Container wide>
        <Button
          type="submit"
          bg="primary"
          radius="2px"
          m="24px 0 12px"
          full
          bold
          onClick={login}
        >
          Log In
        </Button>
      </Container>
    </AuthLayout>
  );
};

export default VerifyEmail;
