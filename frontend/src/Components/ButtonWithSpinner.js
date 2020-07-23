import React from 'react';
import { Button, Spin } from 'antd';

const ButtonWithSpinner = ({sending, form, innerHtml}) => {
    console.log(sending);
    return (
        <>
            {sending ? 
                <Button form={form}  key='submit' htmlType='submit'>
                    <Spin />
                </Button>
                :
                <Button form={form}  key='submit' htmlType='submit' >
                    {innerHtml}
                </Button>
            }
        </>
    );
};

export default ButtonWithSpinner;