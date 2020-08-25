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
  
  export const EmployeeContext = createContext({
    employeeRosters: [],
  });
  
  export const useEmployeeContext = () => useContext(EmployeeContext);
  
  const EmployeeProvider = (props) => {
    const orgContext = useContext(OrganizationContext);
    const [employeeRosters, setEmployeeRosters] = useState({});
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      apiClient
        .get(`employee/${orgContext.organizationData.id}/${orgContext.userTeamMembership.id}`)
        .then((result) => {
          setEmployeeRosters(result.data);
          setLoading(false);
          console.log(result);
        });
    }, []);
  
  
    const value = useMemo(
      () => ({
        employeeRosters,
        setEmployeeRosters,
      }),
      [employeeRosters]
    );
    if (loading) {
      return (
        <EmployeeContext.Provider value={value}>
          <Spin />
        </EmployeeContext.Provider>
      );
    } else {
      return (
        <EmployeeContext.Provider value={value}>
          {props.children}
        </EmployeeContext.Provider>
      );
    }
  };
  
  export default EmployeeProvider;