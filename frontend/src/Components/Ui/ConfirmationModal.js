import React, { useState } from "react";
import { Modal, Form, Input } from "antd";
import ButtonWithSpinner from "./ButtonWithSpinner";

const ConfirmationModal = ({ onConfirm, open, toggle }) => {
  const [form] = Form.useForm();
  const [sending, setSending] = useState(false);

  const checkConfirm = async (values) => {
    setSending(true);
    console.log(values.confirm);
    console.log(
      values.confirm.localeCompare("Confirm", undefined, {
        sensitivity: "accent",
      }) === 0
        ? true
        : values.confirm === "Confirm"
    );
    if (
      values.confirm.localeCompare("Confirm", undefined, {
        sensitivity: "accent",
      }) === 0
        ? true
        : values.confirm === "Confirm"
    ) {
      onConfirm().then((resolve) => {
        setSending(false);
      });
    }
    // setTimeout(() => {
    //     setSending(false);
    // }, 1500)
  };
  return (
    <Modal
      title="Are you absolutely sure?"
      visible={open}
      onCancel={toggle}
      footer={[
        <ButtonWithSpinner
          sending={sending}
          form={"confirm-submit"}
          innerHtml={"Submit"}
        />,
      ]}
    >
      <Form
        name="confirm-submit"
        label="Confirm Submit"
        onFinish={checkConfirm}
        id="confirm-submit"
        form={form}
      >
        <Form.Item
          name="confirm"
          label={"Enter 'Confirm'"}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfirmationModal;
