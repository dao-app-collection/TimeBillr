import React, {useContext, useState} from 'react';
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import {PlusSquareTwoTone} from '@ant-design/icons';
import Modal from "antd/es/modal";
import {BankOutlined} from '@ant-design/icons';
import {Form, Input} from "antd";
import apiClient from '../config/axios';
import {OrganizationContext} from "../Context/OrganizationContext";

const OrganizationCreate = () => {
    const context = useContext(OrganizationContext);
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const [sending, setSending] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const submitNewOrganization = () => {
        console.log(name, description);
        setSending(true);
        apiClient.post('teams/create', {
            name: name,
            description: description,
        }).then(res => {
            console.log(res);
            setSending(false);
            context.updateOrganizations().then(emptyPromise => {
                setShowModal(false);
            });
        })
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    return (
        <>
            <Tooltip title="Create New Organization">
                <Button shape="circle" onClick={toggleModal}>
                    <PlusSquareTwoTone twoToneColor="#52c41a"/>
                </Button>
            </Tooltip>
            <Modal
                title="Create a new Organization"
                visible={showModal}
                onOk={submitNewOrganization}
                confirmLoading={sending}
                onCancel={toggleModal}
            >
                <Form
                    form={form}
                    name={"Create Organization"}
                    onFinish={submitNewOrganization}
                    scrollToFirstError
                >
                    <Form.Item
                        name="name"
                        label="Organization Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a valid Email'
                            },
                        ]}
                    >
                        <Input prefix={<BankOutlined />} onChange={handleNameChange}/>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Describe what your organization does"
                        rules={[
                            {
                                required: true,
                                message: 'Please describe your organization'
                            },
                        ]}
                        hasFeedback
                    >
                        <Input onChange={handleDescriptionChange}/>
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

export default OrganizationCreate;
