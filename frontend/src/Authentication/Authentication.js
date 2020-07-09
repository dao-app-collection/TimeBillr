import React, {useContext} from 'react';
import {AuthContext} from "../Context/UserAuthContext";
import {Route, Switch, Redirect} from 'react-router-dom';
import Register from "./Register";
import LogIn from "./LogIn";
import Verification from './Verification';
import { FullPageContainer, AuthFormContainer } from "../styled-components/styled";

const Authentication = () => {
    const authContext = useContext(AuthContext);
    console.log(authContext);

    if(authContext.authenticated===true){
        return(
            <div>Authenticated</div>
        )
    } else {
        return(
            <FullPageContainer>
                <AuthFormContainer>
                    <Switch>
                        <Route path={'/app/login'}>
                            <LogIn />
                        </Route>
                        <Route path={'/app/register'}>
                            <Register />
                        </Route>
                        <Route path={'/app/verification/:id'}>
                            <Verification />
                        </Route>
                        <Route path={'/app'}>
                            <Redirect to={'/app/register'} />
                        </Route>
                    </Switch>
                </AuthFormContainer>
            </FullPageContainer>
        )
    }
};

export default Authentication;
