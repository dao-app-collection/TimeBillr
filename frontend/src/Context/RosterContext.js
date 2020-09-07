import React, {
  useState,
  createContext,
  useMemo,
  useEffect,
  useContext,
} from "react";
import apiClient from "../config/axios";
import { OrganizationContext } from "./OrganizationContext";
import { Spin } from "antd";

export const RosterContext = createContext({
  rosterData: [],
});

export const useRosterContext = () => useContext(RosterContext);

const RosterProvider = (props) => {
  const orgContext = useContext(OrganizationContext);
  const [rosterData, setRosterData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`teams/rosters/${orgContext.organizationData.id}`)
      .then((result) => {
        setRosterData(result.data);
        setLoading(false);
        console.log(result);
      });
  }, []);

  const addNewRoster = (roster) => {
    console.log("-------adding new roster----");
    console.log(roster);
    const rosterCopy = [...rosterData];
    rosterCopy.push(roster);

    setRosterData(rosterCopy);
  };

  const updateDaysShift = (DaysShifts) => {
    console.log(rosterData);
    console.log(DaysShifts);
    let rosterDataIndex = 0;
    let Roster = rosterData.filter((roster, index) => {
      if(roster.id === DaysShifts.RosterId){
        rosterDataIndex = index;
      }
      return roster.id === DaysShifts.RosterId;
    })[0];
    let daysshiftsindex = 0;
    let ExistingDaysShifts = Roster.DaysShifts.filter((daysshifts, index) => {
      if(daysshifts.day === DaysShifts.day){
        daysshiftsindex = index;
      }
      return daysshifts.day === DaysShifts.day
    })[0];

    let tempRosters = rosterData;

    tempRosters[rosterDataIndex].DaysShifts[daysshiftsindex] = DaysShifts;

    console.log(tempRosters);
    setRosterData(tempRosters);

    console.log(Roster);
  }

  const value = useMemo(
    () => ({
      rosterData,
      setRosterData,
      addNewRoster,
      updateDaysShift,
    }),
    [rosterData]
  );
  if (loading) {
    return (
      <RosterContext.Provider value={value}>
        <Spin />
      </RosterContext.Provider>
    );
  } else {
    return (
      <RosterContext.Provider value={value}>
        {props.children}
      </RosterContext.Provider>
    );
  }
};

export default RosterProvider;
