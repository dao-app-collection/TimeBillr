import React, {useEffect, useState} from 'react';
import {Typography, Divider, Form, Select} from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import ButtonWithSpinner from '../../Components/Ui/ButtonWithSpinner';
import apiClient from '../../config/axios';
import { useOrganizationContext } from '../../Context/OrganizationContext';
import { useAlert } from 'react-alert';

const {Title} = Typography;
const {Option} = Select;

const SelectContainer = styled.div`
    display:flex;
    flex-direction:row;
    width: 100%;
    justify-content: space-evenly;
`

const selectStyle = {
    margin: '8px',
    width: '200px'
    
};

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

const Availabilities = () => {
    const orgContext = useOrganizationContext();
    const alert = useAlert();
    const [form] = Form.useForm();
    const [shiftEndTimes, setShiftEndTimes] = useState(null);
    const [startTimes, setStartTimes] = useState(null);
    const [shiftStart, setShiftStart] = useState(null);
    const [shiftEnd, setShiftEnd] = useState(null);
    const [sending, setSending] = useState(false);
  // The unavailables that have already been created
    const[unavailables, setUnavailables] = useState({});

    console.log(orgContext.userTeamMembership);

    useEffect(() => {
        createStartTimes();
        
      }, []);

    useEffect(() => {
        console.log('changing shift ends')
        if(!startTimes){
            return;
        }
        console.log(startTimes);
        let shiftEnds = startTimes.filter((time) => {
          return time.isAfter(shiftStart);
        });
        setShiftEndTimes(shiftEnds);
      }, [shiftStart, startTimes]);
    
      const createStartTimes = () => {
        const dayStart = moment().startOf('week');
        const dates = [];
        for (let i = 0; i < 96; i++) {
          dates.push(moment(dayStart.add(15, "m")));
        }
        // console.log(dates);
        console.log(dates);
        setStartTimes(dates);
      };
      
      const findExistingUnavailable = (index) => {
        // index is the day of the week for the unavailable item
        console.log(orgContext.userTeamMembership);
        let unavailable = orgContext.userTeamMembership.Unavailables.filter((unavailable => {
          return unavailable.day === index
        }))[0];

        
        console.log(unavailable);
        return unavailable ? unavailable : null;
      }
      const onShiftStartChange = (value) => {
        console.log(value);
      }
    const onFinish = async values => {
        setSending(true);

        try {
            const res = await apiClient.post(`employee/changeAvailabilities/${orgContext.userTeamMembership.id}`,{
                availabilities: values,
                TeamId: orgContext.organizationData.id,

            });
            if(res.status === 200){
              const updatedContext = await orgContext.updateUserData(orgContext.organizationData.id);
              if(updatedContext){
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
        setSending(false);
        
    };
    return (
        <>
        <Title level={3}>Please fill out the times you are unavailable.</Title>
        <Divider />
        <Form
            form={form} 
            name={"availabilities"} 
            onFinish={onFinish} 
            scrollToFirstError
        >
            
            {startTimes ? 
                days.map((day, index) => (
                    <SelectContainer>
                    <Form.Item
                        name={day}
                        label={day}
                    >
                        
                            <Select defaultValue={findExistingUnavailable(index) ? moment(findExistingUnavailable(index).start).format('HH:mm:SS') : null} onChange={onShiftStartChange} style={selectStyle}>
                              {startTimes ? startTimes.map((date) => (
                                <Option value={date.toString()} key={date.toString()}>
                                  {date.format("HH:mm:SS")}
                                </Option>
                              )) : null}             

                            </Select>
                    </Form.Item>
                    <Form.Item
                        name={day + 'end'}
                        label={'End Time'}
                    >
                            <Select defaultValue={findExistingUnavailable(index) ? moment(findExistingUnavailable(index).end).format('HH:mm:SS') : null} style={selectStyle}>
                            {startTimes ? startTimes.map((date) => (
                                <Option value={date.toString()} key={date.toString()}>
                                  {date.format("HH:mm:SS")}
                                </Option>
                              )) : null}
                            </Select>
                        
                </Form.Item>
                </SelectContainer>
                ))
            : null}
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <ButtonWithSpinner
                sending={sending}
                innerHtml='Update Availabilities'
                form='availabilities'
                submittable={true}
                
            />
            </div>
            
        </Form>
        </>
    );
};

export default Availabilities;