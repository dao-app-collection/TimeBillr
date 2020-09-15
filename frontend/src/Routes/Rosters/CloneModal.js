import React, {useState, useEffect} from 'react';

import moment from 'moment';
import ButtonWithSpinner from '../../Components/ButtonWithSpinner';
import { Modal, Select, Form } from 'antd';
import { useRosterContext } from '../../Context/RosterContext';
import { useForm } from 'antd/lib/form/Form';
import apiClient from '../../config/axios';
import { useOrganizationContext } from '../../Context/OrganizationContext';
import { useAlert } from 'react-alert';

const {Option} = Select;

const CloneModal = ({open,
onCancel,
roster,
step}) => {
    const [sending, setSending] = useState(false);
    const [options, setOptions] = useState([]);
    const rosterContext = useRosterContext();
    const orgContext = useOrganizationContext();
    const [daysShift, setDaysShift] = useState(null);
    const [form] = useForm();
    const alert = useAlert();
    // console.log(roster);
    // console.log(step);

    const onFinish = async (values) => {
        // console.log(values);
        setSending(true);

        try {
            const response = await apiClient.post(`teams/roster/clone/day/${daysShift.id}/${values.targetDate}`,{
                TeamId: orgContext.organizationData.id
            });
            // console.log(response);
            if(response.status === 200){
                rosterContext.updateDaysShift(response.data)
                alert.show('Shifts Saved Successfully', {
                    type: "success",
                  });
                  setSending(false);
                  onCancel();
            }
        } catch (error) {
            alert.show(error.response.data.message, {
                type: "error",
              });
        }
    };

    useEffect(() => {
        // console.log(roster);
        if(roster){
            let tempDaysShift = roster.DaysShifts.find(daysshift => {return daysshift.day === step});
        console.log(tempDaysShift);
        setDaysShift(tempDaysShift);
        }
        
        let tempOptions = rosterContext.rosterData.map(roster => {
            return roster.DaysShifts.map(daysshift => {
                return {id: daysshift.id, date: moment(daysshift.date)}
            })
        }).flat();

        setOptions(tempOptions.sort((a, b) => {
            return b.date.valueOf() - a.date.valueOf();
        }))

        console.log(tempOptions);
        console.log(rosterContext.rosterData);
    }, [step, rosterContext.rosterData, roster]);

    useEffect(() => {
        // console.log(options);
    }, [options])

    if(open){
        return (
            <Modal
                title={`Copy all shifts from selected date to ${moment(daysShift.date).format('DD/MM/YY')}`}
                visible={open}
                onCancel={onCancel}
                footer={[<ButtonWithSpinner
                    sending={sending}
                    form={"clone-date"}
                    innerHtml={"Copy"}
                    submittable={true}
                  />,]}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="cloneDate"
                    id="clone-date"
                >
                    <Form.Item
                        name='targetDate'
                        label='Select the date to clone shifts from'
                        rules={[{required: true,}]}
                    >
                        <Select defaultActiveFirstOption >
                          {options.map((date, index) => (
                            <Option value={date.id} key={index + '_start'}>
                              {date.date.format("DD/MM/YY")}
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

export default CloneModal;