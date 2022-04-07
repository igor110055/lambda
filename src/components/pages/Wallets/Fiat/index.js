import React from "react";
import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import DashboardLayout from "../../../templates/Dashboard";

import Fund from "./Fund";
import Home from "./Home";

const Fiat = () => {
  const { path, url } = useRouteMatch();

  return (
    <DashboardLayout>
      <Switch>
        <Route exact path={`${path}`}>
          <Home />
        </Route>
        <Route path={`${path}/fund`}>
          <Fund />
        </Route>
        <Route>
          <Redirect to={`${url}`} />
        </Route>
      </Switch>
    </DashboardLayout>
  );
};

export default Fiat;
