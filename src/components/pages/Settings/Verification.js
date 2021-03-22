import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";

import VerificationLevel from "../../molecules/VerificationLevel";

import VerificationRequest from "../../organisms/VerificationRequest";

const Verification = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Container p="12px" display="grid" gap="24px" wide>
          <Container flexCol="center" h="120px">
            <Text p="0" m="0 0 12px 0" font="14px" bold>
              Verification
            </Text>
            <Text p="0" font="12px" opacity="0.6" align="center" bold multiline>
              Submit requested documents to upgrade your account
            </Text>
          </Container>
          <VerificationLevel
            level={1}
            plan="Basic"
            min={1000}
            max={10000}
            requirement="Email verification"
          />
          <VerificationLevel
            level={2}
            plan="Silver"
            min={10000}
            max={100000}
            requirement="Valid ID (ie. Voter's card, National ID Card,
          International passport)"
            verification="identity"
          />
          <VerificationLevel
            level={3}
            plan="Gold"
            min={100000}
            max="Unlimited"
            requirement="Proof of residence (ie. Utility Bill)"
            verification="residence"
          />
        </Container>
      </Route>
      <Route path={`${path}/identity`}>
        <VerificationRequest level={2} desc="Silver Membership" />
      </Route>
      <Route path={`${path}/residence`}>
        <VerificationRequest level={3} desc="Gold Membership" />
      </Route>
      <Route>
        <Redirect to={`${url}`} />
      </Route>
    </Switch>
  );
};

export default Verification;
