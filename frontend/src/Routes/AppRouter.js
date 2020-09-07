import React, { useEffect, useContext } from "react";
import { Switch, Route, useParams, useHistory } from "react-router-dom";
import ApplicationHeader from "../Components/ApplicationHeader";
import { OrganizationContext, useOrganizationContext } from "../Context/OrganizationContext";
import TeamRouter from "./Team/TeamRouter";
import RostersRouter from "./Rosters/RostersRouter";
import { Layout } from "antd";
import Home from "./Home/Home";
import RosterProvider from "../Context/RosterContext";
import EmployeeRoutes from "./EmployeeRoutes/EmployeeRoutes";
import RequestsRouter from "./Requests/RequestsRouter";

const AppRouter = () => {
  const teamId = useParams().organization_id;
  const history = useHistory();
  const orgContext = useOrganizationContext();

  useEffect(() => {
    console.log(teamId);
    if (teamId === "undefined") {
      history.push("/app");
    }
  }, [teamId, history]);

  useEffect(() => {
    console.log(teamId);
    if (Object.keys(orgContext.organization).length === 0) {
      orgContext.getAllOrganizationData(teamId);
    }
  }, [teamId]);


  // if(Object.keys(orgContext.organizationData).length === 0 || orgContext.userTeamMembership)
  console.log(orgContext.loadedOrganizationData);
  console.log(orgContext.userTeamMembership);
  console.log(orgContext.organizationData);
  if (orgContext.loadedOrganizationData && orgContext.userTeamMembership.permissions !== 'employee') {
    console.log(orgContext.userTeamMembership);
    return (
      <>
      <RosterProvider>
        <ApplicationHeader userType={'admin'}/>
        <Layout.Content style={{ backgroundColor: "white" }}>
          <Switch>
            <Route path="/app/:teamId/home">
              <Home />
            </Route>
            <Route path="/app/:teamId/projects">
              <div>Projects</div>
            </Route>
            <Route path="/app/:teamId/team">
              <TeamRouter />
            </Route>
            <Route path="/app/:teamId/invoices">
              <div>invoices</div>
            </Route>
            <Route path="/app/:teamId/rosters">
              <RostersRouter />
            </Route>
            <Route path='/app/:teamId/requests'>
              <RequestsRouter />
            </Route>
            <Route path="/app/:teamId"></Route>
          </Switch>
        </Layout.Content>
        </RosterProvider>
      </>
    );
    // This leads to the employee part of the app, where a user can view their shifts, change their availibilites,
    // and schedule holidays
  } else if(orgContext.loadedOrganizationData && orgContext.userTeamMembership.permissions === 'employee'){
    return (
      <> 
      <ApplicationHeader userType={'employee'}/>
      <EmployeeRoutes/>
      </>
      )
  } else {
    return (
      <>
        <ApplicationHeader />
        <Layout.Content style={{ backgroundColor: "white" }}>
          <p>Loading data...</p>
        </Layout.Content>
      </>
    );
  }
};

export default AppRouter;
