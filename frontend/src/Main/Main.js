import React, {useContext} from 'react';
import {AuthContext} from "../Context/UserAuthContext";
import Authentication from "../Authentication/Authentication";
import Skeleton from "../Skeleton/Skeleton";
import { Switch, Route, Redirect } from 'react-router-dom';

const Main = () => {
    const authContext = useContext(AuthContext);

    if(authContext.authenticated){
        return(
            <Switch>
                <Route path='/app'>
                    <Skeleton />
                </Route>
                <Route path='/app*'>
                    <Redirect to='/app' />
                </Route>
            </Switch>
            // <Skeleton />
        )
    }else{
        return(
            <Authentication />
        )
    }
};

export default Main;
