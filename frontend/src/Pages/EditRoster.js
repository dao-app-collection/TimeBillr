import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import styled from "styled-components";
import { CenteredContainer } from "../styled-components/styled";
import { Typography, Divider, Card, Modal, Button, Table, Collapse } from "antd";
import apiClient from "../config/axios";
import { OrganizationContext, useOrganizationContext } from "../Context/OrganizationContext";

import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";
import { useRosterContext } from "../Context/RosterContext";
import useWeekSplit from '../Components/Hooks/useWeekSplit';

const {Panel} = Collapse;
const { Meta } = Card;
const { Title } = Typography;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const incompleteColor = "#ff9494";
const completeColor = "#52c41a";

const EditRoster = () => {
  const history = useHistory();
  const rosterContext = useRosterContext();
  const orgContext = useContext(OrganizationContext);
  const [current, future, previous] = useWeekSplit(rosterContext.rosterData);
  const [selectedRoster, setSelectedRoster] = useState(null);
  console.log(current);
  console.log(future);
  console.log(previous);

  const onRosterSelect = (roster) => {
    console.log('on roster select')
    console.log(roster);
    setSelectedRoster(roster);
  };

  const closeModal = () => {
    setSelectedRoster(null);
  }

  const arrayToCardRender = (array) => {

    
    return array.map((roster) => {
      const weekStart = moment(roster.weekStart);
      return (
        // <Link
        //   to={`/app/${orgContext.organizationData.id}/rosters/${roster.id}`}
        //   key={roster.id}
        // >
          <Card
            style={{ width: "auto", margin: "8px 8px" }}
            hoverable
            onClick={() => {onRosterSelect(roster)}}
            actions={[
              roster.complete ? (
                <CheckCircleTwoTone twoToneColor={completeColor} />
              ) : (
                <CloseCircleTwoTone twoToneColor={incompleteColor} />
              ),
            ]}
          >
            <Meta title={weekStart.format('DD/MM/YYYY') + ' - ' + weekStart.endOf('week').format('DD/MM/YYYY')} />
          </Card>
        // </Link>
      );
    });
  };

  return (
    <>
    <CenteredContainer style={{ maxWidth: "calc(100vw - 80px)" }}>
      <Title level={3}>Current Roster</Title>
      <CardContainer>
        {arrayToCardRender(current)}
      </CardContainer>
      <Divider />
      <Title level={3}>Upcoming Rosters</Title>
      <CardContainer>{arrayToCardRender(future)}</CardContainer>
      <Divider />
      <Title level={3}>Previous Rosters</Title>
      <CardContainer>{arrayToCardRender(previous)}</CardContainer>
    </CenteredContainer>
    {selectedRoster ? <RosterSummaryModal roster={selectedRoster} closeModal={closeModal}/> : null}
    </>
  );
};

const columns = [
  {
    title: 'Role',
    dataIndex: 'role'
  },
  {
    title: 'Full Time Hours',
    dataIndex: 'fullTime',
  },
  {
    title: 'Part Time Hours',
    dataIndex: 'partTime',
  },
  {
    title: 'Casual Hours',
    dataIndex: 'casual'
  },
  {
    title: 'Total Hours',
    dataIndex: 'totalHours'
    },
];

const employeeColumns = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Rostered Hours',
    dataIndex: 'hours'
  },
  {
    title: 'Required Hours',
    dataIndex: 'requiredHours'
  },
  {
    title: 'Difference',
    dataIndex: 'difference'
  }
]

const RosterSummaryModal = ({roster, closeModal}) => {
  console.log(roster);
  const history = useHistory();
  const orgContext = useOrganizationContext();
  const costData = useCreateTotalCostData(roster);
  const employeeData = useCreateTotalEmployeeHours(roster);
  console.log(employeeData);
  // const costData = [{
  //   key: 0, role: 'fuck', totalHours: 0, fullTime: 0, partTime: 0,
  //   casual: 0, horizontaltotal: 0,
  // }]
  // console.log(costData);
  const editRoster = () => {
    history.push(`/app/${orgContext.organizationData.id}/rosters/${roster.id}`)
  }
  if(roster){
    return (
      <Modal
        title={'Roster start date: ' + moment(roster.weekStart).format('DD/MM/YYYY')}
        visible={roster}
        onCancel={closeModal}
        footer={[
        <Button onClick={editRoster} type='primary'>View/Edit</Button>,
        <Button type='danger'>Delete</Button>
      ]}
      >
        <Collapse>
          <Panel header={'Cost Summary'}>
          <Table
          columns={columns}
          dataSource={costData}
          pagination={false}
          summary={pageData => {
            // console.log(pageData);
            let fullTimeCost = 0;
            let partTimeCost = 0;
            let casualCost = 0;
            
            pageData.forEach(data => {
              fullTimeCost += (parseFloat(data.fullTime) * parseFloat(data.fullTimeRate));
              partTimeCost += (parseFloat(data.partTime) * parseFloat(data.partTimeRate));
              casualCost += (parseFloat(data.casual) * parseFloat(data.casualRate));
            });
            // console.log(fullTimeCost)
            return (
              <>
                <Table.Summary.Row style={{background: '#fafafa'}}>
                  <Table.Summary.Cell>Cost</Table.Summary.Cell>
                  <Table.Summary.Cell>{`$${fullTimeCost}`}</Table.Summary.Cell>
                  <Table.Summary.Cell>{`$${partTimeCost}`}</Table.Summary.Cell>
                  <Table.Summary.Cell>{`$${casualCost}`}</Table.Summary.Cell>
                  <Table.Summary.Cell>{`$${fullTimeCost + partTimeCost + casualCost}`}</Table.Summary.Cell>

                </Table.Summary.Row>
              </>
            )
          }}
        ></Table>

          </Panel>
        </Collapse>
        
        <Collapse>
          <Panel header={'Employee Hours Summary'}>
            <Table 
              columns={employeeColumns}
              dataSource={employeeData}
              pagination
            ></Table>
          </Panel>
        </Collapse>
        
      </Modal>
    )
  } else {
    return null;
  }
};

