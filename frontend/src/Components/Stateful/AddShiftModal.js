import React, {useState, useEffect} from 'react';

import moment from 'moment';
import ButtonWithSpinner from '../Ui/ButtonWithSpinner';
import { Modal, Select, Form } from 'antd';

const {Option} = Select;

const AddShiftModal = ({
    open,
    onCancel,
    addShift,
    daysShifts,
    role,
    employee,
    start,
    end
  }) => {
    const [sending, setSending] = useState(false);
    const [submittable, setSubmittable] = useState(false);
    const [startSelected, setStartSelected] = useState(false);
    const [startTimes, setStartTimes] = useState([]);
    const [shiftEndTimes, setShiftEndTimes] = useState([]);
    const [shiftStart, setShiftStart] = useState(null);
    const [shiftEnd, setShiftEnd] = useState(null);
    const [form] = Form.useForm();
  
    useEffect(() => {
      createStartTimes();
    }, []);
  
    useEffect(() => {
      let shiftEnds = startTimes.filter((time) => {
        return time.isAfter(shiftStart);
      });
      setShiftEndTimes(shiftEnds);
      // console.log(shiftEnds);
    }, [shiftStart, startTimes]);
  
    const createStartTimes = () => {
      const dayStart = moment(daysShifts.date);
      let count = 96;
      const dates = [];
      for (let i = 0; i < count; i++) {
        dates.push(moment(dayStart.add(15, "m")));
      }
      // console.log(dates);
      setStartTimes(dates);
    };
  
    const onShiftStartChange = (start) => {
      setShiftStart(start);
      // setStartSelected(!startSelected);
      // console.log(start);
    };
  
    const onShiftEndChange = (end) => {
      setShiftEnd(end);
    };
  
    const onFinish = (values) => {
      // console.log('in on finish');
      // console.log(employee);
      addShift({
        id: employee.TeamMembershipId,
        shiftStart: values.shiftStart,
        shiftEnd: values.shiftEnd,
      });
    };
  
    // console.log(daysShifts);
  
    // console.log(open);
    if (open) {
      // console.log(employee);
      // console.log(role);
      const user = employee.TeamMembership.User;
      return (
        <Modal
          title={role.title + ": " + user.firstName + " " + user.lastName}
          visible={open}
          onCancel={onCancel}
          // onOk={onFinish}
          footer={[
            <ButtonWithSpinner
              sending={sending}
              form={"shift-times"}
              innerHtml={"Add Shift"}
              submittable={shiftEnd && shiftStart}
            />,
          ]}
        >
          <Form
            form={form}
            onFinish={onFinish}
            name="shiftTimes"
            id="shift-times"
          >
            <Form.Item
              name="shiftStart"
              label="Shift Start Time"
              extra="Enter the time this shift will start"
              rules={[{ required: true }]}
            >
              <Select defaultActiveFirstOption onChange={onShiftStartChange}>
                {startTimes.map((date, index) => (
                  <Option value={date.toString()} key={index + '_start'}>
                    {date.format("HH:mm:SS")}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="shiftEnd"
              label="Shift End Time"
              extra="Enter the time this shift will finish"
              rules={[{ required: true }]}
            >
              <Select
                defaultActiveFirstOption
                onChange={onShiftEndChange}
                disabled={!shiftStart}
              >
                {shiftEndTimes.map((date, index ) => (
                  <Option value={date.toString()} key={index + '_end'}>
                    {date.format("HH:mm:SS")}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      );
    } else {
      return null;
    }
  };

  export default AddShiftModal;