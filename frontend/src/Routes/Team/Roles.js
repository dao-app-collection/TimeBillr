import React, {useState, useContext, useEffect} from 'react';
import {Collapse, Menu, Modal, Form, Input, Button, Descriptions} from 'antd';
import { CenteredContainer } from "../../styled-components/styled";
import { DiffOutlined } from '@ant-design/icons';
import ButtonWithSpinner from '../../Components/ButtonWithSpinner';
import apiClient from '../../config/axios';
import { useParams } from 'react-router-dom';
import { OrganizationContext } from '../../Context/OrganizationContext';
import { useAlert } from "react-alert";

const {Panel} = Collapse;

const descriptionsStyle = {
    marginBottom: '5px',
};

const Roles = () => {

    const [openModal, setOpenModal] = useState(false);
    const [form] = Form.useForm();
    const [sending, setSending] = useState(false);
    const teamId = useParams().teamId;
    const orgContext = useContext(OrganizationContext);
    const alert = useAlert();
    // const [roles, setRoles] = useState(null);

    // useEffect(() => {
    //     console.log(orgContext);
    //     let rolesComponents = null;
    //     if(orgContext.organizationData.TeamRoles){
    //     rolesComponents = orgContext.organizationData.TeamRoles.map((role) => {
    //         return (<><Role role={role} /></>)
    //     });}
    //     console.log(rolesComponents);

    //     setRoles(rolesComponents);
    // }, [orgContext])
    

    const toggleModal = () => {
        setOpenModal(!openModal);
    };

    const submitNewRole = async (values) => {
        setSending(true);
        try {
            const res = await apiClient.post('teams/roles/create', {
                TeamId:teamId,
                title: values.title,
                casualRate: values.casualRate,
                partTimeRate: values.partTimeRate,
                fullTimeRate:values.fullTimeRate,
    
            });

            if(res.status === 200){
                console.log(teamId);
                const resolve = await orgContext.getAllOrganizationData(teamId);
                setSending(false);
                setOpenModal(false);
                alert.show(res.data.success, {
                    type: 'success'
                });
            }
        } catch (error) {
            console.log(error);
            alert.show(error.response.data.message, {
                type: "error",
              });
        }
        
        console.log(values);
        console.log(form.submit());
    };

    let rolesComponents = null;
        if(orgContext.organizationData.TeamRoles){
        rolesComponents = (<Role rolesArray={orgContext.organizationData.TeamRoles}/>)
        }
    return (
        <CenteredContainer style={{width: '800px'}}>
            <Menu
                mode='horizontal'
                onClick={toggleModal}
            >
                <Menu.Item icon={<DiffOutlined />} onClick={toggleModal}>
                    Create Role
                </Menu.Item>
            </Menu>
    {/* list all team roles */}
            
                
                {rolesComponents}
                
            
            <CreateRole openModal={openModal} submitNewRole={submitNewRole} sending={sending} toggleModal={toggleModal}/>
        </CenteredContainer>
    );
};

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

const CreateRole = ({openModal, submitNewRole, form, sending, toggleModal}) => {
    console.log(sending);
    return(
        <Modal
            title='Create a new Employee Role'
            visible={openModal}
            // onOk={submitNewRole}
            // confirmLoading={!sending}
            onCancel={toggleModal}
            footer={[
                <ButtonWithSpinner sending={sending} form={'roles-form'} innerHtml={'Submit'}/>
            ]}
        >
            <Form
                name='createRole'
                form={form}
                onFinish={submitNewRole}
                {...formLayout}
                id='roles-form'
            >
                <Form.Item
                    name='title'
                    label='Role Title'
                    rules={[{
                        required:true
                    }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='casualRate'
                    label='Casual Rate'
                    rules={[{
                        required: true,
                    }]}
                >
                    <Input type='number'/>
                </Form.Item>
                <Form.Item
                    name='partTimeRate'
                    label='Part-Time Rate'
                    rules={[{
                        required: true,
                    }]}
                >
                    <Input type='number'/>
                </Form.Item>
                <Form.Item
                    name='fullTimeRate'
                    label='Full Time Rate'
                    rules={[{
                        required: true,
                    }]}
                >
                    <Input type='number'/>
                </Form.Item>
            </Form>

        </Modal>
    )
};

const ButtonStyle = {
    margin: '8px 8px',
};
const GreenButtonStyle = {
    margin: '8px 8px',
    backgroundColor: 'green',
    borderColor: 'green',
    marginLeft: 'auto',
}
const Role = ({rolesArray}) => {
    
    // The Collapse component MUST be rendered in the same component as Panel's
    // Otherwise the Panels do not render. This is an issue with antd
    // It is currently not scheduled to be fixed.
    return (
        <Collapse accordion>
            {rolesArray.map((role) => (
                <Panel header={role.title}>
                    <div style={{width: '100%', display: 'flex'}}>

                    
                    <Descriptions title='Casual' style={descriptionsStyle}>
                        <Descriptions.Item label='Hourly Rate'>{role.casualRate}</Descriptions.Item>
                    </Descriptions>
                    <Descriptions title='Part Time'>
                        <Descriptions.Item label='Hourly Rate'>{role.partTimeRate}</Descriptions.Item>
                    </Descriptions>
                    <Descriptions title='Full Time'>
                        <Descriptions.Item label='Hourly Rate'>{role.fullTimeRate}</Descriptions.Item>
                    </Descriptions>
                    </div>
                    <div style={{display:'flex'}}>
                        <Button type='primary' style={GreenButtonStyle}>
                            Edit
                        </Button>
                        <Button danger type='primary' style={ButtonStyle}>
                            Delete
                        </Button>
                        <Button type='primary' style={ButtonStyle}>
                            Add Employee
                        </Button>
                    </div>
                    <Collapse>
                        <Panel header='Employees'>
                            Hello
                        </Panel>
                    </Collapse>
                </Panel>
                
            ))}
            
        </Collapse>              
    );
};
// A modal, which will have a box where you can search your employees,
// Chose an employee, then add to the role.
const AddEmployeeToRole = () => {

};

export default Roles;