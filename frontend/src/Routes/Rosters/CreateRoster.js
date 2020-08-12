import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import { CenteredContainer } from "../../styled-components/styled";
import { Form, Select, Button, Steps, Collapse } from "antd";
import apiClient from "../../config/axios";
import { OrganizationContext } from "../../Context/OrganizationContext";
import Modal from "antd/lib/modal/Modal";

import Roster from './Roster';
import { RosterContext, useRosterContext } from "../../Context/RosterContext";
import { useHistory } from "react-router-dom";


const { Step } = Steps;
const { Option } = Select;
const {Panel} = Collapse;
// A week start picker is shown, giving options of what sunday to start the roster on,
// You cannot create a roster for the past, but you can create rosters up to 3 months in advance. i.e 12 weeks.

const CreateRoster = () => {
    const orgContext = useContext(OrganizationContext);
    const rosterContext = useRosterContext();
    const history = useHistory();
  const [form] = Form.useForm();
  const dates = useWeekStarts(false);
  const [rosterStart, setRosterStart] = useState(null);
  const [step, setStep] = useState(0);
  const [roster, setRoster] = useState({})

  const changeStep = (current) => {
    setStep(current);
  };

  const onSelectStartDate = async (values) => {
    
    let weekStart = moment(values.weekStart);
    
    const newRoster = await apiClient.post('teams/rosters/initialize', {
        TeamId: orgContext.organizationData.id,
        weekStart: weekStart.format("YYYY-MM-DD HH:mm:SS"),
    })
    if(newRoster.status === 200){
      rosterContext.addNewRoster(newRoster.data);
      history.push(`/app/${orgContext.organizationData.id}/rosters/${newRoster.data.id}`);
        // setRoster(newRoster.data);
    }
    console.log(newRoster);
  };

  console.log(rosterContext);

  return (
    <CenteredContainer style={{ maxWidth: "800px" }}>
      <Form form={form} onFinish={onSelectStartDate}>
        <Form.Item
          name="weekStart"
          label="Week Start Date"
          extra="Enter the date this roster will start on."
          rules={[{ required: true }]}
        >
          <Select defaultActiveFirstOption>
            {dates.map((date) => (
              <Option value={date.toString()} key={date.toString()}>
                {date.toString()}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Start Roster
          </Button>
        </Form.Item>
      </Form>
    </CenteredContainer>
  );
  
  // if (!(Object.keys(roster).length === 0 && roster.constructor === Object)) {
  //   return (
  //     <CenteredContainer style={{ maxWidth: "calc(100vw - 100px)" }}>
  //       <RosterSteps step={step} onChange={changeStep} />
  //       <Roster step={step} roster={roster} />
  //       {/* <div>{rosterStart.toString()}</div> */}
  //     </CenteredContainer>
  //   );
  // } else {
  //   return (
  //     <CenteredContainer style={{ maxWidth: "800px" }}>
  //       <Form form={form} onFinish={onSelectStartDate}>
  //         <Form.Item
  //           name="weekStart"
  //           label="Week Start Date"
  //           extra="Enter the date this roster will start on."
  //           rules={[{ required: true }]}
  //         >
  //           <Select defaultActiveFirstOption>
  //             {dates.map((date) => (
  //               <Option value={date.toString()} key={date.toString()}>
  //                 {date.toString()}
  //               </Option>
  //             ))}
  //           </Select>
  //         </Form.Item>
  //         <Form.Item>
  //           <Button type="primary" htmlType="submit">
  //             Start Roster
  //           </Button>
  //         </Form.Item>
  //       </Form>
  //     </CenteredContainer>
  //   );
  // }
};







// const RosterModal = ({}) => {

//   const handleOk = () => {

//   }

//   const handleCancel = () => {

//   }
//   return (
//     <Modal
//       visible={true}
//       title='set title'
//       onOk={handleOk}
//       onCancel={handleCancel}
//       style={{width: '100vw', height: '100vh'}}
//       bodyStyle={{width: '100%', height: '100%'}}
//     >

//     </Modal>
//   )
// }

const useWeekStarts = (edit) => {
  const rosterContext = useContext(RosterContext);
  const [weekStarts, setWeekStarts] = useState([]);

  console.log(rosterContext);

  useEffect(() => {
    const today = moment();
    const weekStart = today.startOf("week");

    let startDays = [];

    for (let i = 0; i < 13; i++) {
      startDays.push(moment(weekStart.add(1, "w")));
    }

    // const filteredStartDays = startDays.filter(start => {
    //   return rosterContext.rosterData
    // })
    setWeekStarts(startDays);
  }, []);

  return weekStarts;
};

export default CreateRoster;
