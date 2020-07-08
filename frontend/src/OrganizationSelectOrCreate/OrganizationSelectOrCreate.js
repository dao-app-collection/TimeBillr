import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {OrganizationContext} from "../Context/OrganizationContext";
import Layout from "antd/es/layout";
import {Col, Row} from "antd";
import Card from "antd/es/card";

import axios from "../config/axios";

import OrganizationCreate from "./OrganizationCreate";

const OrganizationSelectOrCreate = () => {
    const context = useContext(OrganizationContext);
    const [awaiting, setAwaiting] = useState(true);
    const history = useHistory();


    console.log(context);

    useEffect(()=>{
        context.updateOrganizations().then(emptyPromise => {
            console.log(emptyPromise);
            setAwaiting(false);
        })

    }, []);

    const createOrganizationCard = () => {
        console.log(context.organizations);
        let cards = context.organizations.map(organization => {
            return (<Card key={organization.id} title={organization.name} hoverable={true} style={{margin: '8px 0', textAlign: 'center'}} onClick={() => {updateUseOrganization(organization.id)}}>
                        {organization.description}
                    </Card>)
        });
            return cards.length > 0 ?  cards :  null;
    };

    const updateUseOrganization = (id) => {
        console.log(history);
        console.log(id);
        context.updateUseOrganization(id);
        history.push(`/app/${id}`);

    }

    const createNewOrganization = () => {

    };

    let cards = awaiting ? null : createOrganizationCard();

    return (
        <Layout.Content style={{padding: '20px 20px', overflow: 'scroll'}}>
            <Row justify={'center'}>
                <Card title="Organizations" style={{width: '300px', display: 'flex', flexDirection: 'column', textAlign: 'center'}}>

                            {/*<Card title="Organization Name" hoverable={true} style={{margin: '8px 0'}}>*/}
                            {/*    Nested Card*/}
                            {/*</Card>*/}
                            {cards}
                            <OrganizationCreate />

                </Card>
            </Row>
        </Layout.Content>
    );
};

export default OrganizationSelectOrCreate;
