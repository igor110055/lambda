import React from "react";
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import PreLoader from "../../../atoms/PreLoader";

import Home from "./Home";
import Wallets from "./Wallets";
import Transactions from "./Transactions";
import Messages from "./Messages";
import Cards from "./Cards";
import Banks from "./Banks";
import Payments from "./Payments";
import Account from "./Account";

import AddTransaction from "../common/add/AddTransaction";
import AddMessage from "../common/add/AddMessage";
import AddPayment from "../common/add/AddPayment";

import EditMessage from "../common/edit/EditMessage";
import EditPayment from "../common/edit/EditPayment";
import EditTransaction from "../common/edit/EditTransaction";
import EditUserWallet from "../common/edit/EditUserWallet";

import SendUserEmail from "../common/email/SendUserEmail";

import Documents from "./Documents";
import DocumentRequest from "./DocumentRequest";
import Receipts from "./Receipts";

import { useAdminUser } from "../../../../hooks/useUsers";

const User = () => {
  const { path, url } = useRouteMatch();
  const { userId } = useParams();

  const { user, loading } = useAdminUser(userId);

  if (loading) return <PreLoader page />;

  if (!user) return <Redirect to="/dashboard/admin/users" />;

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Home />
      </Route>
      <Route path={`${path}/account`}>
        <Account />
      </Route>
      <Route exact path={`${path}/wallets`}>
        <Wallets />
      </Route>
      <Route exact path={`${path}/transactions`}>
        <Transactions />
      </Route>
      <Route exact path={`${path}/messages`}>
        <Messages />
      </Route>
      <Route exact path={`${path}/payments`}>
        <Payments />
      </Route>
      <Route path={`${path}/cards`}>
        <Cards />
      </Route>
      <Route path={`${path}/banks`}>
        <Banks />
      </Route>

      {/* add routes */}
      <Route path={`${path}/transactions/add`}>
        <AddTransaction />
      </Route>
      <Route path={`${path}/messages/add`}>
        <AddMessage />
      </Route>
      <Route path={`${path}/payments/add`}>
        <AddPayment />
      </Route>

      {/* edit routes */}
      <Route path={`${path}/transactions/:id`}>
        <EditTransaction />
      </Route>
      <Route path={`${path}/messages/:id`}>
        <EditMessage />
      </Route>
      <Route path={`${path}/payments/:id`}>
        <EditPayment />
      </Route>

      {/* modify wallet route */}
      <Route path={`${path}/wallets/:symbol`}>
        <EditUserWallet />
      </Route>

      {/* email route */}
      <Route path={`${path}/email`}>
        <SendUserEmail />
      </Route>

      {/* document route */}
      <Route path={`${path}/documents`}>
        <Documents />
      </Route>
      <Route path={`${path}/document-request`}>
        <DocumentRequest />
      </Route>
      <Route path={`${path}/receipts`}>
        <Receipts />
      </Route>

      <Route>
        <Redirect to={`${url}`} />
      </Route>
    </Switch>
  );
};

export default User;
