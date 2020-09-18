import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import HomeMenu from "../Components/HomeMenu";
import { GroupOutlined, EditOutlined } from "@ant-design/icons";
import CreateRoster from "../Pages/CreateRoster";
import EditRoster from "../Pages/EditRoster";
import Roster from "../Pages/Roster";
import RosterProvider from "../Context/RosterContext";
import { OrganizationContext } from "../Context/OrganizationContext";

const routeKeys = [
  {
    key: "/create",
    icon: <GroupOutlined />,
    title: "Create New Roster",
  },
  {
    key: "/edit",
    icon: <EditOutlined />,
    title: "Edit/View Rosters",
  },
];

const RostersRouter = () => {

  const orgContext = useContext(OrganizationContext);
  return (
    <>
      <RosterProvider>
        <HomeMenu param={"/rosters"} keys={routeKeys} />
        <Switch>
          <Route exact path="/app/:teamId/rosters">
            <Redirect to={`/app/${orgContext.organizationData.id}/rosters/edit`} />
          </Route>
          <Route path="/app/:teamId/rosters/create">
            <CreateRoster />
          </Route>
          <Route exact path="/app/:teamId/rosters/edit">
            <EditRoster />
          </Route>
          <Route path="/app/:teamId/rosters/:rosterId">
            <Roster />
          </Route>
        </Switch>
      </RosterProvider>
    </>
  );
};

export default RostersRouter;
