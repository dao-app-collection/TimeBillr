import React, {useContext} from 'react';
import {AuthContext} from "../Context/UserAuthContext";
import {Route, Switch, Redirect} from 'react-router-dom';
import Register from "./Register";
import LogIn from "./LogIn";

const Authentication = () => {
    const authContext = useContext(AuthContext);
    console.log(authContext);

    if(authContext.authenticated===true){
        return(
            <div>Authenticated</div>
        )
    } else {
        return(
            <Switch>
                <Route path={'/login'}>
                    <LogIn />
                </Route>
                <Route path={'/register'}>
                    <Register />
                </Route>
                <Route path={'/'}>
                    <Redirect to={'/register'} />
                </Route>
            </Switch>
        )
    }
};

export default Authentication;
