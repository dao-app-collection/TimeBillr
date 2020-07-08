import React from 'react';
import {Switch, Route} from 'react-router-dom';
import ApplicationHeader from "../Components/ApplicationHeader";

const AppRouter = () => {
    return (
        <>
            <ApplicationHeader/>
            <Switch>
                <Route path='/app/{organization_id}'>

                </Route>
            </Switch>
        </>
    );
};

export default AppRouter;
