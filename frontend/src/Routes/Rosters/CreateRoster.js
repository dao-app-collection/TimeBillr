import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import { CenteredContainer } from "../../styled-components/styled";
import { Form, Select, Button, Steps, Collapse, Checkbox } from "antd";
import apiClient from "../../config/axios";
import { OrganizationContext } from "../../Context/OrganizationContext";
import Modal from "antd/lib/modal/Modal";

import Roster from "./Roster";
import { RosterContext, useRosterContext } from "../../Context/RosterContext";
import { useHistory } from "react-router-dom";

const { Step } = Steps;
const { Option } = Select;
const { Panel } = Collapse;
// A week start picker is shown, giving options of what sunday to start the roster on,
// You cannot create a roster for the past, but you can create rosters up to 3 months in advance. i.e 12 weeks.

const CreateRoster = () => {
  const orgContext = useContext(OrganizationContext);
  const rosterContext = useRosterContext();
  const history = useHistory();
  const [form] = Form.useForm();
  const dates = useWeekStarts(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const templateDates = useTemplateWeekStarts(useTemplate);

  const onSelectStartDate = async (values) => {
    let weekStart = moment(values.weekStart);

    if (!useTemplate) {
      const newRoster = await apiClient.post("teams/rosters/initialize", {
        TeamId: orgContext.organizationData.id,
        weekStart: weekStart.format("YYYY-MM-DD HH:mm:SS"),
      });
      if (newRoster.status === 200) {
        rosterContext.addNewRoster(newRoster.data);
        history.push(
          `/app/${orgContext.organizationData.id}/rosters/${newRoster.data.id}`
        );
        // setRoster(newRoster.data);
      }
      console.log(newRoster);
    } else {
      const newRoster = await apiClient.post("teams/rosters/initialize", {
        TeamId: orgContext.organizationData.id,
        weekStart: weekStart.format("YYYY-MM-DD HH:mm:SS"),
      });
      if (newRoster.status === 200) {
        const clonedRoster = await apiClient.post("teams/rosters/clone", {
          TeamId: orgContext.organizationData.id,
          RosterId: newRoster.data.id,
          CloneRosterId: values.template,
        });
        if (clonedRoster.status === 200) {
          console.log(clonedRoster);
          rosterContext.addNewRoster(newRoster.data);
          history.push(
            `/app/${orgContext.organizationData.id}/rosters/${newRoster.data.id}`
          );
        }
      }
    }
  };

  const toggleUseTemplate = (e) => {
    setUseTemplate(e.target.checked);
  };
  
  console.log(templateDates);

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
        <Form.Item
          name="useTemplate"
          label="Use a previous roster as a template?"
          extra="Select this option to to use a previously created roster as a starting point for this one."
          rules={[{ required: false }]}
        >
          <Checkbox onChange={toggleUseTemplate}></Checkbox>
        </Form.Item>
        {useTemplate ? (
          <Form.Item
            name="template"
            label="Select the week to use as a template"
            rules={[{ required: true }]}
          >
            <Select>
              {templateDates.map((date) => (
                <Option value={date.id} key={date.id}>
                  {date.date.toString()}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : null}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Start Roster
          </Button>
        </Form.Item>
      </Form>
    </CenteredContainer>
  );
};

const useTemplateWeekStarts = (useTemplate) => {
  const rosterContext = useRosterContext();
  const [weekStarts, setWeekStarts] = useState([]);

  useEffect(() => {
    let starts = [];
    if (rosterContext.rosterData) {
      starts = rosterContext.rosterData.map((roster) => {
        return { id: roster.id, date: moment(roster.weekStart) };
      });
    }
    setWeekStarts(starts);
  }, [useTemplate, rosterContext.rosterData]);

  return weekStarts;
};

const useWeekStarts = (edit) => {
  const rosterContext = useRosterContext();
  const [weekStarts, setWeekStarts] = useState([]);

  console.log(rosterContext);

  useEffect(() => {
    const today = moment();
    const weekStart = today.startOf("week");

    let startDays = [moment(weekStart)];

    for (let i = 0; i < 13; i++) {
      startDays.push(moment(weekStart.add(1, "w")));
    }
    let existingWeeks = [];
    if (rosterContext.rosterData) {
      existingWeeks = rosterContext.rosterData.map((roster) => {
        return moment(roster.weekStart);
      });
    }

    const returnDays = startDays.filter((date) => {
      return !existingWeeks.find((existingDate) => {
        return date.isSame(existingDate);
      });
    });

    // const filteredStartDays = startDays.filter(start => {
    //   return rosterContext.rosterData
    // })
    setWeekStarts(returnDays);
  }, [rosterContext.rosterData]);

  return weekStarts;
};

export default CreateRoster;
