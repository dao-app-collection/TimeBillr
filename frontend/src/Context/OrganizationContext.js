import React, { createContext, useContext } from "react";
import apiClient from "../config/axios";
import FullPageSpinner from "../Components/FullPageSpinner";

export const OrganizationContext = createContext({
  loadedOrganizationData: false,
  organizations: [],
  organization: {},
  organizationData: {},
  userTeamMembership: null,
  getAllOrganizationData: () => {},
  updateUseOrganization: () => {},
  updateOrganizations: () => {},
});

export const useOrganizationContext = () => useContext(OrganizationContext);

export class OrganizationProvider extends React.Component {
  updateUseOrganization = (id) => {
    console.log(this.state.organizations);
    let organization = this.state.organizations.filter((organization) => {
      return organization.id === id;
    });
    this.setState({ organization: Object.assign({}, organization[0]) }, () => {
      this.getAllOrganizationData(id);
    });
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

    const result = await Promise.all([
      // The User permissions promise
      new Promise(async (resolve, reject) => {
        const userPermissionsResponse = await apiClient.get(`teams/user/${id}`);
        if(userPermissionsResponse.status === 200){
          console.log(userPermissionsResponse);
          this.setState({userTeamMembership: Object.assign({}, userPermissionsResponse.data)}, () => {
            this.checkLoadedOrganizationData();
            resolve('User Team Membership Updated')
          })
        } else{
          reject('Could not find Member Permissions');
        }
      })
    , 
      // The Organization Data Promise
      new Promise(async (resolve, reject) => {
        const organizationDataResponse = await apiClient.get(`teams/data/${id}`);
        if (organizationDataResponse.status === 200) {
          console.log(organizationDataResponse);
          this.setState(
            {
              organizationData: Object.assign({}, organizationDataResponse.data),
            },
            () => {
              this.checkLoadedOrganizationData();
              
              resolve("Organization Data updated");
            }
          );
        } else {
          reject("Organization Data not updated.");
        }
      }),
    ])

    return result;
  };

  checkLoadedOrganizationData (){
    console.log('in check loaded organization data');
    console.log(this.state.organizationData);
    console.log(this.state.userTeamMembership);
    if(isNotEmpty(this.state.organizationData) && this.state.userTeamMembership){
      this.setState({loadedOrganizationData: true});
    } else {
      this.setState({loadedOrganizationData: false});
    };
  };

  componentDidMount() {}
  state = {
    loadedOrganizationData: false,
    organizations: [],
    organization: {},
    organizationData: {},
    userTeamMembership: null,
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
};

function isNotEmpty(obj){
  console.log(obj);
  console.log(Object.keys(obj).length !== 0)
  return Object.keys(obj).length !== 0;
}

export const OrganizationConsumer = OrganizationContext.Consumer;
