import React from "react";
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import PreLoader from "../../../atoms/PreLoader";

import DashboardLayout from "../../../templates/Dashboard";

import Address from "./Address";
import Deposit from "./Deposit";
import Home from "./Home";
import Bank from "./Bank";

import { useWallet } from "../../../../hooks/useWallets";

const Wallet = () => {
  const { path, url } = useRouteMatch();
  const { symbol } = useParams();

  const { loading, error } = useWallet(symbol);

  if (loading)
    return (
      <DashboardLayout>
        <PreLoader page />
      </DashboardLayout>
    );

  if (error) return <Redirect to="/dashboard/wallets" />;

  return (
    <DashboardLayout>
      <Switch>
        <Route exact path={`${path}`}>
          <Home />
        </Route>
        <Route path={`${path}/deposit`}>
          <Deposit />
        </Route>
        <Route path={`${path}/qrcode`}>
          <Address />
        </Route>
        <Route path={`${path}/bank`}>
          <Bank />
        </Route>
        <Route>
          <Redirect to={`${url}`} />
        </Route>
      </Switch>
    </DashboardLayout>
  );
};

export default Wallet;
