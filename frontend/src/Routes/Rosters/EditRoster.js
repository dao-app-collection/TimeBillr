import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import styled from 'styled-components'
import { CenteredContainer } from "../../styled-components/styled";
import { Typography, Divider, Card } from "antd";
import apiClient from "../../config/axios";
import { OrganizationContext } from "../../Context/OrganizationContext";

import {CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
import { useHistory, Link } from "react-router-dom";
import { useRosterContext } from "../../Context/RosterContext";

const {Meta} = Card;
const {Title} = Typography;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
const incompleteColor = '#ff9494';
const completeColor = '#52c41a'

const EditRoster = () => {
    const history = useHistory();
    const rosterContext = useRosterContext();
    const orgContext = useContext(OrganizationContext);
    const [current, future, previous] = useWeekSplit(rosterContext.rosterData);
    console.log(current);
    console.log(future);
    console.log(previous);

    const onRosterSelect = (id) => {

    };

    const arrayToCardRender = (array) => {
      return array.map(roster => {
        return( 
          <Link to={`/app/${orgContext.organizationData.id}/rosters/${roster.id}`}>
        <Card 
          style={{width: 'auto', margin: '0 8px'}}
          hoverable
          actions={[
            roster.complete ? <CheckCircleTwoTone twoToneColor={completeColor}/> : <CloseCircleTwoTone twoToneColor={incompleteColor} />
          ]}
        ><Meta title={moment(roster.weekStart).toString()}/></Card>
        </Link>
        )
    })
    }

  return (
    <CenteredContainer style={{maxWidth: 'calc(100vw - 80px)'}}>
      <Title level={3}>
        Current Roster
      </Title>
      <CardContainer>
        {arrayToCardRender(current)}
        {/* <Card
          style={{width: 200}}
          actions={[
            <CheckCircleTwoTone twoToneColor='#52c41a'/>
          ]}
        >
          <Meta
            title={'Some Date'}
          />
        </Card> */}
      </CardContainer>
      <Divider />
      <Title level={3}>
        Upcoming Rosters
      </Title>
      <CardContainer>
        {arrayToCardRender(future)}
      </CardContainer>
      <Divider />
      <Title level={3}>
        Previous Rosters
      </Title>
      <CardContainer>
        {arrayToCardRender(previous)}
      </CardContainer>
      
    </CenteredContainer>
  )
};

const useWeekSplit = (rosters) => {
  const [current, setCurrent] = useState([]);
  const [future, setFuture] = useState([]);
  const [previous, setPrevious] = useState([]);
  const startOfWeek = moment().startOf('week');
  console.log(rosters);
  useEffect(() => {
    let tempCurrent = rosters.filter(roster => {return startOfWeek.isSame(moment(roster.weekStart))});
    setCurrent(tempCurrent);
    let tempFuture = rosters.filter(roster => {return startOfWeek.isBefore(moment(roster.weekStart))});
    setFuture(tempFuture);
    let tempPrevious = rosters.filter(roster => {return startOfWeek.isAfter(moment(roster.weekStart))});
    setPrevious(tempPrevious);
  }, [rosters]);

  console.log(current, future, previous);

  return [current, future, previous];
};

export default EditRoster;