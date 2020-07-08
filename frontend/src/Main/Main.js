import React, {useContext} from 'react';
import {AuthContext} from "../Context/UserAuthContext";
import Authentication from "../Authentication/Authentication";
import Skeleton from "../Skeleton/Skeleton";

const Main = () => {
    const authContext = useContext(AuthContext);

    if(authContext.authenticated){
        return(
            <Skeleton />
        )
    }else{
        return(
            <Authentication />
        )
    }
};

export default Main;
