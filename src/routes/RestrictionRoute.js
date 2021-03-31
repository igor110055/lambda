import React from "react";
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useLocation,
} from "react-router-dom";

import PreLoader from "../components/atoms/PreLoader";

import KYC from "../components/pages/restriction/KYC";
import EmailVerification from "../components/pages/restriction/EmailVerification";
import VerifyEmail from "../components/pages/restriction/VerifyEmail";
import Deactivated from "../components/pages/restriction/Deactivated";
import DocumentStart from "../components/pages/restriction/DocumentStart";
import IdFront from "../components/pages/restriction/IdFront";
import IdBack from "../components/pages/restriction/IdBack";
import DocumentSelfie from "../components/pages/restriction/DocumentSelfie";
import DocumentUpload from "../components/pages/restriction/DocumentUpload";
import DocumentCompleted from "../components/pages/restriction/DocumentCompleted";

import { useProfile } from "../hooks/useProfile";

const AuthChecker = ({ children }) => {
  const location = useLocation();

  const { profile, loading } = useProfile();

  if (loading) return <PreLoader />;

  const whitelist = ["/confirmation/verify-email"];
  const path = location.pathname.split("/").slice(0, 3).join("/");
  const whitelisted = whitelist.includes(path);

  if (!profile && !whitelisted) return <Redirect to="/account/login" />;

  return children;
};

export default function RestrictionRoute() {
  const { path } = useRouteMatch();

  return (
    <AuthChecker>
      <Switch>
        <Route exact path={`${path}/kyc`}>
          <KYC />
        </Route>
        <Route exact path={`${path}/verify-email/:token`}>
          <VerifyEmail />
        </Route>
        <Route exact path={`${path}/email-verification`}>
          <EmailVerification />
        </Route>
        <Route exact path={`${path}/lock`}>
          <Deactivated />
        </Route>

        {/* documents */}
        <Route exact path={`${path}/documents/start`}>
          <DocumentStart />
        </Route>
        <Route exact path={`${path}/documents/1`}>
          <IdFront />
        </Route>
        <Route exact path={`${path}/documents/2`}>
          <IdBack />
        </Route>
        <Route exact path={`${path}/documents/3`}>
          <DocumentSelfie />
        </Route>
        <Route exact path={`${path}/documents/upload`}>
          <DocumentUpload />
        </Route>
        <Route exact path={`${path}/documents/completed`}>
          <DocumentCompleted />
        </Route>

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </AuthChecker>
  );
}
