

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomeMenu from '../../Components/HomeMenu';
import {GroupOutlined} from "@ant-design/icons";

const routeKeys = [
    {
        key: '/create',
        icon: <GroupOutlined />,
        title: 'Create New Roster'
    },
    {

    },
]

const RostersRouter = () => {
    return (
        <>
        <HomeMenu param={'/rosters'} 
            keys={routeKeys}
        />
        <Switch>
            <Route exact path='/app/:teamId/rosters'>
                <div>This is the rosters route</div>

            </Route>
            <Route path='/app/:teamId/rosters/create'>
                <div>This is the rosters create route</div>
            </Route>
        </Switch>
        </>
    );
};

export default RostersRouter;