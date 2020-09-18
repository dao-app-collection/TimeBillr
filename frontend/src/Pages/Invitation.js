import React, { useEffect, useState } from "react";
import apiClient from "../config/axios";
import { useParams, useHistory } from "react-router-dom";
import {
  FullPageContainer,
  AuthFormContainer,
} from "../styled-components/styled";
import { Spin, Button } from "antd";
import { useAlert } from "react-alert";

const Invitation = () => {
  const id = useParams().id;
  const [awaiting, setAwaiting] = useState(true);
  const [data, setData] = useState({});
  const history = useHistory();
  const alert = useAlert();
  useEffect(() => {
    apiClient.get(`teams/invitation/${id}`).then((response) => {
      console.log(response);
      setData(response.data);
      setAwaiting(false);
    });
  }, [id]);

  const onAccept = async () => {
    setAwaiting(true);
    try {
      const acceptResponse = await apiClient.post(`teams/invitation/${id}`);
      if (acceptResponse.status === 200) {
        alert.show(`Success! You are now a member of ${data.teamName}`);
        setTimeout(() => {
          history.push("/app");
        }, 3000);
      }
    } catch (error) {}
  };

  const onReject = async () => {
    try {
      const rejectResponse = await apiClient.delete(`teams/invitation/${id}`);
      if (rejectResponse.status === 200) {
        alert.show("Request declined, redirecting...", {
          type: "success",
        });
        setTimeout(() => {
          history.push("/app");
        }, 3000);
      }
    } catch (error) {}
  };
  return (
    <FullPageContainer>
      <AuthFormContainer style={{ textAlign: "center" }}>
        {awaiting ? (
          <Spin />
        ) : (
          <>
            <h1>Hey! {data.email}</h1>
            <h1>You have been invited to join {data.teamName}</h1>
            <h2>A team that: {data.description}</h2>
            <div
              style={{
                display: "flex",
                direction: "row",
                justifyContent: "center",
                margin: "24px",
              }}
            >
              <Button
                type="primary"
                style={{ margin: "0px 16px" }}
                onClick={onAccept}
              >
                Accept
              </Button>
              <Button danger style={{ margin: "0px 16px" }} onReject={onReject}>
                Deny
              </Button>
            </div>
          </>
        )}
      </AuthFormContainer>
    </FullPageContainer>
  );
};

export default Invitation;
