import React, { useState } from "react";
import apiClient from "../config/axios";
import { Form, Input, Button, Space, Alert } from "antd";
import { useAlert } from "react-alert";

function Register(props) {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const alert = useAlert();

  const onFinish = async (values) => {
    console.log("Received values of form:", values);
    // apiClient.defaults.withCredentials = true;
    try {
      let response = await apiClient.post("user/register", {
        email: values.email,
        password: values.password,
        name: values.name,
      });
      console.log(response);
      setSuccess(true);
      alert.show(response.data.success, {
        type: "success",
      });
      // setSuccessMessage(response.data.success);
      // setTimeout(() => {
      //     setSuccess(false);
      //     setSuccessMessage(null);
      // }, 10000)
    } catch (error) {
      alert.show(error.response.data.error, {
        type: "error",
      });
      // setError(true);
      // setErrorMessage(error.response.data.error);
      // setTimeout(() => {
      //     setError(false);
      //     setErrorMessage(null);
      // }, 10000)
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
        <Form.Item name="name" label={"Name"} required={true}>
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
      {success ? <Alert message={successMessage} type="success" /> : null}
      {error ? <Alert message={errorMessage} type="error" /> : null}
    </>
  );
}
// const Register = () => {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//
//     const handleUsernameChange = (e) => {
//         setUsername(e.target.value);
//     };
//     const handleEmailChange = (e) => {
//         setEmail(e.target.value);
//     };
//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//     }
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log({username: username, email: email, password: password});
//         console.log(axios.defaults);
//         let data = {username: username, email: email, password: password}
//         axios.defaults.withCredentials = true;
//         axios.get('http://localhost:8000/sanctum/csrf-cookie').then(res => {
//             if(res.status === 204){
//                 axios.post('http://localhost:8000/api/register',{
//                     email: email,
//                     password: password,
//                     name: username,
//                 }).then(res => {
//                     console.log(res);
//                 })
//             }
//             console.log(res);
//         })
//     };
//     return (
//         <form>
//             <input type={'text'} name={'username'} onChange={handleUsernameChange}/>
//             <input type={'text'} name={'email'} onChange={handleEmailChange}/>
//             <input type={'password'} name={'password'} onChange={handlePasswordChange}/>
//             <input type={'button'} value={'Submit'} onClick={handleSubmit}/>
//         </form>
//     );
// };

export default Register;
