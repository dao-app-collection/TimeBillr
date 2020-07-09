import React from 'react';
import {Switch, Route} from 'react-router-dom';
import ApplicationHeader from "../Components/ApplicationHeader";
import TeamRouter from './Team/TeamRouter';
import { Layout } from 'antd';

const AppRouter = () => {
    return (
        <>
            <ApplicationHeader/>
            <Layout.Content style={{backgroundColor: 'white'}}>
            <Switch>
                <Route path='/app/{organization_id}'>

                </Route>
                <Route path="/app/:organizationID/time">
                    <div>Time</div>
                </Route>
                <Route path="/app/:organizationID/projects">
                    <div>Projects</div>
                </Route>
                <Route path='/app/:organizationID/team'>
                    <TeamRouter />
                </Route>
                <Route path="/app/:organizationID/reports">
                    <div>reports</div>
                </Route>
                <Route path="/app/:organizationID/invoices">
                    <div>invoices</div>
                </Route>
            </Switch>
            </Layout.Content>
        </>
    );
};

export default AppRouter;
