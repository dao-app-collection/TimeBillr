import React from 'react';
import {Layout, Button, Typography, Carousel} from 'antd';
import Footer from '../Components/Footer';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import EzRosterLogo from '../EzRoster_logo.svg';

const {Title} = Typography;
const {Header, Sider, Content} = Layout;

const HomeHeader = styled.div`
    max-width: 1200px;
    height: 100%;
    margin: auto;
    padding: 0 24px;
`
const LogoContainer = styled.div`
    float: left;
    height: 100%;
`
const HomeMenu = styled.div`
    float: right;
    height: 100%;
`

const Banner = styled.div`
    min-height: 75vh;
    max-width: 1200px;
    margin: auto;
    padding: 0 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
`
const BannerTitle = styled.div`
    max-width: 400px;
    line-height: 1.3em;
`
const imageStyle = {
    height: '405px',
    width: '760px'
}
const Landing = () => {
    console.log('landing')
    const history = useHistory();

    function redirect(route){
        history.push(route);
    }
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Content 
                style={{backgroundColor: '#fdfdfd', 
                        backgroundImage: 'linear-gradient(to top, rgba(253,253,253,0.3) 0%, rgba(193,218,255,0.3) 100%)'}}>
                <Header style={{background: 'none'}}>
                    <HomeHeader >
                        <LogoContainer>
                            <img style={{width: '96px', height: '96px'}} src={EzRosterLogo}/>
                        </LogoContainer>
                        <HomeMenu>
                            <Button 
                                type='primary' 
                                ghost 
                                style={{margin: '0px 16px'}}
                                onClick={() => {redirect('/app/login')}}
                                >
                                Log In
                            </Button>
                            <Button 
                                type='primary' 
                                ghost
                                onClick={() => {redirect('/app/register')}}
                                >
                                Register
                            </Button>
                        </HomeMenu>
                    </HomeHeader>
                </Header>
                <Banner>
                    <BannerTitle>
                        <Title level={1} style={{color: '#5f9bf1', margin: '0'}}>
                            EzRoster
                        </Title>
                        <Title level={3} style={{color: '#333', margin: '0'}}>
                            Simple to use rostering software.
                        </Title>
                        <Title level={4} style={{color: '#666', margin: '0', fontSize: '1em'}}>
                            Create a team, add members, create rosters and add shifts!
                            Track employee hours, total costs and contractual obligations.
                            Receive reminders when you have an upcoming shift.
                        </Title>
                    </BannerTitle>
                    <div style={{maxWidth: '760px', height: '300px', margin: '0 16px'}}>
                    <Carousel autoplay effect={'fade'}>
                        <div>
                            <img style={imageStyle}src='https://res.cloudinary.com/clinnygee/image/upload/v1599626889/EzRosterScreenshot_0_nhrh4j.png' alt='software-photos'/>
                        </div>
                        <div>
                            <img style={imageStyle}src='https://res.cloudinary.com/clinnygee/image/upload/v1599626894/EzRosterScreenshot_1_iqtrq3.png' alt='software-photos'/>
                        </div>
                        <div>
                            <img style={imageStyle}src='https://res.cloudinary.com/clinnygee/image/upload/v1599626901/EzRosterScreenshot_2_hmzrwh.png' alt='software-photos'/>
                        </div>
                        {/* <div>
                            1
                        </div>
                        <div>
                            2
                        </div> */}
                    </Carousel>
                    </div>
                    
                </Banner>
            </Content>
            
            
            <Footer />
        </Layout>
    );
};

export default Landing;