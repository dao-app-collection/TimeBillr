import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import TeamHome from "./TeamHome";
import AddMember from "./AddMember";
import Roles from "./Roles";

const TeamRouter = () => {
  useEffect(() => {
    document.title = "Team Members";
  });
  return (
    <>
    <TeamHome />
    <Switch>
      <Route exact path="/app/:teamId/team">
        
      </Route>
      <Route path="/app/:teamId/team/addMember">
        <AddMember />
      </Route>
      <Route path="/app/:teamId/team/roles">
        <Roles/>
      </Route>
    </Switch>
    </>
  );
};

export default TeamRouter;
