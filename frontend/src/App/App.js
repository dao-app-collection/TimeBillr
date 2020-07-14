import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {AuthConsumer, AuthProvider} from "../Context/UserAuthContext";
import {transitions, positions, Provider as AlertProvider} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic'; 
import Main from "../Main/Main";

import 'antd/dist/antd.css';

const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    transition: transitions.SCALE
}

function App() {
  return (
    <BrowserRouter>
      <AlertProvider template={AlertTemplate} {...options}>
        <AuthProvider>
            <AuthConsumer>{value => (
                <Main />
            )}
            </AuthConsumer>
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  );
}

export default App;
