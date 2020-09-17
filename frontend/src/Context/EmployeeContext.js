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
    markConfirmed: () => {},
  });
  
  export const useEmployeeContext = () => useContext(EmployeeContext);
  
  const EmployeeProvider = (props) => {
    const orgContext = useContext(OrganizationContext);
    const [employeeRosters, setEmployeeRosters] = useState({});
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setLoading(true);
      getAllEmployeeData().then(result => {
        setLoading(false);
      });
    }, []);

    const getAllEmployeeData = () => {
      return apiClient
        .get(`employee/${orgContext.organizationData.id}/${orgContext.userTeamMembership.id}`)
        .then((result) => {
          setEmployeeRosters(result.data);
          
          console.log(result);
        });
    };

    const markConfirmed = (shift) => {
      getAllEmployeeData();

    };
  
  
    const value = useMemo(
      () => ({
        employeeRosters,
        markConfirmed,
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