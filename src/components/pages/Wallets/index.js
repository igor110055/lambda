import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import Home from "./Home";
import Withdraw from "./Withdraw";
import Wallet from "./Wallet";
import Fiat from "./Fiat";

const Wallets = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Home />
      </Route>
      <Route path={`${path}/withdraw`}>
        <Withdraw />
      </Route>
      <Route path={`${path}/fiat/:id`}>
        <Fiat />
      </Route>
      <Route path={`${path}/:symbol`}>
        <Wallet />
      </Route>

      <Route>
        <Redirect to={`${url}`} />
      </Route>
    </Switch>
  );
};

export default Wallets;
