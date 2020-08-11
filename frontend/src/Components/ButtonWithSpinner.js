import React from "react";
import { Button, Spin } from "antd";

const ButtonWithSpinner = ({
  sending,
  form,
  innerHtml,
  submittable = true,
}) => {
  console.log(sending);
  return (
    <>
      {sending ? (
        <Button
          form={form}
          key="submit"
          htmlType="submit"
          disabled={!submittable}
        >
          <Spin />
        </Button>
      ) : (
        <Button
          form={form}
          key="submit"
          htmlType="submit"
          disabled={!submittable}
        >
          {innerHtml}
        </Button>
      )}
    </>
  );
};

export default ButtonWithSpinner;
