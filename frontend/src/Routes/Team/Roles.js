import React, {useState, useContext, useEffect} from 'react';
import {Collapse, Menu, Modal, Form, Input, Button, Descriptions, AutoComplete, List} from 'antd';
import { CenteredContainer } from "../../styled-components/styled";
import { DiffOutlined } from '@ant-design/icons';
import ButtonWithSpinner from '../../Components/ButtonWithSpinner';
import apiClient from '../../config/axios';
import { useParams } from 'react-router-dom';
import { OrganizationContext } from '../../Context/OrganizationContext';
import { useAlert } from "react-alert";
import ConfirmationModal from '../../Components/ConfirmationModal';

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
                
            
            <CreateOrEditRole openModal={openModal} submit={submitNewRole} sending={sending} toggleModal={toggleModal}/>
        </CenteredContainer>
    );
};

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

const CreateOrEditRole = ({openModal, submit, form, sending, toggleModal, role = null}) => {
    console.log(sending);
    console.log(role);
    return(
        <Modal
            title='Create a new Employee Role'
            visible={openModal}
            // onOk={submit}
            // confirmLoading={!sending}
            onCancel={toggleModal}
            footer={[
                <ButtonWithSpinner sending={sending} form={'roles-form'} innerHtml={'Submit'}/>
            ]}
            key={role ? role.id : 1}
        >
            <Form
                name='createRole'
                form={form}
                onFinish={submit}
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
                    <Input defaultValue={role ? role.title : null}/>
                </Form.Item>
                <Form.Item
                    name='casualRate'
                    label='Casual Rate'
                    rules={[{
                        required: true,
                    }]}
                >
                    <Input type='number' defaultValue={role ? role.casualRate : null}/>
                </Form.Item>
                <Form.Item
                    name='partTimeRate'
                    label='Part-Time Rate'
                    rules={[{
                        required: true,
                    }]}
                >
                    <Input type='number' defaultValue={role ? role.partTimeRate : null}/>
                </Form.Item>
                <Form.Item
                    name='fullTimeRate'
                    label='Full Time Rate'
                    rules={[{
                        required: true,
                    }]}
                >
                    <Input type='number' defaultValue={role ? role.fullTimeRate : null}/>
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
    const teamId = useParams().teamId;
    const orgContext = useContext(OrganizationContext);
    const alert = useAlert();

    const [openModal, setOpenModal] = useState(false);
    const [roleForApi, setRoleForApi] = useState({});
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);


    const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
    const [editRoleData, setEditRoleData] = useState({});
    const [sending, setSending] = useState(false);
    const [form] = Form.useForm();

    const toggleModal = (e, role) => {
        if(role){
            setRoleForApi(role);
            setOpenModal(!openModal);
        } else {
            setRoleForApi({});
            setOpenModal(false);
        }
    };

    const editRoleSubmit = async (values) => {

        console.log(values);
        console.log(teamId);
        console.log(editRoleData);
        try {
            const res = await apiClient.put('teams/roles/edit', {
                TeamRoleId: editRoleData.id,
                TeamId: teamId,
                title: values.title,
                casualRate: values.casualRate,
                partTimeRate: values.partTimeRate,
                fullTimeRate:values.fullTimeRate,
            });
            console.log(res);
            if(res.status === 200){
                alert.show(res.data.success, {
                    type: 'success',
                })
                orgContext.getAllOrganizationData(teamId);
            }
        } catch (error) {
            alert.show(error.response.data.message, {
                type: 'error'
            })
        }
    }

    const toggleEditModal = (e, role) => {
        console.log('In Toggle Edit Modal');
        console.log(role);
        
        if(role){
            setEditRoleData(role);
            console.log(editRoleData);
            setEditRoleModalOpen(true)
        } else {
            setEditRoleData({});
            setEditRoleModalOpen(false);
        }
        
        
    };

    const toggleConfirmationModal = (e, role) => {
        if(role){
            setEditRoleData(role);
            console.log(editRoleData);
            setOpenConfirmationModal(true)
        } else {
            setEditRoleData({});
            setOpenConfirmationModal(false);
        }
    };

    const onConfirmDelete = async () => {
        console.log(teamId);
        console.log(editRoleData.id);
        try {
            const res = await apiClient.delete('teams/roles', {
                data: {
                TeamRoleId: editRoleData.id,
                TeamId: teamId,
                }
            });
            console.log(res);
            if(res.status === 200){
                alert.show(res.data.success, {
                    type: 'success',
                });
                toggleConfirmationModal();
                 return orgContext.getAllOrganizationData(teamId);

            }
        } catch (error) {
            alert.show(error.response.data.message, {
                type: 'error'
            })
            return new Promise().reject('Error deleting Role');
        }
        console.log('call to delete the role')
    }
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
                        <Button type='primary' style={GreenButtonStyle} onClick={(e) => {toggleEditModal(e, role)}}>
                            Edit
                        </Button>
                        <Button danger type='primary' style={ButtonStyle} onClick={e => {toggleConfirmationModal(e,role)}}>
                            Delete
                        </Button>
                        <Button type='primary' style={ButtonStyle} onClick={(e)=>{toggleModal( e, role)}}>
                            Add Employee
                        </Button>
                    </div>
                    <Collapse>
                        <Panel header='Employees'>
                            <List
                                dataSource={role.EmployeeRoles}
                                renderItem={item => (
                                    <List.Item
                                        
                                    >
                                        <List.Item.Meta 
                                        title={item.TeamMembership.User.firstName + ' ' + item.TeamMembership.User.lastName}
                                        />
                                        <Button type='primary' danger >
                                            Remove Employee From Role
                                        </Button>
                                    </List.Item>
                                )}
                            >

                            </List>
                        {/* {role.EmployeeRoles.map((employeeRole) => (
                            
                            <Panel header={employeeRole.TeamMembership.User.firstName + ' ' + employeeRole.TeamMembership.User.lastName}>
                                <Button danger type='primary'>Delete</Button>
                                <Descriptions title='some title'>
                                    <Descriptions.Item label='remove'>
                                        remove
                                    </Descriptions.Item>
                                </Descriptions>
                            </Panel>
                        ))} */}
                        </Panel>
                        
                    </Collapse>
                </Panel>
                
            ))}
            <AddEmployeeToRole open={openModal} role={roleForApi} close={toggleModal}/>
            <CreateOrEditRole 
                openModal={editRoleModalOpen}
                sending={sending}
                form={form}
                submit={editRoleSubmit}
                toggleModal={toggleEditModal}
                role={editRoleData}
            />
            <ConfirmationModal onConfirm={onConfirmDelete} open={openConfirmationModal} toggle={toggleConfirmationModal} />
        </Collapse>              
    );
};
// A modal, which will have a box where you can search your employees,
// Chose an employee, then add to the role.
const AddEmployeeToRole = ({open, role, close}) => {
    const orgContext = useContext(OrganizationContext);
    const teamId = useParams().teamId;
    const alert = useAlert();
    const [sending, setSending] = useState(false);
    const [form] = Form.useForm();
    const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);

    useEffect(() => {
        createOptions();
    }, [role]);

    const submit = async (values) => {
        const user = autoCompleteOptions.filter(employee => {return employee.value === values.name})[0];
        console.log(user);
        setSending(true);
        console.log(teamId);
        try {
            const res = await apiClient.post('teams/roles/addUser', {
                roleTitle: role.title,
                name: user.name,
                TeamId: teamId,
                TeamRoleId: role.id,
                TeamMembershipId: user.TeamMembershipId
            });
            console.log(res);
            // const res = await apiClient.post('teams/roles/addUser');
            if(res.status === 200){
                orgContext.getAllOrganizationData(teamId);
                alert.show(res.data.success,{
                    type: 'success'
                })
            }
        } catch (error) {
            alert.show(error.response.data.message, {
                type: "error",
              });
        }
        setTimeout(() => {
            setSending(false);
            close();
        }, 500)
    };

    // Creates the options array for the Auto Complete feature.
    const createOptions = () => {
        // Will hold the options to be passed to auto complete
        let options = [];
        // Map through all employees, find all employees that aren't already part of the current role
        let candidatesArray = orgContext.organizationData.TeamMemberships.filter(membership => {
            return (membership.EmployeeRoles.filter((employeeRoles) => {
                console.log(employeeRoles.TeamRoleId);
                console.log(employeeRoles.TeamRoleId !== role.id)
                return(employeeRoles.TeamRoleId === role.id)
            })).length === 0;
        });
        // Set the options objects array with only the relevant information about the employee
        options = candidatesArray.map(candidate => {
            return {
                        value: candidate.User.firstName + ' ' + candidate.User.lastName,
                        TeamMembershipId: candidate.id,
                    }
        });
        console.log(role.id);
        console.log(options);
        setAutoCompleteOptions(options);
    };
    return (
        <Modal
            title={`${role.title}`}
            visible={open}
            // onOk={submit}
            // confirmLoading={!sending}
            onCancel={close}
            footer={[
                <ButtonWithSpinner sending={sending} form={'employee-add-role'} innerHtml={'Submit'}/>
            ]}
            
        >
            <Form
                name='createRole'
                form={form}
                onFinish={submit}
                {...formLayout}
                id='employee-add-role'
            >
                <Form.Item
                    name='name'
                    label='Employee Name'
                    rules={[{
                        required:true
                    }]}
                >
                    <AutoComplete
                        options={autoCompleteOptions}
                        placeholder='Search Employee'
                        filterOption={(inputValue, option) => 
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    />
                </Form.Item>
            </Form>

        </Modal>
    )
};

export default Roles;