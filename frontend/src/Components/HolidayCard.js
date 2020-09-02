import React, {useState, useEffect} from 'react'
import { useOrganizationContext } from "../Context/OrganizationContext";
import moment from 'moment';
import { CheckCircleTwoTone, StopTwoTone, DeleteTwoTone } from '@ant-design/icons';
import {Card} from 'antd';

const HolidayCard = ({request, handleRequest, admin}) => {
    const orgContext = useOrganizationContext();
    const [user,setUser] = useState(null);
    const start = moment(request.start).format('DD/MM/YY');
    const end = moment(request.end).format('DD/MM/YY');

    console.log(admin);
    useEffect(() => {
        let temp = orgContext.organizationData.TeamMemberships.find(membership => {
            return request.TeamMembershipId === membership.id
        });

        setUser(temp)
    }, [orgContext.organizationData, request])
    if(user){
        return (
            <Card 
                title={user.User.firstName + ' ' + user.User.lastName}
                actions={[
                    
                        admin ? <CheckCircleTwoTone twoToneColor={"#52c41a"} onClick={() => handleRequest(request.id, 'approve')}/> : null,
                        admin ? <StopTwoTone twoToneColor={'rgb(214,9,9)'} onClick={() => handleRequest(request.id, 'deny')}/> : null,
                        <DeleteTwoTone twoToneColor={'#1b84f5'} onClick={() => handleRequest(request.id, 'delete')}/>
                    
                ]}
                style={{margin: '6px'}}
            >
                <p>{start + ' - ' + end}</p>
            </Card>
        )
    } else {
        return null;
    }
    
}

export default HolidayCard;