import React, { useContext } from "react";
import { Layout, Menu } from "antd";
import { UserAddOutlined, PartitionOutlined, TeamOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import {OrganizationContext} from '../../Context/OrganizationContext';

const TeamHome = () => {
  const history = useHistory();
  const orgContext = useContext(OrganizationContext);
  const handleNavigationClick = (e) => {
    history.push(`/app/${orgContext.organization.id}/team${e.key}`);
  };
  return (
    <Layout.Header style={{ width: "100%", backgroundColor: "white" }}>
      <Menu onClick={handleNavigationClick} 
         mode='horizontal'
      >
        <Menu.Item key={'/view'} icon={<TeamOutlined />}>
          Employees
        </Menu.Item>
        <Menu.Item key="/addMember" icon={<UserAddOutlined />}>
          Add Member
        </Menu.Item>
        <Menu.Item key='/roles' icon={<PartitionOutlined />}>
          Roles
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
};

export default TeamHome;
