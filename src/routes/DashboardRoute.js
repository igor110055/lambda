import React from "react";
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useLocation,
} from "react-router-dom";

import PreLoader from "../components/atoms/PreLoader";

import Dashboard from "../components/pages/Dashboard";
import Transactions from "../components/pages/Transactions";
import Transaction from "../components/pages/Transaction";
import Investment from "../components/pages/Investment";
import Wallets from "../components/pages/Wallets";
import Messages from "../components/pages/Messages";
import Payments from "../components/pages/Payments";
import Settings from "../components/pages/Settings";
import Admin from "../components/pages/Admin";

import { useProfile } from "../hooks/useProfile";

const AuthChecker = ({ children }) => {
  const { pathname } = useLocation();
  const { profile, loading } = useProfile();

  if (loading) return <PreLoader />;

  if (!profile) {
    const redirect = {
      pathname: "/account/login",
      state: {
        from: pathname,
      },
    };
    return <Redirect to={redirect} />;
  }

  if (!profile.meta.isEmailVerified)
    return <Redirect to="/confirmation/email-verification" />;

  if (!profile.profile) {
    if (!(profile.role === "admin" || profile.role === "moderator")) {
      return <Redirect to="/confirmation/kyc" />;
    }
  }

  if (!profile.meta.isActive) return <Redirect to="/confirmation/lock" />;

  if (!profile.isDocumentVerified) {
    if (!(profile.role === "admin" || profile.role === "moderator")) {
      return <Redirect to="/confirmation/documents/start" />;
    }
  }

  return children;
};

export default function DashboardRoute() {
  const { path, url } = useRouteMatch();

  return (
    <AuthChecker>
      <Switch>
        <Route exact path={`${path}`}>
          <Dashboard />
        </Route>
        <Route path={`${path}/transactions/:id`}>
          <Transaction />
        </Route>
        <Route path={`${path}/investment/:id`}>
          <Investment />
        </Route>
        <Route path={`${path}/transactions`}>
          <Transactions />
        </Route>
        <Route path={`${path}/wallets`}>
          <Wallets />
        </Route>
        <Route path={`${path}/payments`}>
          <Payments />
        </Route>
        <Route path={`${path}/messages`}>
          <Messages />
        </Route>
        <Route path={`${path}/settings`}>
          <Settings />
        </Route>

        {/* admin route */}
        <Route path={`${path}/admin`}>
          <Admin />
        </Route>

        <Route>
          <Redirect to={`${url}`} />
        </Route>
      </Switch>
    </AuthChecker>
  );
}
