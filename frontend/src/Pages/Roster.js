import React, { useContext, useState, useEffect, useCallback } from "react";
import { OrganizationContext, useOrganizationContext } from "../Context/OrganizationContext";
import { Collapse, Card, Form, Select, Button, Switch, Spin } from "antd";

import AddShiftModal from '../Routes/Rosters/AddShiftModal';
import {
  CreateRosterContainer,
  ColumnContainer,
  CenteredContainer,
} from "../styled-components/styled";
import moment from "moment";

import RosterSteps from "../Routes/Rosters/RosterSteps";
import ButtonWithSpinner from "../Components/ButtonWithSpinner";
import Timeline, {DateHeader, TimelineMarkers, CustomMarker} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import { useRosterContext } from "../Context/RosterContext";
import Modal from "antd/lib/modal/Modal";
import useRoster from "../Routes/Rosters/Hooks/useRoster";
import useSelectedDaysShift from "../Routes/Rosters/Hooks/useSelectedDaysShift";

import styled from "styled-components";
import apiClient from "../config/axios";
import { useAlert } from "react-alert";
import { DeleteOutlined } from "@ant-design/icons";
import useCreateItemsAndGroups from "../Routes/Rosters/Hooks/useCreateItemsAndGroups";
import useCreateStartAndEnd from "../Routes/Rosters/Hooks/useCreateStartAndEnd";
import CloneModal from "../Routes/Rosters/CloneModal";
const { Panel } = Collapse;
const { Option } = Select;

