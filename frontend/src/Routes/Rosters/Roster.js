import React, {useContext, useState, useEffect}from 'react';
import {OrganizationContext} from '../../Context/OrganizationContext';
import {Collapse, Card, Form, Select} from 'antd';

import {CreateRosterContainer, ColumnContainer} from '../../styled-components/styled';
import moment from 'moment';

import ButtonWithSpinner from '../../Components/ButtonWithSpinner';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css'
import { RosterContext } from '../../Context/RosterContext';
import Modal from 'antd/lib/modal/Modal';

const {Panel} = Collapse;
const {Option} = Select;

const Roster = ({step, roster}) => {
    const orgContext = useContext(OrganizationContext);
    const rosterContext = useContext(RosterContext);
    const [roles, setRoles] = useState([]);
    const [currentDaysShift, setCurrentDaysShift] = useState(roster.DaysShifts[step]);

    console.log(roster);

    useEffect(() => {
        setRoles(orgContext.organizationData.TeamRoles);
    }, [orgContext.organizationData.TeamRoles]);
    console.log(step);
    console.log(roster);
    console.log(orgContext.organizationData);

    return (
        <Collapse>
            {roles.map(role => (
                <Panel header={role.title} key={role.id}>
                    <RosterCalendar role={role} step={step} daysShifts={currentDaysShift}/>
                </Panel>
            ))}
        </Collapse>
    )
};

const RosterCalendar = ({role, step, daysShifts}) => {
    const [addShiftModal, setAddShiftModal] =useState(false);
    const [selectedEmployee,setSelectedEmployee] = useState({});
    console.log(role);
    console.log(step);
    
    // The 'groups' are the employees, they are shown on the LHS of the calendar
    // The group id is the TeamMembershipId,
    // Items that appear next to this group, use the Id of the group.
    const groups = role.EmployeeRoles.map((employee) => {
        return {id: employee.TeamMembershipId, title: employee.TeamMembership.User.firstName + ' ' + employee.TeamMembership.User.lastName}
    });
    const items = [];
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

    };

    const removeItem = (item) => {

    }

    return (
        <CreateRosterContainer>
            <ColumnContainer>
            {role.EmployeeRoles.map(role => (
                <EmployeeCard employee={role} selectUser={selectUser}/>
            ))}
            </ColumnContainer>
            <Timeline
                groups={groups}
                items={items}
                visibleTimeStart={moment(daysShifts.date)}
                visibleTimeEnd={moment(daysShifts.date).add(1, 'd')}
            />
            <AddShiftModal open={addShiftModal} onCancel={toggleModal} addShift={addItem} daysShifts={daysShifts}/>
        </CreateRosterContainer>
    )
};

const AddShiftModal = ({open, onCancel, addShift, daysShifts}) => {
    const [sending, setSending] = useState(false);
    const [submittable, setSubmittable] = useState(false);
    const [startSelected, setStartSelected] = useState(false);
    const [startTimes, setStartTimes] = useState([]);
    const [shiftStart, setShiftStart] = useState(null);
    const [form] = Form.useForm();
    
    useEffect(() => {
        createStartTimes();
    }, []);

    useEffect(() => {
        let shiftEnds = startTimes.filter(time => {
            return time.isAfter(shiftStart);
        });
        console.log(shiftEnds);
    }, [shiftStart]);

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

    const onFinish = (values) => {

    }
    

    // console.log(daysShifts);

    // console.log(open);

    return (
        <Modal
                title={'hehe'}
                visible={open}
                onCancel={onCancel}
                footer={[
                    <ButtonWithSpinner
                      sending={sending}
                      form={"weekStart"}
                      innerHtml={"Add Shift"}
                      submittable={submittable}
                    />,
                  ]}
            >
                <Form form={form} onFinish={onFinish}>
                    <Form.Item
                      name="weekStart"
                      label="Week Start Date"
                      extra="Enter the date this roster will start on."
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
                    </Form>
            </Modal>
    )
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