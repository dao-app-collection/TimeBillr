import React, { useContext, useEffect, useState } from "react";
import { Collapse, List, Button, Modal, Form, Radio, Select, Input } from "antd";

import { CenteredContainer } from "../../styled-components/styled";
import ButtonWithSpinner from "../../Components/ButtonWithSpinner";
import { OrganizationContext } from "../../Context/OrganizationContext";
import apiClient from "../../config/axios";
import { useParams } from "react-router-dom";

const { Panel } = Collapse;
const { Option } = Select;
const Employees = () => {
  const orgContext = useContext(OrganizationContext);
  const teamId = useParams().teamId;
  const [owner, setOwner] = useState([]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [activeEmployee, setActiveEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    console.log(orgContext.organizationData);
    if (orgContext.organizationData.TeamMemberships) {
      setOwner(
        orgContext.organizationData.TeamMemberships.filter((member) => {
          return member.permissions === "owner";
        })
      );
      setManagers(
        orgContext.organizationData.TeamMemberships.filter((member) => {
          return member.permissions === "manager";
        })
      );
      setEmployees(
        orgContext.organizationData.TeamMemberships.filter((member) => {
          return member.permissions === "employee";
        })
      );
    }
  }, [orgContext.organizationData.TeamMemberships]);

  const renderEmployeeList = (array) => {
    return (
      <List
        dataSource={array}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.User.firstName + " " + item.User.lastName}
              description={item.employmentType}
            />
            <Button
              type="primary"
              danger
              style={{ backgroundColor: "green" }}
              onClick={(e) => {
                ToggleModal(e, item);
              }}
            >
              Edit Employee
            </Button>
          </List.Item>
        )}
      ></List>
    );
  };

  const ToggleModal = (e, employee) => {
    if (employee) {
      setActiveEmployee(employee);
      setEditEmployee(true);
    } else {
      setEditEmployee(false);
      setActiveEmployee(null);
    }

    console.log(employee);
  };

  const handleEditSubmit = async (employee, values) => {
    console.log(values);
    setSending(true);
    try {
      const res = await apiClient.put("teams/members/edit", {
        TeamId: teamId,
        employee,
        values,
      });
      if (res.status === 200) {
        orgContext.getAllOrganizationData(teamId);
        alert.show(res.data.success, {
          type: "success",
        });
        setSending(false);
        ToggleModal();
      }
    } catch (error) {
      console.log(error);
      // alert.show(error.response.data.message, {
      //     type: "error",
      //   });
      setSending(false);
      ToggleModal();
    }
  };

  console.log(orgContext.organizationData);
  console.log(owner);
  console.log(managers);
  console.log(employees);
  return (
    <>
      <CenteredContainer style={{ maxWidth: "800px" }}>
        <Collapse accordian>
          <Panel header="Employees">{renderEmployeeList(employees)}</Panel>
          <Panel header="Managers">{renderEmployeeList(managers)}</Panel>
          <Panel header="Owners">{renderEmployeeList(owner)}</Panel>
        </Collapse>
      </CenteredContainer>
      <EditEmployeeModal
        onSubmit={handleEditSubmit}
        employee={activeEmployee}
        open={editEmployee}
        toggle={ToggleModal}
      />
    </>
  );
};

const EditEmployeeModal = ({
  onSubmit,
  employee,
  open,
  toggle,
  form,
  sending,
}) => {
  console.log(employee);

  const [submittable, setSubmittable] = useState(false);

  const handleSubmit = (values) => {
    onSubmit(employee, values);
    console.log(employee);
    console.log(values);
  };

  const checkSubmittable = (values) => {
    setSubmittable(true);
  };

  if (open) {
    return (
      <Modal
        title={`Edit Employee ${employee.User.firstName} ${employee.User.lastName}`}
        visible={open}
        // onOk={submit}
        // confirmLoading={!sending}
        onCancel={toggle}
        footer={[
          <ButtonWithSpinner
            sending={sending}
            form={"edit-employee"}
            innerHtml={"Submit"}
            submittable={submittable}
          />,
        ]}
      >
        <Form
          name="createRole"
          form={form}
          onFinish={handleSubmit}
          onValuesChange={checkSubmittable}
          // {...formLayout}
          id="edit-employee"
        >
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
            <Select defaultValue={employee.permissions}>
              <Option value="employee">Employee</Option>
              <Option value="manager">Manager</Option>
              <Option value="Owner">Owner</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="employmentType"
            label="Employment Type"
            extra="On what basis is this employee paid?"
            rules={[{ required: true }]}
          >
            <Select defaultValue="full-time">
              <Option value="full-time">Full Time</Option>
              <Option value="part-time">Part Time</Option>
              <Option value="casual">Casual</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='minimumHours'
            label='Required Hours / Week'
            extra={`How many hours has this employee agreed to work? We will track and let you know if this isn't met`}
            rules={[{required: false}]}
            
          >
            <Input type={'number'} defaultValue={employee.minimumHours} />             

            
          </Form.Item>
        </Form>
      </Modal>
    );
  } else {
    return null;
  }
};

export default Employees;
