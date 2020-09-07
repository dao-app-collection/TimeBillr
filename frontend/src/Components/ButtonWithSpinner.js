import React from "react";
import { Button, Spin } from "antd";

const ButtonWithSpinner = ({
  sending,
  form,
  innerHtml,
  submittable = true,
  onSubmit,
}) => {
  return (
    <>
      {sending ? (
        <Button
          form={form ? form : null}
          key="submit"
          htmlType="submit"
          disabled={!submittable}
        >
          <Spin />
        </Button>
      ) : (
        <Button
          onClick={onSubmit ? onSubmit : null}
          form={form ? form : null}
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
