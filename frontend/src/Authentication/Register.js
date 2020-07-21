import React, { useState } from "react";
import apiClient from "../config/axios";
import { Form, Input, Button, Space, Alert } from "antd";
import { useAlert } from "react-alert";

function Register(props) {
  const [form] = Form.useForm();
  const alert = useAlert();

  const onFinish = async (values) => {
    try {
      let response = await apiClient.post("user/register", {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      
      alert.show(response.data.success, {
        type: "success",
      });
      
    } catch (error) {
      console.log(error.response)
      alert.show(error.response.data.message, {
        type: "error",
      });
      
    }
  };
  return (
    <>
      <Form
        form={form}
        name={"register"}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item name="firstName" label={"First Name"} required={true}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label={"Last Name"} required={true}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label={"Email"}
          rules={[
            {
              type: "email",
              message: "The input is not a valid Email",
            },
            {
              required: true,
              message: "Please enter a valid Email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "The two passwords that you entered do not match!"
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Space justify="center">
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Space>
        </Form.Item>
        Already registered? <a href="/app/login">Log in!</a>
      </Form>
      
    </>
  );
};

export default Register;
