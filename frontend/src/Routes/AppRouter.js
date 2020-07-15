import React from "react";
import { Switch, Route } from "react-router-dom";
import ApplicationHeader from "../Components/ApplicationHeader";
import TeamRouter from "./Team/TeamRouter";
import { Layout } from "antd";

const AppRouter = () => {
  return (
    <>
      <ApplicationHeader />
      <Layout.Content style={{ backgroundColor: "white" }}>
        <Switch>
          <Route path="/app/:teamId/time">
            <div>Time</div>
          </Route>
          <Route path="/app/:teamId/projects">
            <div>Projects</div>
          </Route>
          <Route path="/app/:teamId/team">
            <TeamRouter />
          </Route>
          <Route path="/app/:teamId/reports">
            <div>reports</div>
          </Route>
          <Route path="/app/:teamId/invoices">
            <div>invoices</div>
          </Route>
          <Route path="/app/:teamId"></Route>
        </Switch>
      </Layout.Content>
    </>
  );
};

export default AppRouter;
