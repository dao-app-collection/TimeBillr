import React, { useEffect, useState } from 'react';
import { useOrganizationContext } from '../Context/OrganizationContext';
import {Card} from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { CheckCircleTwoTone, StopTwoTone, DeleteTwoTone } from '@ant-design/icons';
import apiClient from '../config/axios';
import { useAlert } from 'react-alert';
import HolidayCard from '../Components/Ui/HolidayCard'

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const Pending = () => {
    const orgContext = useOrganizationContext();
    const requests = usePendingRequests();

    const alert = useAlert();

    console.log(orgContext);

    const handleRequest = async (id, param) => {

        try {
            const res = await apiClient.post('teams/holidays/requests', {
                HolidayId: id,
                param: param,
            });
            if(res.status === 200){
                // update the context
                const orgRes = await orgContext.getAllOrganizationData(orgContext.organizationData.id);
                if(orgRes) {
                    alert.show(res.data.success, {
                        type: 'success'
                    });
                }
            }
        } catch (error) {
            alert.show(error.response.data.message, {
                type: 'error'
            })
        }
    };

    return (
        <>
        <CardContainer>
            {requests.map(request => (
                // renderCard(request)
                <HolidayCard request={request} handleRequest={handleRequest} admin/>
            ))}
        </CardContainer>
        </>
        
    );
};



const usePendingRequests = () => {
    const orgContext = useOrganizationContext();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const requestsTemp = orgContext.organizationData.Holidays.filter((holiday) => {
            return (!(holiday.approved || holiday.denied))
        });

        setRequests(requestsTemp);
    }, [orgContext.organizationData]);

    return requests;
};

export default Pending;