function msToHours(ms){
  return (ms / (1000 * 60 * 60)).toFixed(1);
};
function hoursToMs(hrs){
  return (hrs * 60 * 60 * 1000);
}
const useCreateTotalEmployeeHours = (roster) => {
  const [data, setData] = useState([]);
  const orgContext = useOrganizationContext();
  const teamMembers = orgContext.organizationData.TeamMemberships;
  // console.log(teamMembers);

  useEffect(() => {
    const teamMemberships = teamMembers.map(member => {
      console.log(member.User);
      let name = member.User.firstName + " " + member.User.lastName;
      return {id: member.id, employmentType: member.employmentType, minimumHours: member.minimumHours, name: name}
    });
    let tempData = [];
    teamMemberships.forEach((member, index) => {
      let rostered = 0;
      let row = {name: member.name, requiredHours: member.minimumHours}
      roster.DaysShifts.forEach(daysshift => {
        // console.log(daysshift);
        daysshift.Shifts.forEach(shift => {
          if(shift.TeamMembershipId === member.id){
            let start = moment(shift.start);
            let end = moment(shift.end);
            let duration = end.diff(start);
            rostered += duration;
          }
          
          
        })
      });
      row.hours = msToHours(rostered);
      row.difference = msToHours(rostered - hoursToMs(row.requiredHours));
      tempData.push(row);
    });
    tempData.sort((a, b) => {return a.difference - b.difference});
    setData(tempData);
  }, [roster, teamMembers]);

  return data;
}

const useCreateTotalCostData = (roster) => {
  // data is an array of objects, each object contains keys corresponding to the dataIndex
  // of the columns array, each key's value will appear in the objects row,
  // under the corresponding data index
  // each team role will have it's own row.
  const [data, setData] = useState([]);
  const orgContext = useOrganizationContext();
  const teamRoles = orgContext.organizationData.TeamRoles;
  const teamMembers = orgContext.organizationData.TeamMemberships;

  // console.log(orgContext);
  // console.log(teamRoles);
  // console.log(teamMembers);
  
  useEffect(() => {
    let teamMemberships = teamMembers.map(member => {
      return {id: member.id, employmentType: member.employmentType,}
    });
    let tempData = [];
    // console.log(teamRoles);
    teamRoles.forEach((teamRole, index) => {
      let role = teamRole.title;
      let totalHours = 0;
      let fullTime = 0;
      let fullTimeRate = teamRole.fullTimeRate;
      let partTime = 0;
      let partTimeRate = teamRole.partTimeRate;
      let casual = 0;
      let casualRate = teamRole.casualRate;
      let horizontaltotal = 0;
      // console.log(roster);
      roster.DaysShifts.forEach(daysshift => {
        // console.log(daysshift);
        daysshift.Shifts.forEach(shift => {
          if(shift.TeamRoleId === teamRole.id){
            let member = teamMemberships.find(member => {return member.id === shift.TeamMembershipId});
          let start = moment(shift.start);
          let end = moment(shift.end);
          let duration = end.diff(start);
          console.log(member.employmentType);
          if(member.employmentType === 'fullTime'){
            fullTime += duration;
          } else if(member.employmentType === 'partTime'){
            partTime += duration;
          } else {
            casual += duration;
          }
          totalHours += duration;
          }
          
          
        })
      })
      tempData.push({
        key: index, role, totalHours: msToHours(totalHours), 
        fullTime: msToHours(fullTime), partTime: msToHours(partTime), 
        casual: msToHours(casual), horizontaltotal,
        fullTimeRate, partTimeRate, casualRate
      });
      // totalHours = 0;
      // fullTime = 0;
      // partTime = 0;
      // casual = 0;

    });
    setData(tempData);
  }, [teamRoles, teamMembers, roster]);
  // console.log(data);
  return data;
};





export default EditRoster;
