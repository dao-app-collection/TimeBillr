import React, {useState, useEffect} from 'react';
import moment from 'moment';
import { useOrganizationContext } from '../../../Context/OrganizationContext';

// newItems are the unsaved shifts that have just been created, items are the currently existing saved shifts.
const useCreateItemsAndGroups = (items, newItems, role, itemsToRemove, daysShifts, step, removeItem) => {
    const [groups, setGroups] = useState();
    const [existingShifts, setExistingShifts] = useState([]);
    const [unavailables, setUnavailables] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const orgContext = useOrganizationContext();
    
    const [returnItems, setReturnItems] = useState([]);

    console.log(newItems);
    console.log(itemsToRemove);
  // creates the items for the unavailables and the existing shifts fetched from the db;
    useEffect(() => {
      console.log(daysShifts);
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
        let unavailableItems = [];
        role.EmployeeRoles.forEach((employeeRole, index) => {
          let unavailableShift = employeeRole.TeamMembership.Unavailables.find(unavailable => {
            return unavailable.day === step
          });
          
          if(unavailableShift){
            let day = moment(unavailableShift.start).startOf('day');
            let start = moment(thisDatesDate).add(moment(unavailableShift.start).diff(day));
            let end = moment(thisDatesDate).add(moment(unavailableShift.end).diff(day));
            unavailableItems.push({
              type: 'unavailable',
              id: shiftItems.length + unavailableItems.length,
              deleteId: shiftItems.length + unavailableItems.length,
              group: unavailableShift.TeamMembershipId,
              start_time: start,
              end_time: end,
              itemProps: {
                style: {background: 'red'}
              },
              onClick: () => {console.log('you clicked me!')},
            })
          }
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

        const tempGroups = role.EmployeeRoles.map((employee) => {
          return {
            id: employee.TeamMembershipId,
            title:
              employee.TeamMembership.User.firstName +
              " " +
              employee.TeamMembership.User.lastName,
          };
        });
        setGroups(tempGroups);
        setHolidays(holidayItems);
        setUnavailables(unavailableItems.flat());
        setExistingShifts(shiftItems);
    }, [items, daysShifts, role, step, orgContext.organizationData.Holidays, removeItem]);    
  
    useEffect(() => {
      let tempReturn = existingShifts.concat(unavailables).concat(holidays).concat(newItems);
      console.log(tempReturn);

      tempReturn = tempReturn.filter(item => {
        return !itemsToRemove.includes(item.id);
      });
      console.log(tempReturn);
      setReturnItems(tempReturn);
    }, [newItems, holidays, unavailables, existingShifts, itemsToRemove]);
    
    // creates the order of the group, can either be ordered by shift start, or by alphetical order of names
    useEffect(() => {

      
        let sortedItems = returnItems.sort((a, b) => {return a.start_time.valueOf() - b.start_time.valueOf()});

        let sortedShiftItems = sortedItems.filter(item => {return !item.type});

        let sortedUnavailableItems = sortedItems.filter(item => {return item.type});

        console.log(sortedShiftItems);
        

        let sortedStartOfGroups = sortedShiftItems.map(shiftItem => {
            let employee = role.EmployeeRoles.find(role => {
                
                return role.TeamMembershipId === shiftItem.group;
            });
            if(employee){
              let firstName = employee.TeamMembership.User.firstName;
            let lastName = employee.TeamMembership.User.lastName;
            return {
                id: shiftItem.group,
                title: firstName + ' ' + lastName,
            };
            } else {
              return null;
            }
            
        }).filter(checkNullGroup => {return checkNullGroup });

        let sortedUnavailableGroups = sortedUnavailableItems.map(shiftItem => {
          let employee = role.EmployeeRoles.find(role => {
              
              return role.TeamMembershipId === shiftItem.group;
          });
          if(employee){
            let firstName = employee.TeamMembership.User.firstName;
          let lastName = employee.TeamMembership.User.lastName;
          return {
              id: shiftItem.group,
              title: firstName + ' ' + lastName,
          };
          } else {
            return null;
          }
          
      }).filter(checkNullGroup => {return checkNullGroup });
        
        let remainingGroups = role.EmployeeRoles.map(role => {
            let groupAlreadyExistsFromShifts = sortedStartOfGroups.filter(group => {
                
                return role.TeamMembershipId === group.id;
            });

          //   let groupAlreadyExistsFromUnavailables = sortedUnavailableGroups.filter(group => {
                
          //     return role.TeamMembershipId === group.id;
          // }); 
            
            if(groupAlreadyExistsFromShifts.length === 0){
                let firstName = role.TeamMembership.User.firstName;
                let lastName = role.TeamMembership.User.lastName;
                return {
                    id: role.TeamMembershipId,
                    title: firstName + ' ' + lastName,
                }
            } else {
                return null;
            }
        }).filter(checkNullGroup => {return checkNullGroup });
        let groupItems = sortedStartOfGroups.concat(remainingGroups);

        setGroups(groupItems.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i));
      
      
        
    }, [ returnItems, role.EmployeeRoles]);
    console.log(returnItems);
    return {items: returnItems, groups};
  };
  
  export default useCreateItemsAndGroups;