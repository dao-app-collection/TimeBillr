import React from "react";
import { Switch, Route } from "react-router-dom";
import HomeMenu from "../../Components/HomeMenu";
import { GroupOutlined, EditOutlined } from "@ant-design/icons";
import CreateRoster from "./CreateRoster";
import Roster from './Roster';
import RosterProvider from "../../Context/RosterContext";

const routeKeys = [
  {
    key: "/create",
    icon: <GroupOutlined />,
    title: "Create New Roster",
  },
  {
    key: '/edit',
    icon: <EditOutlined />,
    title: 'Edit Roster',
  },
];

const RostersRouter = () => {
  return (
    <>
      <RosterProvider>
        <HomeMenu param={"/rosters"} keys={routeKeys} />
        <Switch>
          <Route exact path="/app/:teamId/rosters">
            <div>This is the rosters route</div>
          </Route>
          <Route path="/app/:teamId/rosters/create">
            <CreateRoster />
          </Route>
          <Route path='/app/:teamId/:rosterId'>
            <Roster />
          </Route>
        </Switch>
      </RosterProvider>
    </>
  );
};

export default RostersRouter;
