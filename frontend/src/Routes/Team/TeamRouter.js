import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import TeamHome from './TeamHome';
import AddMember from './AddMember';

const TeamRouter = () => {
    useEffect(() => {
        document.title = 'Team Members'
    })
    return (
        <Switch>
            <Route exact path='/app/:teamId/team'>
                <TeamHome />
            </Route>
            <Route path='/app/:teamId/team/addMember'>
                <AddMember />
            </Route>
        </Switch>
    );
};

export default TeamRouter;