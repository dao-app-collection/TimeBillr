import React, {useContext, useState} from 'react';
import {Layout, Menu} from "antd";
import {useHistory} from 'react-router-dom';
import {HomeOutlined, LogoutOutlined} from "@ant-design/icons";
import {OrganizationContext} from "../Context/OrganizationContext";
import apiClient from '../config/axios';
import { AuthContext } from '../Context/UserAuthContext';
import { useAlert } from 'react-alert';
const ApplicationHeader = () => {
    const [activeLink, setActiveLink] = useState('home');
    const history = useHistory();
    const orgContext = useContext(OrganizationContext);
    const authContext = useContext(AuthContext);
    const alert = useAlert();

    const handleNavigationClick = e => {
        setActiveLink(e.key);
        console.log(e.key);
        history.push(`/app/${orgContext.organization.id}/${e.key}`);
    };

    const handleLogOut = async () => {
        const logOutResponse = await apiClient.post('user/logout')
        if(logOutResponse.status === 200){
            alert.show('Logged Out', {
                type: 'info'
            })
            authContext.logOut();
        }
    }
    return (

        <Layout.Header style={{backgroundColor: '#1890ff'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
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
                <Menu >
                    <Menu.Item onClick={handleLogOut} icon={<LogoutOutlined />}>
                        Logout
                    </Menu.Item>
                </Menu>
            </div>
            
        </Layout.Header>
    );
};

export default ApplicationHeader;
