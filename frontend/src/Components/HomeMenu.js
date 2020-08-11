import React, { useContext } from "react";
import { Layout, Menu } from "antd";
// import { UserAddOutlined, PartitionOutlined, TeamOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { OrganizationContext } from "../Context/OrganizationContext";

const HomeMenu = ({ param, keys }) => {
  const history = useHistory();
  const orgContext = useContext(OrganizationContext);
  const handleNavigationClick = (e) => {
    history.push(`/app/${orgContext.organizationData.id}${param}${e.key}`);
  };
  return (
    <Layout.Header style={{ width: "100%", backgroundColor: "white" }}>
      <Menu onClick={handleNavigationClick} mode="horizontal">
        {keys.map((key) => (
          <Menu.Item key={key.key} icon={key.icon}>
            {key.title}
          </Menu.Item>
        ))}
      </Menu>
    </Layout.Header>
  );
};

export default HomeMenu;
