import React, {useContext, useState} from 'react';
import {Layout, Menu} from "antd";
import {useHistory} from 'react-router-dom';
import {HomeOutlined} from "@ant-design/icons";
import {OrganizationContext} from "../Context/OrganizationContext";
const ApplicationHeader = () => {
    const [activeLink, setActiveLink] = useState('home');
    const history = useHistory();
    const orgContext = useContext(OrganizationContext);

    const handleNavigationClick = e => {
        setActiveLink(e.key);
        console.log(e.key);
        history.push(`/app/${orgContext.organization.id}/${e.key}`);
    }
    return (

        <Layout.Header style={{backgroundColor: '#1890ff'}}>
            <Menu onClick={handleNavigationClick} selectedKeys={[activeLink]} mode={'horizontal'} style={{width: '100%'}}>
                <Menu.Item key="home" icon={<HomeOutlined />}>

                </Menu.Item>
                <Menu.Item key="time">
                    Time
                </Menu.Item>
                <Menu.Item key="projects">
                    Projects
                </Menu.Item>
                <Menu.Item key="team">
                    Team
                </Menu.Item>
                <Menu.Item key="reports">
                    Reports
                </Menu.Item>
                <Menu.Item key="invoices">
                    Invoices
                </Menu.Item>

            </Menu>
        </Layout.Header>
    );
};

export default ApplicationHeader;
