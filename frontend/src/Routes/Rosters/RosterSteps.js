import React from 'react';
import {Steps} from 'antd';


const {Step} = Steps;

const RosterSteps = ({ step, onChange }) => {
    return (
      <Steps type="navigation" current={step} onChange={onChange} labelPlacement='vertical' size='small'>
        <Step title="Sunday" />
        <Step title="Monday" />
        <Step title="Tuesday" />
        <Step title="Wednesday" />
        <Step title="Thursday" />
        <Step title="Friday" />
        <Step title="Saturday" />
      </Steps>
    );
  };

  export default RosterSteps;