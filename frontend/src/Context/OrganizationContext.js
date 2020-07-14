import React, {createContext} from "react";
import apiClient from '../config/axios';


export const OrganizationContext = createContext({
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
        let organization = this.state.organizations.filter(organization => {
            return organization.id === id;
        })
        this.setState({organization: Object.assign({}, organization[0])}, this.getAllOrganizationData);
    }
    updateOrganizations = () =>{
        return apiClient.get('teams/findAll')
            .then(res => {
                console.log(res);
                this.setState({organizations: [...res.data]});

            });      
    }

    getAllOrganizationData = async () => {
        const organizationDataResponse = await apiClient.get(`teams/data/${this.state.organization.id}`);
        if(organizationDataResponse.status === 200){
            console.log(organizationDataResponse);
            this.setState({organizationData: Object.assign({}, organizationDataResponse.data)})
        }
    }
    state = {
        organizations: [],
        organization: {},
        updateUseOrganization: this.updateUseOrganization,
        updateOrganizations: this.updateOrganizations,
        getAllOrganizationData: this.getAllOrganizationData,
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
