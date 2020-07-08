import React, {createContext} from "react";
import apiClient from '../config/axios';

export const AuthContext = createContext({
    authenticated: false,
    authenticating: false,
    register: () => {},
    logIn: () => {},
    logOut: () => {},
    validateOnLoad: () => {},
});

export class AuthProvider extends React.Component {

    register = () => {

    };

    logIn = (data) => {
        console.log('authenticated');
        console.log(data);
        this.setState({authenticated: true});
        apiClient.default.withCredentials = true;
        apiClient.get('http://localhost:8000/api/user', {withCredentials: true}).then(res => {
            console.log(res);
        }).then(() => {
            apiClient.get('http://localhost:8000/api/test').then((res) => {
                apiClient.get('http://localhost:8000/api/test').then(res => {
                    
                })
            })
        });
    };

    logOut = () => {

    };

    validateOnLoad = async () => {
        apiClient.default.withCredentials = true;
        // let sanctumCookie = await apiClient.get('http://localhost:8000/sanctum/csrf-cookie');
        // if(sanctumCookie.status === 204){
            let user = await apiClient.get('http://localhost:8000/api/test');
            console.log(user);
        // }

    }

    componentDidMount() {
        // this.validateOnLoad();
    }

    state = {
        authenticated: false,
        authenticating: false,
        logIn: this.logIn,
        logOut: this.logOut,
        register: this.register,
        validateOnLoad: this.validateOnLoad,
    }
    render() {
        return(
            <AuthContext.Provider value={this.state}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
};

export const AuthConsumer = AuthContext.Consumer;
