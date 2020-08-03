import React, { createContext } from "react";
import apiClient from "../config/axios";

export const OrganizationContext = createContext({
  loadedOrganizationData: false,
  organizations: [],
  organization: {},
  organizationData: {},
  getAllOrganizationData: () => {},
  updateUseOrganization: () => {},
  updateOrganizations: () => {},
});

export class OrganizationProvider extends React.Component {
  updateUseOrganization = (id) => {
    console.log(this.state.organizations);
    let organization = this.state.organizations.filter((organization) => {
      return organization.id === id;
    });
    this.setState(
      { organization: Object.assign({}, organization[0]) },
      () => {this.getAllOrganizationData(id)}
    );
  };
  updateOrganizations = () => {
    return apiClient.get("teams/findAll").then((res) => {
      console.log(res);
      this.setState({ organizations: [...res.data] });
    });
  };
  // this function needs to be updated so we can just use this.state.organization instead of passing id
  // that means t.s.organization must ALWAYS be up to date
  getAllOrganizationData = async (id) => {
    console.log(id);
    console.log(this.state.organization);
    const returnPromise = new Promise( async (resolve, reject) => {
      const organizationDataResponse = await apiClient.get(
        `teams/data/${id}`
      );
      if (organizationDataResponse.status === 200) {
        console.log(organizationDataResponse);
        this.setState({
          organizationData: Object.assign({}, organizationDataResponse.data),
        }, () => {
          this.setState({loadedOrganizationData: true});
          resolve('Organization Data updated');
        });
      } else {
        reject('Organization Data not updated.')
      };
  
    });
    
    return returnPromise;
  };

  componentDidMount(){

  };
  state = {
    loadedOrganizationData: false,
    organizations: [],
    organization: {},
    organizationData: {},
    updateUseOrganization: this.updateUseOrganization,
    updateOrganizations: this.updateOrganizations,
    getAllOrganizationData: this.getAllOrganizationData,
  };
  render() {
    return (
      <OrganizationContext.Provider value={this.state}>
        {this.props.children}
      </OrganizationContext.Provider>
    );
  }
}

export const OrganizationConsumer = OrganizationContext.Consumer;
