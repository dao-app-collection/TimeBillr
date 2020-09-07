import React, { useState, useEffect } from 'react';
import { CenteredContainer } from '../../styled-components/styled';
import { Collapse } from 'antd';
import { useOrganizationContext } from '../../Context/OrganizationContext';
import moment from 'moment';
import { useRosterContext } from '../../Context/RosterContext';

const {Panel} = Collapse;

const Home = () => {
    return (
        <HomeRoster />
    );
};

const HomeRoster = () => {
    const [roles, setRoles] = useState([]);
    const roster = useTodaysRoster();
    const orgContext = useOrganizationContext();

    // console.log(roster);

    useEffect(() => {
        setRoles(orgContext.organizationData.TeamRoles);
    }, [orgContext.organizationData.TeamRoles])

    return (
        <>
        <CenteredContainer style={{maxWidth: '1000px'}}>
        <Collapse>
        {roles.map(role => (
            <>
                <Panel header={role.title} forceRender>
                    <HomeRosterCalender roster={roster} role={role}/>
                </Panel>
            </>
        ))}
        </Collapse>
        </CenteredContainer>
        </>
    )
};

const HomeRosterCalender = ({roster, role}) => {
    const shifts = useOrderedFilteredShifts(roster, role);

    return null;
};

const useOrderedFilteredShifts = (roster, role) => {
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        console.log('in useOrderedFilteredShifts')
        console.log(role);
        console.log(roster);
    }, [roster, shifts]);

    return shifts;
}

const useTodaysRoster = () => {
    const [roster, setRoster] = useState(null);
    const rosterContext = useRosterContext();
    const startOfWeek = moment().startOf('week');

    useEffect(() => {

        let thisWeeksRoster = rosterContext.rosterData.find(roster => {
            return startOfWeek.isSame(moment(roster.weekStart))
        });

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
    }, [rosterContext, startOfWeek]);

    return roster;
};


export default Home;