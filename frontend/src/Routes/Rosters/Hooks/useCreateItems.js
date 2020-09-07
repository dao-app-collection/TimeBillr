import React, {useState, useEffect} from 'react';
import moment from 'moment';
import { useOrganizationContext } from '../../../Context/OrganizationContext';

// newItems are the unsaved shifts that have just been created, items are the currently existing saved shifts.
const useCreateItems = (items, newItems, role, itemsToRemove, daysShifts, step, removeItem) => {
    const [existingShifts, setExistingShifts] = useState([]);
    const [unavailables, setUnavailables] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const orgContext = useOrganizationContext();
    // console.log('existing items, that have been retrieved from the db.');
  
    // console.log(items);
    // console.log('new items, that have been created on the frontend yet not yet saved.')
    // console.log(newItems);
    // console.log('the role');
    // console.log(role);
    const [returnItems, setReturnItems] = useState([]);

    console.log(newItems);
    console.log(itemsToRemove);
  // creates the items for the unavailables and the existing shifts fetched from the db;
    useEffect(() => {
      const shiftItems = items
        .filter((item) => {
          return item.TeamRoleId === role.id;
        })
        .map((item, index) => {
          console.log(item);
          console.log(index);
          return {
            id: index,
            deleteId: index,
            group: item.TeamMembershipId,
            DaysShiftId: item.DaysShiftId,
            TeamRoleId: item.TeamRoleId,
            start_time: moment(item.start),
            end_time: moment(item.end),
            existingId: item.id,
            canMove: true,
            onDelete: removeItem,
            canResize: true,
            itemProps: {
              style: {zIndex: '100'}
            }
          };
        });

        const thisDatesDate = moment(daysShifts.date);
        const unavailableItems = role.EmployeeRoles.map((employee, index) => {
          
          let addToIndex = 0;
          // Within here we need to know the amount of days difference between
          // When the available was created and this date that we're currently in,
          // the item also needs to have itemProps: {style:{}} wherein we will define the background color of it
          // unavailables should be filtered for step by day
          let unavailables = employee.TeamMembership.Unavailables.filter(unavailable => {
            return unavailable.day === step
          }).map(unavailable => {
            
            // the start of the day of the unavailable entry, this is whenever the unavailable was created
            // we need the difference between the start of THAT day, and the start and end time
            // so we can add the difference onto the start of THIS day.
            let day = moment(unavailable.start).startOf('day');
            let start = moment(thisDatesDate).add(moment(unavailable.start).diff(day));
            let end = moment(thisDatesDate).add(moment(unavailable.end).diff(day));
            let returnItem = {
              type: 'unavailable',
              id: shiftItems.length + addToIndex,
              deleteId: shiftItems.length + addToIndex,
              group: employee.TeamMembershipId,
              start_time: start,
              end_time: end,
              itemProps: {
                style: {background: 'red'}
              },
              onClick: () => {console.log('you clicked me!')},
            };
            addToIndex++;

            return returnItem;
          });
          return unavailables;       
        });

        const holidayItems = orgContext.organizationData.Holidays.filter(holiday => {
          
          return (thisDatesDate.isBetween(moment(holiday.start), moment(holiday.end)) && holiday.approved);
        }).map((holidayToRender, index) => {
          return {
            type: 'unavailable',
            id: shiftItems.length + unavailableItems.length + index,
            deleteId: shiftItems.length + unavailableItems.length + index,
            group: holidayToRender.TeamMembershipId,
            start_time: thisDatesDate,
            end_time: moment(thisDatesDate).endOf('day'),
            itemProps: {
              style: {
                background: 'red'
              }
            },
            onClick: () => {console.log('you clicked me!')},
          }
        });
        setHolidays(holidayItems);
        setUnavailables(unavailableItems.flat());
        setExistingShifts(shiftItems);
    }, [items, daysShifts, role, step, orgContext.organizationData.Holidays]);    
  
    useEffect(() => {
      let tempReturn = existingShifts.concat(unavailables).concat(holidays).concat(newItems);
      console.log(tempReturn);

      tempReturn = tempReturn.filter(item => {
        return !itemsToRemove.includes(item.id);
      });
      console.log(tempReturn);
      setReturnItems(tempReturn);
    }, [newItems, holidays, unavailables, existingShifts, itemsToRemove]);
    
    return returnItems;
  };
  
  export default useCreateItems;