import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {AuthConsumer, AuthProvider} from "../Context/UserAuthContext";
import Main from "../Main/Main";

import 'antd/dist/antd.css';

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
            <AuthConsumer>{value => (
                <Main />
            )}
            </AuthConsumer>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
