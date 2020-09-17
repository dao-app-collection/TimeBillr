import React, { useState, useEffect } from 'react';
import { CenteredContainer, CreateRosterContainer } from '../../styled-components/styled';
import { Collapse, Typography } from 'antd';
import { useOrganizationContext } from '../../Context/OrganizationContext';
import moment from 'moment';
import { useRosterContext } from '../../Context/RosterContext';

import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";

const {Panel} = Collapse;
const {Title} = Typography;

const Home = () => {
    const rosterContext = useRosterContext();
    const roster = useTodaysRoster();
    console.log(rosterContext);

    if(roster){
        return (
            <HomeRoster />
        );
    } else {
        return null;
    }
    
};

const HomeRoster = () => {
    const [roles, setRoles] = useState([]);
    const roster = useTodaysRoster();
    const orgContext = useOrganizationContext();

    console.log(roster);

    useEffect(() => {
        setRoles(orgContext.organizationData.TeamRoles);
    }, [orgContext.organizationData.TeamRoles])

    return (
        <>
        <CenteredContainer style={{maxWidth: '100%', padding: '0 24px'}}>
    <Title level={3} style={{color: '#5f9bf1', margin: '8px', textAlign: 'center',}}>Today's Roster {roster ? moment(roster.date).format('DD/MM/YYYY') : ''}</Title>
        <Collapse>
        {roles.map(role => (
            
                <Panel header={role.title} key={role.id}>
                    <HomeRosterCalender roster={roster} role={role}/>
                </Panel>
            
        ))}
        </Collapse>
        </CenteredContainer>
        </>
    )
};

const HomeRosterCalender = ({roster, role}) => {
    const {shifts, groups} = useOrderedFilteredShifts(roster, role);

    console.log(roster);
    // let groups
    // console.log(shifts);
    // let tempGroups = [{id: 1, title: 'Clinton Gillespie'}, {id: 2, title: 'Joseph Thompson'}, {id: 3, title: 'Jason Taylor'}];
    console.log(groups);
    console.log(shifts);
    console.log(moment(roster.date));
    console.log(moment(roster.date).add(1, 'd'))
    if(groups.length > 0){
    return (
        <CreateRosterContainer>
            
        <Timeline
            groups={groups}
            items={shifts}
            defaultTimeStart={moment(roster.date)}
            defaultTimeEnd={moment(roster.date).add(1, 'd')}
        />
        </CreateRosterContainer>
    )} else {
        return <CreateRosterContainer>div</CreateRosterContainer>;
    }
};

const useOrderedFilteredShifts = (roster, role) => {
    const [shifts, setShifts] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const shiftItems = roster.Shifts.filter(shift => {
            return shift.TeamRoleId === role.id;
        }).map((filteredShift, index) => {
            return {
                id: index,
                group: filteredShift.TeamMembershipId,
                DaysShiftId: filteredShift.DaysShiftId,
                TeamRoleId: filteredShift.TeamRoleId,
                start_time: moment(filteredShift.start),
                end_time: moment(filteredShift.end),
                itemProps: {
                  style: {zIndex: '100', background: filteredShift.confirmed ? '#00F704' : 'rgb(33, 150, 243)'}
                }
              };
        });
        

        let sortedShiftItems = shiftItems.sort((a, b) => {return a.start_time.valueOf() - b.start_time.valueOf()});
        

        let sortedStartOfGroups = sortedShiftItems.map(shiftItem => {
            let employee = role.EmployeeRoles.find(role => {
                
                return role.TeamMembershipId === shiftItem.group;
            });
            
            let firstName = employee.TeamMembership.User.firstName;
            let lastName = employee.TeamMembership.User.lastName;
            return {
                id: shiftItem.group,
                title: firstName + ' ' + lastName,
            };
        });
        
        let remainingGroups = role.EmployeeRoles.map(role => {
            let groupAlreadyExists = sortedStartOfGroups.filter(group => {
                
                return role.TeamMembershipId === group.id;
            });
            
            if(groupAlreadyExists.length === 0){
                let firstName = role.TeamMembership.User.firstName;
                let lastName = role.TeamMembership.User.lastName;
                return {
                    id: role.TeamMembershipId,
                    title: firstName + ' ' + lastName,
                }
            } else {
                return null;
            }
        });
        let groupItems = sortedStartOfGroups.concat(remainingGroups);

        setGroups(groupItems.filter(group => {return group !== null}));
        setShifts(sortedShiftItems);
    }, [roster, role]);

    return {shifts, groups};
}

const useTodaysRoster = () => {
    const [roster, setRoster] = useState(null);
    const rosterContext = useRosterContext();
    const startOfWeek = moment().startOf('week');

    useEffect(() => {

        let thisWeeksRoster = rosterContext.rosterData.find(roster => {
            return startOfWeek.isSame(moment(roster.weekStart))
        });
        if(thisWeeksRoster){
            let day = moment().day();
        // console.log(day);
        let todaysShifts = thisWeeksRoster.DaysShifts.find(daysShift => {
            return day === daysShift.day
        });

        // console.log(todaysShifts);
        // console.log(day);

        // console.log(thisWeeksRoster);
        // console.log(rosterContext)
        setRoster(todaysShifts);
        } else {
            setRoster(null);
        }
        
    }, [rosterContext, startOfWeek]);

    return roster;
};


export default Home;