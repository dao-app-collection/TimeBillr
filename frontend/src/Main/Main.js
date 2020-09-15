import React, { useContext } from "react";
import { AuthContext } from "../Context/UserAuthContext";
import Authentication from "../Authentication/Authentication";
import {
  OrganizationProvider,
  OrganizationConsumer,
} from "../Context/OrganizationContext";
import Skeleton from "../Skeleton/Skeleton";
import { Switch, Route, Redirect } from "react-router-dom";
import { Spin, Alert } from "antd";
import Landing from "../Landing/Landing";

const Main = () => {
  const authContext = useContext(AuthContext);

  if (authContext.authenticating) {
    return <Spin tip="Loading..."></Spin>;
  } else if (authContext.authenticated) {
    return (
      <OrganizationProvider>
        <OrganizationConsumer>
          {(value) => (
            <Switch>
              <Route path="/app">
                <Skeleton />
              </Route>
              <Route path="/app*">
                <Redirect to="/app" />
              </Route>
              <Route path='/'>
                <Redirect to='/app' />
              </Route>
            </Switch>
          )}
        </OrganizationConsumer>
      </OrganizationProvider>
      // <Skeleton />
    );
  } else {
    return (
      <Switch>
        <Route path='/app'>
          <Authentication />
        </Route>
        <Route path='/*'>
          <Landing />
        </Route>
      </Switch>
    )
  }
};

export default Main;
