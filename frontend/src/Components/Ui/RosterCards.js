import { Card } from 'antd';
import React from 'react';
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import moment from  'moment';
const {Meta} = Card;
const incompleteColor = "#ff9494";
const completeColor = "#52c41a";



const RosterCards = ({rosters, onRosterSelect}) => {
    return (
        <>
            {rosters.map(roster => {
                const weekStart = moment(roster.weekStart)
                return (
                    <Card
                      style={{ width: "auto", margin: "8px 8px" }}
                      hoverable
                      onClick={() => {onRosterSelect(roster)}}
                      actions={[
                        roster.complete ? (
                          <CheckCircleTwoTone twoToneColor={completeColor} />
                        ) : (
                          <CloseCircleTwoTone twoToneColor={incompleteColor} />
                        ),
                      ]}
                    >
                      <Meta title={weekStart.format('DD/MM/YYYY') + ' - ' + weekStart.endOf('week').format('DD/MM/YYYY')} />
                    </Card>
                )
                })}
        </>
    );
};

export default RosterCards;