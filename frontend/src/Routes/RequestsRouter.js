import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomeMenu from '../Components/HomeMenu';
import { useOrganizationContext } from '../Context/OrganizationContext';
import { CenteredContainer } from '../styled-components/styled';
import {Badge} from 'antd';
import Pending from '../Pages/Pending';
import Approved from '../Pages/Approved';


const keys = [
    {
        key: '/pending',
        icon: null,
        title: 'Pending'
    },
    {
        key: '/approved',
        icon: null,
        title: 'Approved'
    }, 
    {
        key: '/denied',
        icon: null,
        title: 'Denied'
    }
]
const RequestsRouter = () => {
    const orgContext = useOrganizationContext();
    const [notificationCount, setNotificationCount] = useState(0);

    console.log(orgContext.organizationData);

    useEffect(() => {
        const notifications = orgContext.organizationData.Holidays.filter((holiday) => {
            return (!(holiday.approved || holiday.denied))
        });

        setNotificationCount(notifications.length);
    }, [orgContext.organizationData])

    const keys = [
        {
            key: '/pending',
            icon: <Badge count={notificationCount}/>,
            title: 'Pending'
        },
        {
            key: '/approved',
            icon: null,
            title: 'Approved'
        }, 
        {
            key: '/denied',
            icon: null,
            title: 'Denied'
        }
    ]
    return (
        <>
        <HomeMenu param={'/requests'} keys={keys}/>
        <CenteredContainer style={{maxWidth: '800px'}}>
        <Switch>
            
            <Route path='/app/:teamId/requests/pending'>
                <Pending />
            </Route>
            <Route path='/app/:teamId/requests/approved'>
                <Approved />
            </Route>
            <Route path='/app/:teamId/requests/denied'>
                
            </Route>
            <Route path='/app/:teamId/requests'>
                <Redirect to={`/app/${orgContext.organizationData.id}/requests/pending`} />
            </Route>
        </Switch>
        </CenteredContainer>
        </>
    );
};

export default RequestsRouter;