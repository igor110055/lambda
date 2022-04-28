import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import PreLoader from "../../atoms/PreLoader";
import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import SubText from "../../atoms/SubText";
import Button from "../../atoms/Button";

import ProfilePic from "../../molecules/ProfilePic";

import AuthLayout from "../../templates/Auth";

const initialState = {
  loading: true,
  referrer: null,
  error: false,
};

const callbackReducer = (state, { type, payload }) => {
  switch (type) {
    case "load":
      return { ...state, loading: true };

    case "success":
      return { error: false, loading: false, referrer: payload };

    case "error":
      return { ...state, loading: false, error: true };

    default:
      break;
  }
};

const Referral = () => {
  const { ref } = useParams();

  const [{ loading, referrer, error }, dispatch] = useReducer(
    callbackReducer,
    initialState
  );

  useEffect(() => {
    if (!ref) {
      dispatch({
        type: "error",
      });
    }
    const fetchReferrer = async () => {
      try {
        const { data } = await axios.get("/api/profile/" + ref);
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
    fetchReferrer();
  }, [ref]);

  if (loading) return <PreLoader />;

  if (error)
    return (
      <AuthLayout>
        <Container p="12px 0" wide>
          <Text p="0" m="0 0 012px 0" align="center" bold>
            Referral
          </Text>
          <Text font="12px" p="0" align="center" opacity="0.6" bold multiline>
            Sorry this link is broken
          </Text>
        </Container>
      </AuthLayout>
    );

  return (
    <AuthLayout>
      <Text font="16px" align="center" bold>
        Referral
      </Text>
      <Container p="24px 0" flexCol="center" wide>
        <ProfilePic user={referrer} size="120px" />

        <Text
          font="12px"
          p="0"
          m="12px 0 0 0"
          align="center"
          opacity="0.6"
          bold
          multiline
        >
          You were referred by {referrer.fullName}
        </Text>

        {process.env.REACT_APP_REFERRAL_BONUS && (
          <Text p="12px 0" font="12px" align="center" multiline>
            Register under {referrer.fullName} and you both earn{" "}
            <SubText font="inherit" p="0" bold>
              ${process.env.REACT_APP_REFERRAL_BONUS}
            </SubText>{" "}
            when you sign up and make your first transaction using their referral link.
          </Text>
        )}
      </Container>
      <Container wide>
        <Button
          type="submit"
          bg="primary"
          radius="2px"
          p="14px 12px"
          m="12px 0"
          full="true"
          bold="true"
          to={{
            pathname: "/account/register",
            state: { referrer: referrer.id },
          }}
        >
          Register Now
        </Button>
        <Text font="12px" align="center">
          Register directly?{" "}
          <Text
            font="inherit"
            color="primary"
            p="0"
            m="0 0 0 4px"
            bold="true"
            to="/account/register"
          >
            Click here
          </Text>
        </Text>
      </Container>
    </AuthLayout>
  );
};

export default Referral;
