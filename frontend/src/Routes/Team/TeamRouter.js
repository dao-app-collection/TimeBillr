import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TeamHome from './TeamHome';
import AddMember from './AddMember';

const TeamRouter = () => {
    return (
        <Switch>
            <Route exact path='/app/:organizationId/team'>
                <TeamHome />
            </Route>
            <Route path='/app/:organizationId/team/addMember'>
                <AddMember />
            </Route>
        </Switch>
    );
};

export default TeamRouter;