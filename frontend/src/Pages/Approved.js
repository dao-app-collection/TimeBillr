import React, {useState, useEffect} from 'react';
import { useOrganizationContext } from '../Context/OrganizationContext';
import apiClient from '../config/axios';
import { useAlert } from 'react-alert';
import HolidayCard from '../Components/Ui/HolidayCard';
import styled from 'styled-components'
const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
const Approved = () => {
    const orgContext = useOrganizationContext();
    const requests = useApprovedRequests();

    const alert = useAlert();

    console.log(orgContext);

    

    return (
        <>
        
        <CardContainer>
            {requests.map(request => (
                // renderCard(request)
                <HolidayCard request={request} handleRequest={null} />
            ))}
        </CardContainer>
        </>
        
    );
};

const useApprovedRequests = () => {
    const orgContext = useOrganizationContext();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const requestsTemp = orgContext.organizationData.Holidays.filter((holiday) => {
            return (holiday.approved )
        });

        setRequests(requestsTemp);
    }, [orgContext.organizationData]);

    return requests;
}
export default Approved;