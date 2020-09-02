import React, { useEffect } from 'react';
import ApplicationHeader from '../../Components/ApplicationHeader';
import { Switch, Route } from 'react-router-dom';
import { useOrganizationContext } from '../../Context/OrganizationContext';
import { useRosterContext } from '../../Context/RosterContext';
import apiClient from '../../config/axios';
import { Layout } from 'antd';
import { CenteredContainer } from '../../styled-components/styled';
import EmployeeProvider from '../../Context/EmployeeContext';
import UpcomingShifts from './UpcomingShifts';
import Availabilities from './Availabilities';
import Holidays from './Holidays';

const EmployeeRoutes = () => {
    const orgContext = useOrganizationContext();
    const rosterContext = useRosterContext();
    
    return (
        <EmployeeProvider>
        
        <Layout.Content style={{ backgroundColor: "white" }}>
        <CenteredContainer style={{ maxWidth: "800px" }}>
            <Switch>
                <Route path='/app/:teamId/shifts'>
                    <UpcomingShifts />
                </Route>
                <Route path='/app/:teamId/availabilities'>
                    <Availabilities />
                </Route>
                <Route path='/app/:teamId/holidays'>
                    <Holidays />
                </Route>
            </Switch>
        </CenteredContainer>
        </Layout.Content>
        
        </EmployeeProvider>
    );
};

export default EmployeeRoutes;