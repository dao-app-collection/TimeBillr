import React, {
  useState,
  createContext,
  useMemo,
  useEffect,
  useContext,
} from "react";
import apiClient from "../config/axios";
import { OrganizationContext } from "./OrganizationContext";

export const RosterContext = createContext({
  rosterData: [],
});

export const useRosterContext = () => useContext(RosterContext);

const RosterProvider = (props) => {
  const orgContext = useContext(OrganizationContext);
  const [rosterData, setRosterData] = useState({});

  useEffect(() => {
    apiClient
      .get(`teams/rosters/${orgContext.organizationData.id}`)
      .then((result) => {
        setRosterData(result.data);
        console.log(result);
      });
  }, []);

  const addNewRoster = (roster) => {
    console.log('-------adding new roster----');
    console.log(roster);
    const rosterCopy = [...rosterData];
    rosterCopy.push(roster);

    setRosterData(rosterCopy);
  }

  const value = useMemo(
    () => ({
      rosterData,
      setRosterData,
      addNewRoster,
    }),
    [rosterData]
  );

  return (
    <RosterContext.Provider value={value}>
      {props.children}
    </RosterContext.Provider>
  );
};

export default RosterProvider;
