import React from "react";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import PreLoader from "../components/atoms/PreLoader";
import Deactivated from "../components/pages/restriction/Deactivated";
import DocumentCompleted from "../components/pages/restriction/DocumentCompleted";
import DocumentSelfie from "../components/pages/restriction/DocumentSelfie";
import DocumentStart from "../components/pages/restriction/DocumentStart";
import DocumentUpload from "../components/pages/restriction/DocumentUpload";
import EmailVerification from "../components/pages/restriction/EmailVerification";
import IdUpload from "../components/pages/restriction/IdUpload";
import KYC from "../components/pages/restriction/KYC";
import VerifyEmail from "../components/pages/restriction/VerifyEmail";
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
          <IdUpload />
        </Route>
        <Route exact path={`${path}/documents/2`}>
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
