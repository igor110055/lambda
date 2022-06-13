import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import DashboardLayout from "../../templates/Dashboard";

import Home from "./Home";
import ProfilePhoto from "./ProfilePhoto";
import PersonalInformation from "./PersonalInformation";
import Verification from "./Verification";
import ChangePassword from "./ChangePassword";
import Cards from "./Cards";
import Banks from "./Banks";

const Settings = () => {
  const { path, url } = useRouteMatch();

  return (
    <DashboardLayout>
      <Switch>
        <Route exact path={`${path}`}>
          <Home />
        </Route>
        <Route path={`${path}/profile-photo`}>
          <ProfilePhoto />
        </Route>
        <Route path={`${path}/personal-information`}>
          <PersonalInformation />
        </Route>
        <Route path={`${path}/verification`}>
          <Verification />
        </Route>
        <Route path={`${path}/change-password`}>
          <ChangePassword />
        </Route>
        <Route path={`${path}/cards`}>
          <Cards />
        </Route>
        <Route path={`${path}/banks`}>
          <Banks />
        </Route>
        <Route>
          <Redirect to={`${url}`} />
        </Route>
      </Switch>
    </DashboardLayout>
  );
};

export default Settings;
