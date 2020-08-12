import React, {useContext, useState, useEffect}from 'react';
import {OrganizationContext} from '../../Context/OrganizationContext';
import {Collapse, Card, Form, Select} from 'antd';

import {CreateRosterContainer, ColumnContainer, CenteredContainer} from '../../styled-components/styled';
import moment from 'moment';

import RosterSteps from './RosterSteps';
import ButtonWithSpinner from '../../Components/ButtonWithSpinner';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css'
import { useRosterContext } from '../../Context/RosterContext';
import Modal from 'antd/lib/modal/Modal';
import useRoster from './Hooks/useRoster';
import useSelectedDaysShift from './Hooks/useSelectedDaysShift';

import styled from 'styled-components';
import apiClient from '../../config/axios';
import { useAlert } from 'react-alert';
const {Panel} = Collapse;
const {Option} = Select;

const ButtonContainer = styled.div`
    width: 100%;
    padding: 16px;
    display: flex;
    justify-content: center;
`

const Roster = () => {
    const alert = useAlert();
    const roster = useRoster();
    const [step, setStep] = useState(0);
    const selectedDaysShift = useSelectedDaysShift(roster, step);
    const orgContext = useContext(OrganizationContext);
    const rosterContext = useRosterContext();
    const [roles, setRoles] = useState([]);

    const [shiftsToSubmit, setShiftsToSubmit] = useState([]);
    const [sending, setSending] = useState(false);
    // const [currentDaysShift, setCurrentDaysShift] = useState({});

    const changeStep = (newStep) => {
        // here we need to force save all of the new entries
        setStep(newStep)
    };

    useEffect(() => {
        setRoles(orgContext.organizationData.TeamRoles);
    }, [orgContext.organizationData.TeamRoles]);


    const submitShifts = async () => {
        setSending(true);
        console.log(shiftsToSubmit);
        const shiftsWithMomentsFormatted = shiftsToSubmit.map(shift => {
            console.log(shift.start_time);
            return {
                
                TeamMembershipId: shift.id,
                TeamRoleId: shift.TeamRoleId,
                DaysShiftId: shift.DaysShiftId,
                start: shift.start_time.format('YYYY-MM-DD HH:mm:SS'),
                end: shift.end_time.format('YYYY-MM-DD HH:mm:SS')
            }
        })
        try {
            const res = await apiClient.post(`/teams/rosters/${orgContext.organizationData.id}/addShift`, {
                shifts: shiftsWithMomentsFormatted,
                TeamId: orgContext.organizationData.id,
            });
            if(res.status === 200){
                alert.show(res.data.success, {
                    type: "success",
                  });
            } else {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
            alert.show(error.response.data.message, {
                type: "error",
              });
        }
        setSending(false);
        
        console.log('submitting....')
        console.log(shiftsToSubmit);
    };

    const saveShifts = (shifts) => {
        setShiftsToSubmit(shiftsToSubmit.concat(shifts));
    }

    return (
        <>
        <CenteredContainer style={{maxWidth: 'calc(100vw - 80px)'}}>
        <RosterSteps step={step} onChange={changeStep} />
        <Collapse>
            {roles.map(role => (
                <Panel header={role.title} key={role.id}>
                    <RosterCalendar role={role} step={step} daysShifts={selectedDaysShift} saveShifts={saveShifts}/>
                </Panel>
            ))}
        </Collapse>
        <ButtonContainer>
        <ButtonWithSpinner 
            sending={false}
            // form={"shift-times"}
            onSubmit={submitShifts}
            innerHtml={"Save"}
            submittable={true}
        />
        </ButtonContainer>
        </CenteredContainer>
        </>
    )
};

const RosterCalendar = ({role, step, daysShifts, saveShifts}) => {
    const [addShiftModal, setAddShiftModal] =useState(false);
    const [selectedEmployee,setSelectedEmployee] = useState({});
    const [newItems, setNewItems] = useState([]);
    const items = useCreateItems(daysShifts.Shifts, newItems);
    console.log(role);
    console.log(step);
    console.log(daysShifts);

    useEffect(() => {

    }, [newItems, daysShifts]);
    
    // The 'groups' are the employees, they are shown on the LHS of the calendar
    // The group id is the TeamMembershipId,
    // Items that appear next to this group, use the Id of the group.
    const groups = role.EmployeeRoles.map((employee) => {
        return {id: employee.TeamMembershipId, title: employee.TeamMembership.User.firstName + ' ' + employee.TeamMembership.User.lastName}
    });

    // const newItems = [{id: 1,group: 1, start_time: moment(daysShifts.date),end_time: moment(daysShifts.date).add(3, 'h')}];

    console.log(groups);

    // const newItems = [];
    const selectUser = (employee) => {
        toggleModal(null, employee)
    };

    const toggleModal = (e, employee) => {
        console.log(employee);
        if(employee){
            setSelectedEmployee(employee);
            setAddShiftModal(true);
        } else {
            setSelectedEmployee({});
            setAddShiftModal(false);
        }
    };

    const addItem = (item) => {
        console.log(daysShifts);
        console.log(item);
        let temp = [...newItems];
        temp.push({id: newItems.length +1, group: item.id, start_time: moment(item.shiftStart), end_time: moment(item.shiftEnd), TeamRoleId: role.id, DaysShiftId: daysShifts.id});
        console.log(temp);
        saveShifts(temp);
        setNewItems(temp);

        console.log(newItems);

    };

    const removeItem = (itemId, e, time) => {
        console.log(itemId);
        console.log(e);
        console.log(time);
    }
    console.log(moment(daysShifts.date))
    return (
        <CreateRosterContainer>
            <ColumnContainer>
            {role.EmployeeRoles.map(role => (
                <EmployeeCard employee={role} selectUser={selectUser}/>
            ))}
            </ColumnContainer>
            <Timeline
                groups={groups}
                items={newItems}
                visibleTimeStart={moment(daysShifts.date)}
                visibleTimeEnd={moment(daysShifts.date).add(1, 'd')}
                onItemClick={removeItem}
            />
            <AddShiftModal open={addShiftModal} onCancel={toggleModal} addShift={addItem} daysShifts={daysShifts} employee={selectedEmployee} role={role}/>
        </CreateRosterContainer>
    )
};

// newItems are the unsaved shifts that have just been created, items are the currently existing saved shifts.
const useCreateItems = (items, newItems) => {
    const [returnItems, setReturnItems] = useState([]);

    useEffect(() => {
        console.log(items);
        const shiftItems = items.map((item, index) => {
            return {id: newItems.length + index + 1,group: item.TeamMembershipId, start_time: moment(item.start),end_time: moment(item.end),}
        });

        setReturnItems(shiftItems.concat(newItems));
    }, [newItems, items]);
    console.log(returnItems);
    return returnItems
};

const AddShiftModal = ({open, onCancel, addShift, daysShifts, role, employee}) => {
    const [sending, setSending] = useState(false);
    const [submittable, setSubmittable] = useState(false);
    const [startSelected, setStartSelected] = useState(false);
    const [startTimes, setStartTimes] = useState([]);
    const [shiftEndTimes, setShiftEndTimes] = useState([]);
    const [shiftStart, setShiftStart] = useState(null);
    const [shiftEnd, setShiftEnd] = useState(null);
    const [form] = Form.useForm();

    
    
    useEffect(() => {
        createStartTimes();
    }, []);

    useEffect(() => {
        let shiftEnds = startTimes.filter(time => {
            return time.isAfter(shiftStart);
        });
        setShiftEndTimes(shiftEnds);
        console.log(shiftEnds);
    }, [shiftStart, startTimes]);

    const createStartTimes = () => {
        const dayStart = moment(daysShifts.date);
        const dates = [];
        for(let i = 0; i < 96; i++){
            dates.push(moment(dayStart.add(15, 'm')));
        };
        console.log(dates);
        setStartTimes(dates);
    };

    const onShiftStartChange = (start) => {
        setShiftStart(start);
        // setStartSelected(!startSelected);
        console.log(start);
    };

    const onShiftEndChange = end => {
        setShiftEnd(end);
    }

    const onFinish = (values) => {
        console.log('in on finish')
        addShift({id: employee.id, shiftStart: values.shiftStart, shiftEnd: values.shiftEnd});
    }
    

    // console.log(daysShifts);

    // console.log(open);
    if(open){
        console.log(employee);
        console.log(role);
        const user = employee.TeamMembership.User;
        return (
            <Modal
                title={ role.title + ': ' + user.firstName + ' ' + user.lastName}
                visible={open}
                onCancel={onCancel}
                // onOk={onFinish}
                footer={[
                    <ButtonWithSpinner
                      sending={sending}
                      form={"shift-times"}
                      innerHtml={"Add Shift"}
                      submittable={shiftEnd && shiftStart}
                    />,
                  ]}
            >
                <Form 
                    form={form}
                    onFinish={onFinish}
                    name='shiftTimes'
                    id='shift-times'
                >
                    <Form.Item
                        
                      name="shiftStart"
                      label="Shift Start Time"
                      extra="Enter the time this shift will start"
                      rules={[{ required: true }]}
                    >
                      <Select defaultActiveFirstOption onChange={onShiftStartChange}>
                        {startTimes.map((date) => (
                          <Option value={date.toString()} key={date.toString()}>
                            {date.format('HH:mm:SS')}
                          </Option>
                        ))}
                      </Select>
                      </Form.Item>
                      <Form.Item
                      name="shiftEnd"
                      label="Shift End Time"
                      extra="Enter the time this shift will finish"
                      rules={[{ required: true }]}
                    >
                      <Select defaultActiveFirstOption onChange={onShiftEndChange} disabled={!shiftStart}>
                          {shiftEndTimes.map((date => (
                              <Option value={date.toString()} key={date.toString()}>
                              {date.format('HH:mm:SS')}
                                </Option>
                          )))}
                      </Select>
                    </Form.Item>
                    </Form>
            </Modal>
        )
    } else {
        return null;
    }
    
}

const EmployeeCard = ({employee, selectUser}) => {
    const user = employee.TeamMembership.User;
    console.log(user);

    
    const onSelect = () => {
        selectUser(employee);
    };
    return (
        
        <Card title={user.firstName + ' ' + user.lastName} hoverable={true} style={{width: '200px'}} onClick={onSelect}/>
    )
}

export default Roster;