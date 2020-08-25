import React from 'react';
import { Spin } from 'antd';

const FullPageSpinner = () => {
    return (
        <div style={{width: '100vw', height: '100vh', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Spin size={'large'}/>
        </div>
    );
};

export default FullPageSpinner;