import React, {createContext} from "react";
import apiClient from '../config/axios';


export const OrganizationContext = createContext({
    organizations: [],
    organization: {},
    updateUseOrganization: () => {},
    updateOrganizations: () => {},
});

export class OrganizationProvider extends React.Component {



    updateUseOrganization = (id) => {
        console.log(this.state.organizations);
        let organization = this.state.organizations.filter(organization => {
            return organization.id === id;
        })
        this.setState({organization: Object.assign({}, organization[0])});
    }
    updateOrganizations = () =>{
        apiClient.get('teams/findAll')
            .then(res => {
                this.setState({organizations: [...res.data]});

            });
        return Promise.resolve();


    }
    state = {
        organizations: [],
        organization: {},
        updateUseOrganization: this.updateUseOrganization,
        updateOrganizations: this.updateOrganizations,
    }
    render(){
        return(
            <OrganizationContext.Provider value={this.state}>
                {this.props.children}
            </OrganizationContext.Provider>
        )
    }
};

export const OrganizationConsumer = OrganizationContext.Consumer;
