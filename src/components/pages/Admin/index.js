import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import DashboardLayout from "../../templates/Dashboard";

import Home from "./Home";
import User from "./User";
import Users from "./Users";
import Wallets from "./Wallets";
import Transactions from "./Transactions";
import Bank from "./Bank";

import AddUser from "./common/add/AddUser";
import AddWallet from "./common/add/AddWallet";

import EditWallet from "./common/edit/EditWallet";

import FindUser from "./common/find/FindUser";
import FindTransaction from "./common/find/FindTransaction";

import SendEmail from "./common/email/SendEmail";

import { useProfile } from "../../../hooks/useProfile";

const Admin = () => {
  const { path, url } = useRouteMatch();
  const { profile } = useProfile();

  if (!(profile.role === "admin" || profile.role === "moderator")) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <DashboardLayout>
      <Switch>
        <Route exact path={`${path}`}>
          <Home />
        </Route>
        <Route exact path={`${path}/users`}>
          <Users />
        </Route>
        <Route exact path={`${path}/wallets`}>
          <Wallets />
        </Route>
        <Route exact path={`${path}/transactions`}>
          <Transactions />
        </Route>

        {/* find routes */}
        <Route path={`${path}/users/find`}>
          <FindUser />
        </Route>
        <Route path={`${path}/transactions/find`}>
          <FindTransaction />
        </Route>

        {/* add routes */}
        <Route path={`${path}/users/add`}>
          <AddUser />
        </Route>
        <Route path={`${path}/wallets/add`}>
          <AddWallet />
        </Route>

        {/* edit routes */}
        <Route path={`${path}/wallets/:symbol`}>
          <EditWallet />
        </Route>

        {/* bank routes */}
        <Route path={`${path}/bank`}>
          <Bank />
        </Route>

        {/* email routes */}
        <Route path={`${path}/email`}>
          <SendEmail />
        </Route>

        {/* user route */}
        <Route path={`${path}/users/:userId`}>
          <User />
        </Route>

        <Route>
          <Redirect to={`${url}`} />
        </Route>
      </Switch>
    </DashboardLayout>
  );
};

export default Admin;
