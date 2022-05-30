import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import Withdraw from "./Withdraw";
import Wallet from "./Wallet";

const Wallets = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/withdraw`}>
        <Withdraw />
      </Route>
      <Route path={`${path}/:symbol`}>
        <Wallet />
      </Route>

      <Route>
        <Redirect to={`..`} />
      </Route>
    </Switch>
  );
};

export default Wallets;
