import React, { useEffect } from "react";
import Layout from "antd/es/layout";

import { Route, Switch, Redirect } from "react-router-dom";

import OrganizationSelectOrCreate from "../Pages/OrganizationSelectOrCreate";
import AuthenticatedRoutes from "../Routes/AuthenticatedRoutes";
import Invitation from "../Pages/Invitation";
import Footer from "../Components/Footer";

const Skeleton = () => {
  
  return (
    <Layout style={{ height: "auto", minHeight: "100vh" }}>
      <Switch>
        <Route path="/app/invitation/:id">
          <Invitation />
        </Route>
        <Route path={"/app/register"}>
          <Redirect to={"/app"} />
        </Route>

        <Route path={"/app/:organization_id"}>
          <AuthenticatedRoutes />
        </Route>
        <Route path={"/app"}>
          <OrganizationSelectOrCreate />
        </Route>
        <Route path={"/*"}>
          <Redirect to={"/app"} />
        </Route>
      </Switch>

      <Footer />
    </Layout>
  );
};

export default Skeleton;
