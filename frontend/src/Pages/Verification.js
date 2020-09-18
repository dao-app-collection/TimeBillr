import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import apiClient from "../config/axios";

import { Form, Input, Space, Button } from "antd";

const Verification = () => {
  const history = useHistory();
  const params = useParams();
  const [form] = Form.useForm();
  const [verified, setVerified] = useState(false);

  useEffect(() => {}, []);

  const submit = async (values) => {
    let verificationResponse = await apiClient.post("user/emailVerification", {
      id: params.id,
      email: values.email,
    });
    if (verificationResponse.status === 200) {
      setVerified(true);
    }
  };

  const redirectToLogin = () => {
    history.push("/app/login");
  };
  if (!verified) {
    return (
      <Form
        form={form}
        name={"Verify Email"}
        onFinish={submit}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label={"Enter Your Email"}
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
        <Form.Item name={"submit"}>
          <Space justify="center">
            <Button type="primary" htmlType="submit">
              Verify Email
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  } else {
    return (
      <Button type="primary" htmlType="submit" onClick={redirectToLogin}>
        Log In!
      </Button>
    );
  }
};

export default Verification;
