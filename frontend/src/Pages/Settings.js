import React, {useState, useEffect} from 'react';
import { useOrganizationContext } from '../Context/OrganizationContext';
import { CenteredContainer } from '../styled-components/styled';
import { Form, Checkbox, Select, Typography } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import ButtonWithSpinner from '../Components/Ui/ButtonWithSpinner';
import apiClient from '../config/axios';
import { useAlert } from 'react-alert';

const InputContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
`
const {Title} = Typography;
const {Option} = Select;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const Settings = () => {
    const orgContext = useOrganizationContext();
    const [form] = Form.useForm();
    const [sending,setSending] =useState(false);
    console.log(orgContext.organizationData.TeamSetting)
    const startOfDay = moment().startOf('day');
    const [startTimes, setStartTimes] = useState([]);
    const [endTimes, setEndTimes] = useState([])
    const [dayStart, setDayStart] =useState(null);
    const [dayEnd, setDayEnd] = useState(null);

    const alert = useAlert();
    console.log(orgContext.organizationData.TeamSetting)
    const [reminders, setReminders] = useState(false);

    useEffect(() => {
        createStartTimes();
        setReminders(orgContext.organizationData.TeamSetting.shiftReminders);
      }, []);
    
      useEffect(() => {
        let shiftEnds = startTimes.filter((time) => {
          return time.isAfter(dayStart);
        });
        setEndTimes(shiftEnds);
        // console.log(shiftEnds);
      }, [dayStart, startTimes]);
    
      const createStartTimes = () => {
        const start = moment(startOfDay);
        const dates = [];
        for (let i = 0; i < 96; i++) {
          dates.push(moment(start.add(15, "m")));
        }
        // console.log(dates);
        setStartTimes(dates);
      };
    
      const onShiftStartChange = (start) => {
        setDayStart(start);
        // setStartSelected(!startSelected);
        // console.log(start);
      };
    
      const onShiftEndChange = (end) => {
        setDayEnd(end);
      };

    const handleSubmit = async (values) => {
        setSending(true);
        console.log(values);

        console.warn(values);
        
        const openingTimes = {
            0: {open: startOfDay.diff(moment(values.Sunday)) * -1, close: startOfDay.diff(moment(values.Sunday_end))*-1},
            1: {open: startOfDay.diff(moment(values.Monday)) *-1, close: startOfDay.diff(moment(values.Monday_end))*-1},
            2: {open: startOfDay.diff(moment(values.Tuesday))*-1, close: startOfDay.diff(moment(values.Tuesday_end))*-1},
            3: {open: startOfDay.diff(moment(values.Wednesday))*-1, close: startOfDay.diff(moment(values.Wednesday_end))*-1},
            4: {open: startOfDay.diff(moment(values.Thursday))*-1, close: startOfDay.diff(moment(values.Thursday_end))*-1},
            5: {open: startOfDay.diff(moment(values.Friday))*-1, close: startOfDay.diff(moment(values.Friday_end))*-1},
            6: {open: startOfDay.diff(moment(values.Saturday))*-1, close: startOfDay.diff(moment(values.Saturday_end))*-1},
        };
        console.warn(openingTimes);

        try {
            const response = await apiClient.post('teams/updateSettings', {
                openingTimes,
                reminders: reminders,
                TeamId: orgContext.organizationData.id
            })
            if(response.status === 200){
                orgContext.getAllOrganizationData(orgContext.organizationData.id);
                alert.show('Updated Team Settings', {type: 'success'})
            }
            setSending(false);
        } catch (error) {
            alert.show('Failed to update Team Settings', {type: 'error'});
            setSending(false);
        }

    };

    const checkSubmittable = (values) => {

    };

    const getInitialValue = (index, openOrClose) => {
        let openingTimes = orgContext.organizationData.TeamSetting.OpeningHours;
        
        if(openOrClose === 'open'){
            return moment(startOfDay).add(openingTimes.find(hours => {return hours.day === index}).open);
        }else {
            return moment(startOfDay).add(openingTimes.find(hours => {return hours.day === index}).close);
        }
    };
    console.log(reminders);
    return (
        <CenteredContainer style={{maxWidth: '1000px', display: 'flex', justifyContent: 'center'}}>
            <Form
                name={'settings'}
                form={form}
                onFinish={handleSubmit}
                onChange={checkSubmittable}
            >
                <Form.Item 
                    name='sendReminders'
                    label='Shift Reminders'
                    extra='Tick this box if you wish for shift reminders to be sent to employees, they will receive these at the start of the week.'
                    initialValue={reminders}
                >
                    <Checkbox  checked={reminders} onChange={() => {setReminders(!reminders)}}></Checkbox>
                </Form.Item>
                {days.map((day, index) => (
                    <>
                    <Title level={4} style={{width: '100%'}}>{day}</Title>
                    <InputContainer>
                    
                    <Form.Item
                        key={day}
                        name={day}
                        label={'start'}
                        extra='Enter Opening and Closing Time'
                        initialValue={getInitialValue(index, 'open').format('HH:mm:SS')}
                    >
                        <Select onChange={onShiftStartChange} style={{width: '300px'}} >
                        {startTimes.map((date, index) => (
                          <Option value={date.toString()} key={index + '_start'}>
                            {date.format("HH:mm:SS")}
                          </Option>
                        ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        key={day + '_end'}
                        name={day + '_end'}
                        label={'end'}
                        style={{marginLeft: '16px'}}
                        initialValue={getInitialValue(index, 'close').format('HH:mm:SS')}
                    >
                        <Select 
                            onChange={onShiftEndChange}
                            style={{width: '300px'}}
                            
                        >
                            {endTimes.map((date, index ) => (
                              <Option value={date.toString()} key={index + '_end'}>
                                {date.format("HH:mm:SS")}
                              </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    </InputContainer>
                    </>
                ))}
                <ButtonWithSpinner form={'settings'} sending={sending} innerHtml={'Update'} submittable={true} />
            </Form>
        </CenteredContainer>
    );
};

export default Settings;