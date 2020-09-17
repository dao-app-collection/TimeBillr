import React, { useState } from 'react';
import useWeekSplit from '../Rosters/Hooks/useWeekSplit';
import { useEmployeeContext } from '../../Context/EmployeeContext';
import { Typography, Divider, Card, Button } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import styled from 'styled-components';
import moment from 'moment';
import ButtonWithSpinner from '../../Components/ButtonWithSpinner';
import apiClient from '../../config/axios';
import { useOrganizationContext } from '../../Context/OrganizationContext';
import { useAlert } from 'react-alert';

const {Title} = Typography;
const {Meta} = Card;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const indexToDay = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const completeColor = "#52c41a";

const UpcomingShifts = () => {
    const employeeContext = useEmployeeContext();
    const [current, future, previous] = useWeekSplit(employeeContext.employeeRosters);
    console.log(current);
    console.log(future);
    console.log(previous);
    return (
        <>
        <Title level={3}>This week  </Title >
        <ShiftRender arrayOfShifts={current}/>
        <Divider />
        <Title level={3}>Future Rosters</Title>
        <ShiftRender arrayOfShifts={future} />
        </>
    );
};

const ShiftRender = ({arrayOfShifts}) => {
    const orgContext = useOrganizationContext();
    const employeeContext = useEmployeeContext();
    const [sending, setSending] = useState(false);
    const alert = useAlert();

    const markConfirmed = async (shift) => {
        console.log(shift);
        setSending(true);
        try {
          const res = await apiClient.post('employee/shift/confirm', 
            {TeamId: orgContext.organizationData.id, ShiftId: shift.id}
        )
          if(res.status === 200){
            alert.show('Confirmed', {
              type: 'success'
            });
            employeeContext.markConfirmed(shift);
            setSending(false);
          }
        } catch (error) {
          alert.show('Error: Could not confirm shift', {
            type: 'error'
          });
          setSending(false);
        }
        

        

    }
    console.log(arrayOfShifts);
    console.log(indexToDay[2]);
    return (
        <>
        {arrayOfShifts.map(roster => (
            <>
            <Title level={4}>{moment(roster.weekStart).format('DD/MM/YY') + '-' + moment(roster.weekStart).endOf('week').format('DD/MM/YY')}</Title>
            {roster.DaysShifts.map((daysShifts)=> (
                <>
                <CardContainer>
                {daysShifts.Shifts.map((shift) => (
                    
                    <Card
                    title={`${indexToDay[daysShifts.day]}`}
                    style={{ width: "300px", maxWidth: '300px', margin: "8px 8px" }}
                    hoverable={false}
                    actions={[
                      shift.confirmed ? (
                        <CheckCircleTwoTone twoToneColor={completeColor} />
                      ) : (
                        // <Button onClick={() => markConfirmed(shift)}>Confirm Shift</Button>
                        <ButtonWithSpinner innerHtml={'Confirm Shift'}sending={sending} onSubmit={() => markConfirmed(shift)} />
                      ),
                    ]}
                  >
                      <p>{moment(shift.start).format('HH:mm:SS') + ' - ' + moment(shift.end).format('HH:mm:SS')}</p>
                    {/* <Meta title= /> */}
                  </Card>
                  
                ))}
                </CardContainer>
                </>
            ))}
            <Divider />
            </>
        ))}
        
        </>
    )
}

export default UpcomingShifts;