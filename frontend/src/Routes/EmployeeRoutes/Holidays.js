import React, { useState, useEffect } from 'react';
import { FileAddOutlined } from '@ant-design/icons';
import HomeMenu from '../../Components/HomeMenu';
import { Typography, Divider, Card, Button } from "antd";
import { Switch, Route, useHistory } from 'react-router-dom';
import moment from 'moment';

import { DatePicker, Space } from 'antd';
import ButtonWithSpinner from '../../Components/ButtonWithSpinner';
import apiClient from '../../config/axios';
import { useOrganizationContext } from '../../Context/OrganizationContext';
import { useAlert } from 'react-alert';
import HolidayCard from '../../Components/HolidayCard';
import styled from 'styled-components';
const { RangePicker } = DatePicker;

const {Title} = Typography;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const keys = [
    {
        key: '/create',
        title: 'Create Holiday Request', 
        icon: <FileAddOutlined />
    }
]

const Holidays = () => {
    const orgContext = useOrganizationContext();
    const alert = useAlert();
    const [pending, setPending] = useState([]);
    const [approved, setApproved] = useState([]);

    useEffect(() => {
        setPending(orgContext.userTeamMembership.Holidays.filter(holiday => {return !holiday.approved && !holiday.requested}));
        setApproved(orgContext.userTeamMembership.Holidays.filter(holiday => {return holiday.approved}));
    }, [orgContext]);

    const deleteRequest = async (id, action) => {
        console.log(id, action);
        try {
            const res = await apiClient.post('teams/holidays/requests', {
                HolidayId: id,
                param: action,
            });
            if(res.status === 200){
                // update the context
                const orgRes = await orgContext.updateUserData(orgContext.organizationData.id);
                if(orgRes) {
                    alert.show(res.data.success, {
                        type: 'success'
                    });
                };
                console.log(orgRes);
            }
        } catch (error) {
            console.log(error);
            alert.show(error.response.data.message, {
                type: 'error'
            })
        }
    };
    return (
        <Switch>
            <Route path='/app/:teamId/holidays/create'>
                <HolidayRequest />
            </Route>
            <Route path='/app/:teamId/holidays'>
                <HomeMenu param={'/holidays'} keys={keys} />
                <Title level={3} style={{margin: '16px 0px'}}>Approved Holidays</Title>
                <CardContainer>
                {approved.map(request => (
                    (<HolidayCard request={request} handleRequest={deleteRequest}/>)
                ))}
                </CardContainer>
                <Divider />
                <Title  level={3} style={{margin: '16px 0px'}}>Requested Holidays</Title>
                <CardContainer>
                {pending.map(request => (
                    (<HolidayCard request={request} handleRequest={deleteRequest}/>)
                ))}
                </CardContainer>
                <Divider />
            </Route>            
        </Switch>
        
    );
};

const HolidayRequest = () => {
    const orgContext = useOrganizationContext();
    const alert = useAlert();
    const history = useHistory();
    const [sending, setSending] = useState(false);
    const [submittable, setSubmittable] = useState(false);
    const [holidayStart, setHolidayStart] = useState(null);
    const [holidayEnd, setHolidayEnd] = useState(null)

    const onSubmit = async () => {
        setSending(true);
        try {
            const response = await apiClient.post(`employee/holidays/${orgContext.userTeamMembership.id}/request`, {
                start: holidayStart.toString(),
                end: holidayEnd.toString(),
                TeamId: orgContext.organizationData.id,
            })
            if(response.status === 200){
                alert.show(response.data.success, {
                    type: 'success'
                });
                setSending(false);

                const res = await orgContext.updateUserData(orgContext.organizationData.id);
                console.log(res);
                if(res){
                    setSending(false);
                    history.push(`/app/${orgContext.organizationData.id}/holidays`);
                    console.log(res);
                }                
            }
        } catch (error) {
            alert.show(error.response.data.message, {
                type: 'error'
            })
        }
       
    };

    const onPickerChange = (values) => {
        setHolidayStart(values[0]);
        setHolidayEnd(values[1]);
        console.log(values);
    }
    const today = moment();
    return (
        <>
        <RangePicker defaultPickerValue={today} format={'DD-MM-YYYY'} onChange={onPickerChange}/>
        <ButtonWithSpinner sending={sending} innerHtml={'Submit Request'} submittable={holidayStart && holidayEnd} onSubmit={onSubmit}/>
        </>
    )
};

export default Holidays;