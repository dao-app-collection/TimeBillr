import React, {useContext, useState} from 'react';
import apiClient from "../config/axios";
import {AuthFormContainer, FullPageContainer} from "../styled-components/styled";
import {Button, Form, Input, Space, Alert} from "antd";
import {AuthContext} from "../Context/UserAuthContext";
import { useHistory } from 'react-router-dom';

const LogIn = (props) => {
    const history = useHistory();
    const [form] = Form.useForm();
    const authContext = useContext(AuthContext);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const onFinish = async (values) => {
        try {
            const logInResponse = await apiClient.post('user/login',{
                email: values.email, 
                password: values.password
            })
            if(logInResponse.status === 200){
                
                console.log(logInResponse)
                authContext.logIn(logInResponse.data);
                history.push('/app');
            }
        } catch (error) {
            setError(true);
            setErrorMessage(error.response.data.error);
            console.log(error);
            console.log(error.response.data);
        }
        
        //  else {
        //     setError(true);
        //     console.log('there was an error')
        //     console.log(logInResponse);
        //     // setErrorMessage(await logInResponse.)
        // }
    }
    return (
    
        <>
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
                Or <a href="/app/register">Register</a>
            </Form>
            {error ? <Alert message={errorMessage} type='error'/> : null}
        </>
        
    )
};

export default LogIn;
