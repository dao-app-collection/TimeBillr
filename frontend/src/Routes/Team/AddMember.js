import React from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Divider, Radio, Button, Select } from "antd";
import { CenteredContainer } from "../../styled-components/styled";
import { Typography } from "antd";
import apiClient from "../../config/axios";

const {Option} = Select;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

const buttonLayout = {
  wrapperCol: {
    span: formLayout.wrapperCol.span,
    offset: formLayout.labelCol.span,
  },
};

const AddMember = () => {
  const teamId = useParams().teamId;
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    apiClient.post("teams/members/add", {
      TeamId: teamId,
      email: values.email,
      permissions: values.permissions,
      employmentType: values.employmentType,
    });
  };
  return (
    <CenteredContainer style={{ width: "800px" }}>
      <h1 style={{ textAlign: "center" }}>Add a Member to your team</h1>
      <h4 style={{ textAlign: "center" }}>
        An email will be sent, where they can accept your invitation
      </h4>
      <Divider />
      <Form
        {...formLayout}
        name="AddMember"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label="E-mail"
          extra="This is the additional Text"
          rules={[{ required: true, message: "Requires an E-mail" }]}
        >
          <Input />
        </Form.Item>
        <Divider />
        <Form.Item
          name="permissions"
          label="Permissions:"
          extra="What permissions the User will have within the team."
          rules={[
            {
              required: true,
              message: "Select a role",
            },
          ]}
        >
          <Radio.Group>
            <Radio value="employee">
              Member: Basic permissions, can only view rosters and change availability.
            </Radio>
            <Radio value="manager">
              Manager: Can create rosters, change shifts, add new shifts etc.
            </Radio>
            <Radio value="owner">
              Owner: Full permissions.
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Divider />
        <Form.Item {...buttonLayout}>
          <Button type="primary" htmlType="submit">
            Add Member
          </Button>
        </Form.Item>
        <Form.Item 
          name='employmentType'
          label='Employment Type'
          extra="On what basis is this employee paid?"
          rules={[
            {required: true,}
          ]}
        >
          <Select defaultValue='full-time'>
            <Option value='full-time'>Full Time</Option>
            <Option value='part-time'>Part Time</Option>
            <Option value='casual'>Casual</Option>
          </Select>
        </Form.Item>
      </Form>
    </CenteredContainer>
  );
};

export default AddMember;
