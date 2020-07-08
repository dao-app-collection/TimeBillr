import React, {useContext, useState} from 'react';
import apiClient from "../config/axios";
import {AuthFormContainer, FullPageContainer} from "../styled-components/styled";
import {Button, Form, Input, Space} from "antd";
import {AuthContext} from "../Context/UserAuthContext";

const LogIn = (props) => {
    const [form] = Form.useForm();
    const authContext = useContext(AuthContext);

    const onFinish = async (values) => {
        const logInResponse = await apiClient.post('user/login',{
            email: values.email, 
            password: values.password
        })
        if(logInResponse.status === 200){
            console.log(logInResponse)
            authContext.logIn(logInResponse.data);
        }
    }
    return (
    <FullPageContainer>
        <AuthFormContainer>

            <Form
                form={form}
                name={"login"}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    label={"Email"}
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not a valid Email'
                        },
                        {
                            required: true,
                            message: 'Please enter a valid Email'
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
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name={"submit"}
                >
                    <Space justify='center'>
                        <Button type="primary" htmlType="submit">
                            Log In
                        </Button>
                    </Space>
                </Form.Item>
                Or <a href="/register">Register</a>
            </Form>
        </AuthFormContainer>
    </FullPageContainer>
    )
};

export default LogIn;
