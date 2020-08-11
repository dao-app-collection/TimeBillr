import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import { CenteredContainer } from "../../styled-components/styled";
import { Form, Select, Button, Steps, Collapse } from "antd";
import apiClient from "../../config/axios";
import { OrganizationContext } from "../../Context/OrganizationContext";
import Modal from "antd/lib/modal/Modal";

import Roster from './Roster';
import {RosterSteps} from './CreateRoster';


const { Step } = Steps;
const { Option } = Select;
const {Panel} = Collapse;

const EditRoster = () => {
    const orgContext = useContext(OrganizationContext);
   const [form] = Form.useForm();
//   const dates = useWeekStarts();
  const [rosterStart, setRosterStart] = useState(null);
  const [step, setStep] = useState(0);
  const [roster, setRoster] = useState({})

  const changeStep = (current) => {
    setStep(current);
  };

  const onSelectStartDate = async (values) => {
    // console.log(values);
    // setRosterStart(moment(values.weekStart));
    // console.log(moment(values.weekStart));
    let weekStart = moment(values.weekStart);
    // console.log(weekStart);
    // console.log(weekStart.format("YYYY-MM-DD HH:MM:SS"));
    const newRoster = await apiClient.post('teams/rosters/initialize', {
        TeamId: orgContext.organizationData.id,
        weekStart: weekStart.format("YYYY-MM-DD HH:mm:SS"),
    })
    if(newRoster.status === 200){
        setRoster(newRoster.data);
    }
    console.log(newRoster);
  };
  
  if (!(Object.keys(roster).length === 0 && roster.constructor === Object)) {
    return (
      <CenteredContainer style={{ maxWidth: "calc(100vw - 100px)" }}>
        <RosterSteps step={step} onChange={changeStep} />
        <Roster step={step} roster={roster} />
        {/* <div>{rosterStart.toString()}</div> */}
      </CenteredContainer>
    );
  } else {
    return (
      <CenteredContainer style={{ maxWidth: "800px" }}>
        <Form form={form} onFinish={onSelectStartDate}>
          <Form.Item
            name="weekStart"
            label="Week Start Date"
            extra="Enter the date this roster will start on."
            rules={[{ required: true }]}
          >
            <Select defaultActiveFirstOption>
              {dates.map((date) => (
                <Option value={date.toString()} key={date.toString()}>
                  {date.toString()}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Start Roster
            </Button>
          </Form.Item>
        </Form>
      </CenteredContainer>
    );
  }
};