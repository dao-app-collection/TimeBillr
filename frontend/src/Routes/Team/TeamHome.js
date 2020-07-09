import React from 'react';
import { Layout, Menu } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const TeamHome = () => {
    const history = useHistory();
    const handleNavigationClick = e => {
        history.push(`team/${e.key}`)
    }
    return (
        <Layout.Header style={{width: '100%', backgroundColor: 'white'}}>
            <Menu onClick={handleNavigationClick}>
                <Menu.Item key='addMember' icon={<UserAddOutlined />}>
                    Add Member
                </Menu.Item>
            </Menu>

        </Layout.Header>
    );
};

export default TeamHome;