const ButtonContainer = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  justify-content: center;
`;

const buttonStyles = {
  margin: '0px 4px'
}

const Roster = () => {
  const alert = useAlert();
  
  const [step, setStep] = useState(0);
  const {roster, selectedDaysShift} = useRoster(step);
  // will return the shifts of the current roster day
  // const selectedDaysShift = useSelectedDaysShift(roster, step);
  console.log(roster);
  console.log(selectedDaysShift);
  const orgContext = useContext(OrganizationContext);
  const rosterContext = useRosterContext();
  const [roles, setRoles] = useState([]);
  // an array of shifts, with the role, teammembership and daysshifts ID.
  // has the start and end time of the shift as well.
  const [shiftsToSubmit, setShiftsToSubmit] = useState([]);
  // an array of objects with a single property id, which is the id of the shift in the db.
  const [shiftsToDelete, setShiftsToDelete] = useState([]);
  const [sending, setSending] = useState(false);
  // show/hide the clone roster modal
  const [showCloneModal, setShowCloneModal] = useState(false);

  // console.log(selectedDaysShift);

  const changeStep = async (newStep) => {
    // console.log(newStep);
    // here we need to force save all of the new entries
    if (shiftsToSubmit.length > 0 || shiftsToDelete.length > 0) {
      await submitShifts();
      setStep(newStep);
    } else {
      setStep(newStep);
    }

    // console.log(step);
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
      console.warn(shiftsToSubmit);
      const shiftsWithMomentsFormatted = shiftsToSubmit.map((shift) => {
        // console.log(shift);
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
            DaysShiftId: roster.id,
          }
        );
        if (res.status === 200) {
          // console.log(res.data);
          
          rosterContext.updateDaysShift(res.data);
          alert.show('Shifts Saved Successfully', {
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
  // called each time a new shift is created on the timeline,
  // this prepares the shifts for submitting to the DB,
  const saveShifts = (newShift, shiftsToRemove) => {
    // console.log('in save shifts');
    // console.log(newShift);
    // if the shift that is being saved, has the property .existingId, it is already saved in the database.
    // check if we have already marked it for deletion, if we have, do nothing
    // if we haven't, add it to the array of id's that is to be deleted
    if(newShift.existingId){
      let tempShiftsToDeleteFromDb = shiftsToDelete;

      let alreadyMarkedForDeletion = tempShiftsToDeleteFromDb.find(shift => {
        return shift.id === newShift.existingId
      });
      // console.log(alreadyMarkedForDeletion);
      // console.log(!alreadyMarkedForDeletion);
      if(!alreadyMarkedForDeletion){
        tempShiftsToDeleteFromDb.push({id: newShift.existingId});
        setShiftsToDelete(tempShiftsToDeleteFromDb);
      }
    }
    // console.log(shiftsToRemove);
    

    
    
    let tempShiftsToSubmit = shiftsToSubmit;
    // console.warn(shiftsToRemove);
    // console.warn(tempShiftsToSubmit);

    let tempFilteredShiftsToSubmit = tempShiftsToSubmit.filter(shift => {
      return shiftsToRemove.indexOf(shift.id) === -1;
    });
    if(newShift){
      // console.log(newShift);
      tempFilteredShiftsToSubmit.push(newShift);
      setShiftsToSubmit(tempFilteredShiftsToSubmit);
    } else {
      setShiftsToSubmit(tempFilteredShiftsToSubmit);
    }
    // console.warn(tempFilteredShiftsToSubmit);

    setShiftsToSubmit(tempFilteredShiftsToSubmit);
  }

  
  // shifts is an array, it contains the id of all the shifts that have been created,
  // and potentially already exist on the DB. If a shift already exists in the DB,
  // it will have the property .existingId
  const removeShifts = (shift) => {
    let temp = shiftsToDelete;

    if(shift.existingId){
      let tempShiftsToDeleteFromDb = shiftsToDelete;

      let alreadyMarkedForDeletion = tempShiftsToDeleteFromDb.find(shift => {
        return shift.id === shift.existingId
      });
      // console.log(alreadyMarkedForDeletion);
      // console.log(!alreadyMarkedForDeletion);
      if(!alreadyMarkedForDeletion){
        tempShiftsToDeleteFromDb.push({id: shift.existingId});
        setShiftsToDelete(tempShiftsToDeleteFromDb);
      }
    }
    
    let tempShiftsToSubmit = shiftsToSubmit;
    

    let tempFilteredShiftsToSubmit = tempShiftsToSubmit.filter(tempShift => {
      return shift.id !== tempShift.id;
    });

    setShiftsToSubmit(tempFilteredShiftsToSubmit);
  };

  const toggleCloneRoster = () => {
    setShowCloneModal(!showCloneModal);
  };

  const deleteAllShifts = async () => {
    console.log(selectedDaysShift);
    try {
      const response = await apiClient.post(`teams/roster/${selectedDaysShift.id}/delete`, {
        TeamId: orgContext.organizationData.id
      });

      if (response.status === 200){
        alert.show('Shifts Deleted', {
          type: "success",
        });
      }
    } catch (error) {
      alert.show(error.response.data.message, {
        type: 'error'
      })
    }
  }

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
          <Button 
            danger
            type='ghost'
            style={buttonStyles}
            onClick={deleteAllShifts}
          >
            Delete All
          </Button>
          <Button
            type='ghost'
            style={buttonStyles}
            onClick={toggleCloneRoster}
          >Clone From Day</Button>
        </ButtonContainer>
        <RosterComplete roster={roster} step={step} />
      </CenteredContainer>
      <CloneModal open={showCloneModal} onCancel={toggleCloneRoster} roster={roster} step={step}/>
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
  const {start, end} = useCreateStartAndEnd(daysShifts);

  
  

  // console.log(start);
  // console.log(end);

  const removeItem = useCallback((item) => {
    const temp = [...itemsToRemove];
    temp.push(item.id);
    console.log(temp);
    // remove it from the items array, by passing it to the hook, through itemsToRemove
    setItemsToRemove(temp);
    // pass it up a level, IF it already exists, where it will be stored to be removed from the server on save
    removeShifts(item);
    // const toDeleteFromApi = items.find(item => item.id === itemId);
    // console.warn(itemsToRemove);
    // if(toDeleteFromApi){
    //   removeShifts(toDeleteFromApi)
    // } 
  }, [itemsToRemove, removeShifts]);

  // function removeItem (item, e, time) {

    
       
  // };

  const {items, groups} = useCreateItemsAndGroups(
    daysShifts.Shifts,
    newItems,
    role,
    itemsToRemove,
    daysShifts,
    step,
    removeItem,
    
  );

  useEffect(() => {
    // console.log('new items has changed');
    // console.log(newItems);
  }, [newItems, daysShifts]);

  // The 'groups' are the employees, they are shown on the LHS of the calendar
  // The group id is the TeamMembershipId,
  // Items that appear next to this group, use the Id of the group.
  
  // const toggleSortOrder = (checked) => {
  //   if(checked){
  //     setSortOrder('alphabetical')
  //   } else {
  //     setSortOrder('start')
  //   }
  // }
  
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
    
    // console.log(newItems);
    let temp = [...newItems];
    let newItem = {
      id: items.length,
      group: item.id,
      start_time: moment(item.shiftStart),
      end_time: moment(item.shiftEnd),
      TeamRoleId: role.id,
      DaysShiftId: daysShifts.id,
      canMove: true,
      canResize: true,
      onDelete: removeItem,
      itemProps: {
        style: {zIndex: '100'}
      }
    };

    temp.push(newItem);
    // console.log(temp);
    saveShifts(newItem, itemsToRemove);
    setNewItems(temp);

    // console.log(newItems);
  };

  

  const handleItemResize = (itemId, time, edge) => {
    console.log('in handle item resize');
    let item = items.filter(item => {
      return item.id === itemId
    })[0];



    // console.log(item);
    // removeItem(itemId);
    let newItemsToRemove = [...itemsToRemove];
    newItemsToRemove.push(itemId);
    console.log(newItemsToRemove);
    // removeShifts(item);
    // first, delete the old item.
    let newItem = Object.assign({}, item, {
      id: items.length + itemsToRemove.length,
      start_time: edge === 'left' ? moment(time) : item.start_time,
      end_time: edge === 'left' ? item.end_time : moment(time)
    });
    // console.log(newItem);
    let temp = [...newItems];
    temp.push(newItem);
    // console.log(temp);
    setNewItems(temp);
    saveShifts(newItem, newItemsToRemove);
    setItemsToRemove(newItemsToRemove);
    // addItem(newItem);
    // then, create a new item.
  }
  
  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    console.log('in handle item move');
    // console.log(newGroupOrder);
    // console.log(dragTime);
    // setItemsToRemove([]);
    // console.log(itemsToRemove);
    let item = items.filter(item => {
      return item.id === itemId
    })[0];

    console.log(groups);
    console.log(newGroupOrder);



    // console.log(item);
    // removeItem(itemId);
    // console.log(itemsToRemove);
    // console.log([...itemsToRemove]);
    let newItemsToRemove = [...itemsToRemove];
    newItemsToRemove.push(itemId);
    console.log(newItemsToRemove);
    // console.log(newItemsToRemove);
    // removeShifts(item);
    // first, delete the old item.
    console.log(newItems);
    let newItem = Object.assign({}, item, {
      id: items.length + newItemsToRemove.length,
      group: groups[newGroupOrder].id,
      start_time: moment(dragTime),
      end_time: moment(dragTime + (  item.end_time.valueOf()- item.start_time.valueOf()))
    });
    console.log(newItem);
    let temp = [...newItems];
    
    temp.push(newItem);
    console.log(temp);
    // console.log(temp);
    saveShifts(newItem, newItemsToRemove);
    setNewItems(temp);
    setItemsToRemove(newItemsToRemove);
  };

  const canvasDoubleClick = (groupId, time, e) => {
    console.log(groupId);
    console.log(time);
    console.log(e);

    console.log(newItems);
    let temp = [...newItems];
    let newItem = {
      id: items.length,
      group: groupId,
      start_time: moment(time),
      end_time: moment(time + 2 * (60 * 60 * 1000)),
      TeamRoleId: role.id,
      DaysShiftId: daysShifts.id,
      canMove: true,
      canResize: true,
      onDelete: removeItem,
      itemProps: {
        
        style: {zIndex: '100'}
      }
    };

    temp.push(newItem);
    // console.log(temp);
    saveShifts(newItem, itemsToRemove);
    setNewItems(temp);

    // console.log(newItems);
  };
  console.log(items);
  console.log(groups);
   if(!start || !end){
    return null;
  } else{
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
        itemRenderer={itemRenderer}
        onCanvasDoubleClick={canvasDoubleClick}
        // visibleTimeStart={moment(start.valueOf())}
        // visibleTimeEnd={moment(end.valueOf())}
        visibleTimeStart={moment(daysShifts.date)}
        visibleTimeEnd={moment(daysShifts.date).add(1, 'd')}
        onItemResize={handleItemResize}
        onItemMove={handleItemMove}
        // onItemClick={removeItem}
      >
        <TimelineMarkers>
          <CustomMarker date={start}>
            {({styles, date}) => {
              const customStyles = {
                ...styles,
                backgroundColor: '#c52020',
                width: '4px'
              }
              return <div style={customStyles} />
            }}
          </CustomMarker>
          <CustomMarker date={end} >
          {({styles, date}) => {
              const customStyles = {
                ...styles,
                backgroundColor: '#c52020',
                width: '4px'
              }
              return <div style={customStyles} />
            }}
          </CustomMarker>
        </TimelineMarkers>
        <DateHeader labelFormat={'HH:mm:SS'}/>
      </Timeline>
      {addShiftModal ? (
        <AddShiftModal
          open={addShiftModal}
          onCancel={toggleModal}
          addShift={addItem}
          daysShifts={daysShifts}
          employee={selectedEmployee}
          role={role}
          start={start}
          end={end}
        />
      ) : null}
    </CreateRosterContainer>
  );}
};





const itemRenderer = ({item,
  itemContext,
  getItemProps,
  getResizeProps}) => {
    // console.log(item);
    // console.log(itemContext);
    // console.log(getItemProps());
    // console.log(getResizeProps());

    
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();

    return (
    <div {...getItemProps(item.itemProps)}>
      {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}

      <div
        className="rct-item-content"
        style={{ maxHeight: `${itemContext.dimensions.height}` }}
      >
        {itemContext.title}
      </div>
      

      {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
      {itemContext.selected && item.type !== 'unavailable' ? <div style={{position: 'absolute', top: '0', right: '0', maxHeight: `${itemContext.dimensions.height}`, zIndex: '101'}}><DeleteOutlined onClick={() => {item.onDelete(item)}}/> </div>: null}
    </div>
  )
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
      style={{ width: "200px", margin: '0 4px 8px 0' }}
      onClick={onSelect}
      
    />
  );
};

export default Roster;
