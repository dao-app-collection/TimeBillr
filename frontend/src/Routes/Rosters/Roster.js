import React, { useContext, useState, useEffect } from "react";
import { OrganizationContext } from "../../Context/OrganizationContext";
import { Collapse, Card, Form, Select, Button } from "antd";

import {
  CreateRosterContainer,
  ColumnContainer,
  CenteredContainer,
} from "../../styled-components/styled";
import moment from "moment";

import RosterSteps from "./RosterSteps";
import ButtonWithSpinner from "../../Components/ButtonWithSpinner";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import { useRosterContext } from "../../Context/RosterContext";
import Modal from "antd/lib/modal/Modal";
import useRoster from "./Hooks/useRoster";
import useSelectedDaysShift from "./Hooks/useSelectedDaysShift";

import styled from "styled-components";
import apiClient from "../../config/axios";
import { useAlert } from "react-alert";
const { Panel } = Collapse;
const { Option } = Select;

const ButtonContainer = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  justify-content: center;
`;

const Roster = () => {
  const alert = useAlert();
  const roster = useRoster();
  const [step, setStep] = useState(0);
  const selectedDaysShift = useSelectedDaysShift(roster, step);
  const orgContext = useContext(OrganizationContext);
  const rosterContext = useRosterContext();
  const [roles, setRoles] = useState([]);

  const [shiftsToSubmit, setShiftsToSubmit] = useState([]);
  const [shiftsToDelete, setShiftsToDelete] = useState([]);
  const [sending, setSending] = useState(false);

  const changeStep = async (newStep) => {
    console.log(newStep);
    // here we need to force save all of the new entries
    if (shiftsToSubmit.length > 0 || shiftsToDelete.length > 0) {
      await submitShifts();
      setStep(newStep);
    } else {
      setStep(newStep);
    }

    console.log(step);
  };

  useEffect(() => {
    setRoles(orgContext.organizationData.TeamRoles);
  }, [orgContext.organizationData.TeamRoles]);

  const submitShifts = async () => {
    if(sending){
      return;
    }
    setSending(true);
    let returnPromise = new Promise(async (resolve, reject) => {
      // console.log(shiftsToSubmit);
      const shiftsWithMomentsFormatted = shiftsToSubmit.map((shift) => {
        console.log(shift);
        return {
          TeamMembershipId: shift.group,
          TeamRoleId: shift.TeamRoleId,
          DaysShiftId: shift.DaysShiftId,
          start: shift.start_time.format("YYYY-MM-DD HH:mm:SS"),
          end: shift.end_time.format("YYYY-MM-DD HH:mm:SS"),
        };
      });
      try {
        const res = await apiClient.post(
          `/teams/rosters/${orgContext.organizationData.id}/addShift`,
          {
            shifts: shiftsWithMomentsFormatted,
            shiftsToDelete: shiftsToDelete,
            TeamId: orgContext.organizationData.id,
          }
        );
        if (res.status === 200) {
          alert.show(res.data.success, {
            type: "success",
          });
          setShiftsToDelete([]);
          setShiftsToSubmit([]);
          resolve("success");
        } else {
          reject("Failed");
          // console.log(res);
        }
      } catch (error) {
        // console.log(error);
        alert.show(error.response.data.message, {
          type: "error",
        });

        reject();
      }
    });
    setShiftsToDelete([]);
    setShiftsToSubmit([]);
    setSending(false);
    return returnPromise;
  };

  const saveShifts = (shifts) => {
    setShiftsToSubmit(shiftsToSubmit.concat(shifts));
  };

  const removeShifts = (shifts) => {
    let temp = shiftsToDelete;
    if (shifts.existingId) {
      // console.log(selectedDaysShift);
      // console.log(shifts);

      let shift = selectedDaysShift.Shifts.filter((shift) => {
        return shift.id === shifts.existingId;
      });
      // console.log(shift);
      temp = temp.concat(shift);
    }

    setShiftsToDelete(temp);
  };

  return (
    <>
      <CenteredContainer style={{ maxWidth: "calc(100vw - 80px)" }}>
        <RosterSteps step={step} onChange={changeStep} />
        <Collapse>
          {roles.map((role) => (
            <Panel header={role.title} key={role.id}>
              <RosterCalendar
                role={role}
                step={step}
                daysShifts={selectedDaysShift}
                saveShifts={saveShifts}
                removeShifts={removeShifts}
              />
            </Panel>
          ))}
        </Collapse>
        <ButtonContainer>
          <ButtonWithSpinner
            sending={sending}
            // form={"shift-times"}
            onSubmit={submitShifts}
            innerHtml={"Save"}
            submittable={true}
          />
        </ButtonContainer>
        <RosterComplete roster={roster} step={step} />
      </CenteredContainer>
    </>
  );
};

const RosterComplete = ({ roster, step }) => {
  const alert = useAlert();
  const orgContext = useContext(OrganizationContext);
  // console.log(orgContext.organizationData.id);
  const completeRoster = async () => {
    try {
      const res = await apiClient.post(
        `/teams/rosters/${orgContext.organizationData.id}/toggleComplete`,
        {
          TeamId: orgContext.organizationData.id,
          roster,
        }
      );
      if (res.status === 200) {
        alert.show(res.data.success, {
          type: "success",
        });
      }
    } catch (error) {
      alert.show(error.response.data.message, {
        type: "error",
      });
    }
  };
  if (step === 6) {
    return (
      <ButtonContainer>
        <Button onClick={completeRoster}>
          {roster.complete
            ? "Mark Roster as Incomplete"
            : "Mark Roster as Complete"}
        </Button>
      </ButtonContainer>
    );
  } else {
    return null;
  }
};

const RosterCalendar = ({
  role,
  step,
  daysShifts,
  saveShifts,
  removeShifts,
}) => {
  const [addShiftModal, setAddShiftModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [newItems, setNewItems] = useState([]);
  const [itemsToRemove, setItemsToRemove] = useState([]);
  const items = useCreateItems(
    daysShifts.Shifts,
    newItems,
    role,
    itemsToRemove
  );
  // console.log(role);
  // console.log(step);
  // console.log(daysShifts);

  useEffect(() => {}, [newItems, daysShifts]);

  // The 'groups' are the employees, they are shown on the LHS of the calendar
  // The group id is the TeamMembershipId,
  // Items that appear next to this group, use the Id of the group.
  const groups = role.EmployeeRoles.map((employee) => {
    return {
      id: employee.TeamMembershipId,
      title:
        employee.TeamMembership.User.firstName +
        " " +
        employee.TeamMembership.User.lastName,
    };
  });

  // const newItems = [{id: 1,group: 1, start_time: moment(daysShifts.date),end_time: moment(daysShifts.date).add(3, 'h')}];

  // console.log(groups);

  // const newItems = [];
  const selectUser = (employee) => {
    toggleModal(null, employee);
  };

  const toggleModal = (e, employee) => {
    // console.log(employee);
    if (employee) {
      setSelectedEmployee(employee);
      setAddShiftModal(true);
    } else {
      setSelectedEmployee({});
      setAddShiftModal(false);
    }
  };

  const addItem = (item) => {
    console.log(daysShifts);
    // console.log(item);
    let temp = [...newItems];
    temp.push({
      id: newItems.length + 1,
      group: item.id,
      start_time: moment(item.shiftStart),
      end_time: moment(item.shiftEnd),
      TeamRoleId: role.id,
      DaysShiftId: daysShifts.id,
    });
    // console.log(temp);
    saveShifts(temp);
    setNewItems(temp);

    // console.log(newItems);
  };

  const removeItem = (itemId, e, time) => {
    const temp = [...itemsToRemove];
    temp.push(itemId);
    // remove it from the items array, by passing it to the hook, through itemsToRemove
    setItemsToRemove(temp);
    // pass it up a level, IF it already exists, where it will be stored to be removed from the server on save

    removeShifts(
      items.find((item) => {
        return item.id === itemId;
      })
    );
    // console.log(itemId);
    // console.log(e);
    // console.log(time);
  };
  // console.log(moment(daysShifts.date))
  return (
    <CreateRosterContainer>
      <ColumnContainer>
        {role.EmployeeRoles.map((role) => (
          <EmployeeCard employee={role} selectUser={selectUser} />
        ))}
      </ColumnContainer>
      <Timeline
        groups={groups}
        items={items}
        visibleTimeStart={moment(daysShifts.date)}
        visibleTimeEnd={moment(daysShifts.date).add(1, "d")}
        onItemClick={removeItem}
      />
      {addShiftModal ? (
        <AddShiftModal
          open={addShiftModal}
          onCancel={toggleModal}
          addShift={addItem}
          daysShifts={daysShifts}
          employee={selectedEmployee}
          role={role}
        />
      ) : null}
    </CreateRosterContainer>
  );
};

// newItems are the unsaved shifts that have just been created, items are the currently existing saved shifts.
const useCreateItems = (items, newItems, role, itemsToRemove) => {
  console.log('existing items, that have been retrieved from the db.');

  console.log(items);
  console.log('new items, that have been created on the frontend yet not yet saved.')
  console.log(newItems);
  console.log('the role');
  console.log(role);
  const [returnItems, setReturnItems] = useState([]);

  useEffect(() => {
    // console.log(items);
    const shiftItems = items
      .filter((item) => {
        return item.TeamRoleId === role.id;
      })
      .map((item, index) => {
        return {
          id: newItems.length + index + 1,
          group: item.TeamMembershipId,
          start_time: moment(item.start),
          end_time: moment(item.end),
          existingId: item.id,
        };
      });
    // console.log(itemsToRemove);
    setReturnItems(
      shiftItems.concat(newItems).filter((item) => {
        return !itemsToRemove.includes(item.id);
      })
    );
  }, [newItems, items, itemsToRemove, role]);
  // console.log(returnItems);
  return returnItems;
};

const AddShiftModal = ({
  open,
  onCancel,
  addShift,
  daysShifts,
  role,
  employee,
}) => {
  const [sending, setSending] = useState(false);
  const [submittable, setSubmittable] = useState(false);
  const [startSelected, setStartSelected] = useState(false);
  const [startTimes, setStartTimes] = useState([]);
  const [shiftEndTimes, setShiftEndTimes] = useState([]);
  const [shiftStart, setShiftStart] = useState(null);
  const [shiftEnd, setShiftEnd] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    createStartTimes();
  }, []);

  useEffect(() => {
    let shiftEnds = startTimes.filter((time) => {
      return time.isAfter(shiftStart);
    });
    setShiftEndTimes(shiftEnds);
    // console.log(shiftEnds);
  }, [shiftStart, startTimes]);

  const createStartTimes = () => {
    const dayStart = moment(daysShifts.date);
    const dates = [];
    for (let i = 0; i < 96; i++) {
      dates.push(moment(dayStart.add(15, "m")));
    }
    // console.log(dates);
    setStartTimes(dates);
  };

  const onShiftStartChange = (start) => {
    setShiftStart(start);
    // setStartSelected(!startSelected);
    // console.log(start);
  };

  const onShiftEndChange = (end) => {
    setShiftEnd(end);
  };

  const onFinish = (values) => {
    // console.log('in on finish');
    // console.log(employee);
    addShift({
      id: employee.TeamMembershipId,
      shiftStart: values.shiftStart,
      shiftEnd: values.shiftEnd,
    });
  };

  // console.log(daysShifts);

  // console.log(open);
  if (open) {
    // console.log(employee);
    // console.log(role);
    const user = employee.TeamMembership.User;
    return (
      <Modal
        title={role.title + ": " + user.firstName + " " + user.lastName}
        visible={open}
        onCancel={onCancel}
        // onOk={onFinish}
        footer={[
          <ButtonWithSpinner
            sending={sending}
            form={"shift-times"}
            innerHtml={"Add Shift"}
            submittable={shiftEnd && shiftStart}
          />,
        ]}
      >
        <Form
          form={form}
          onFinish={onFinish}
          name="shiftTimes"
          id="shift-times"
        >
          <Form.Item
            name="shiftStart"
            label="Shift Start Time"
            extra="Enter the time this shift will start"
            rules={[{ required: true }]}
          >
            <Select defaultActiveFirstOption onChange={onShiftStartChange}>
              {startTimes.map((date) => (
                <Option value={date.toString()} key={date.toString()}>
                  {date.format("HH:mm:SS")}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="shiftEnd"
            label="Shift End Time"
            extra="Enter the time this shift will finish"
            rules={[{ required: true }]}
          >
            <Select
              defaultActiveFirstOption
              onChange={onShiftEndChange}
              disabled={!shiftStart}
            >
              {shiftEndTimes.map((date) => (
                <Option value={date.toString()} key={date.toString()}>
                  {date.format("HH:mm:SS")}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  } else {
    return null;
  }
};

const EmployeeCard = ({ employee, selectUser }) => {
  const user = employee.TeamMembership.User;
  // console.log(user);

  const onSelect = () => {
    selectUser(employee);
  };
  return (
    <Card
      title={user.firstName + " " + user.lastName}
      hoverable={true}
      style={{ width: "200px" }}
      onClick={onSelect}
    />
  );
};

export default Roster;
