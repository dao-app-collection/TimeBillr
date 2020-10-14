import React, {useState, useEffect} from 'react';
import { useOrganizationContext } from '../../Context/OrganizationContext';
import moment from 'moment';

const useCreateStartAndEnd = (roster) => {
    const orgContext = useOrganizationContext();
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    // console.log(roster);

    useEffect(() => {
        // console.log(orgContext);
        console.log(orgContext.organizationData);
        let OpeningTimes = orgContext.organizationData.TeamSetting.OpeningHours.filter(openingtime => {
            return openingtime.day === roster.day
        })[0];
        console.log(OpeningTimes);
        setStart(moment(roster.date).add(OpeningTimes.open - (3600000)));
        setEnd(moment(roster.date).add(OpeningTimes.close + (3600000 * 2)));
        // console.log(OpeningTimes)
    }, [orgContext, roster])


    return {start,end}
};

export default useCreateStartAndEnd;