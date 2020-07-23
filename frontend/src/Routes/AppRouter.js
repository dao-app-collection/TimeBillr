import React, { useEffect, useContext } from "react";
import { Switch, Route, useParams, useHistory } from "react-router-dom";
import ApplicationHeader from "../Components/ApplicationHeader";
import {OrganizationContext} from '../Context/OrganizationContext';
import TeamRouter from "./Team/TeamRouter";
import { Layout } from "antd";

const AppRouter = () => {

  const teamId = useParams().organization_id;
  const history = useHistory();
  const orgContext = useContext(OrganizationContext);

  useEffect(()=> {
    console.log(teamId);
    if(teamId === 'undefined'){
      history.push('/app');
    }
  }, [teamId, history]);

  useEffect(() => {
    console.log(teamId);
    if(Object.keys(orgContext.organization).length === 0){
      orgContext.getAllOrganizationData(teamId);
    }
  }, [ teamId]);
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
