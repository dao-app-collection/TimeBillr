import React, { createContext } from "react";
import apiClient from "../config/axios";

export const AuthContext = createContext({
  authenticated: false,
  authenticating: true,
  userData: {},
  register: () => {},
  logIn: () => {},
  logOut: () => {},
  validateOnLoad: () => {},
});

export class AuthProvider extends React.Component {
  register = () => {};

  logIn = async (data) => {
    let user = await apiClient.get("user");
    if (user.status === 200) {
      console.log(user.data);
      this.setState({ userData: Object.assign({}, user.data) }, () => {
        this.setState({ authenticated: true });
      });
    }
  };

  logOut = () => {
    this.setState({ authenticating: false, authenticated: false });
  };

  validateOnLoad = async () => {

    try {
      this.setState({ authenticating: true });
      let user = await apiClient.get("user/checkToken");
      if (user.status === 200) {
        this.setState({ userData: Object.assign({}, user.data) }, () => {
          this.setState({ authenticated: true });
          this.setState({ authenticating: false });
        });
      } else {
        this.setState({ authenticating: false });
      }
    } catch (error) {
      this.setState({ authenticating: false });
    }
  };

  componentDidMount() {
    this.validateOnLoad();
  }

  state = {
    authenticated: false,
    authenticating: true,
    userData: {},
    logIn: this.logIn,
    logOut: this.logOut,
    register: this.register,
    validateOnLoad: this.validateOnLoad,
  };
  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export const AuthConsumer = AuthContext.Consumer;
