import React from 'react';
import ReactDOM from 'react-dom';
import css from 'style.scss';
import GoogleMapReact from 'google-map-react';
import { Icon } from '@iconify/react';
import wheelchairAccessibility from '@iconify/icons-mdi/wheelchair-accessibility';
import fireHydrant from '@iconify/icons-mdi/fire-hydrant';
import coachLamp from '@iconify/icons-mdi/coach-lamp';
import parkingmeterIcon from '@iconify/icons-whh/parkingmeter';

// import Tabs from 'react-bootstrap/Tabs'
// import Tab from 'react-bootstrap/Tab'
import Card from 'react-bootstrap/Card'
import 'bootstrap/dist/css/bootstrap.min.css';
//npm install google-map-react
// npm install --save-dev @iconify/react @iconify/icons-mdi @iconify/icons-whh
// npm install react-bootstrap bootstrap



const AnyReactComponent = ({ text }) => <div style={{color:'red'}}>{text}</div>;
 
class TheSite extends React.Component {
    //declare intial state vars
    constructor(props) {
        super(props);
        this.state = {key: 'home'};
    }

    static defaultProps = {
        center: {
            lat:39.74917208,
            lng:-104.9870462
        },
        zoom: 16
    };

    render() {
        return (
            <div style={{padding:'35px'}}>
            <Card>
                <Card.Header>Accessible Parking Map Denver</Card.Header>
                
                {/* <Tabs activeKey={this.state.key}
                    onSelect={key => this.setState({ key })}>
                        <Tab eventKey="home" title="Map">
                            <div>A</div>
                        </Tab>
                        <Tab eventKey="other" title="About Us">
                            <div>TEST</div>
                        </Tab>
                </Tabs>                           */}
                <div style={{ height: '100vh', width: '100%', padding: '35px'}}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: 'KEY HERE' }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                    >
                        <Icon icon={wheelchairAccessibility} 
                            color='blue'
                            lat={39.74755556}
                            lng={-104.98428899999999}
                            width="25"
                            height="25"/>
                        <Icon icon={fireHydrant} 
                                color='orange'
                                lat={39.74754878}
                                lng={-104.9925866}
                                width="25"
                                height="25"/>
                        <Icon icon={coachLamp} 
                                color='red'
                                lat={39.74917208}
                                lng={-104.9870462}
                                width="25"
                                height="25"/>
                        <Icon icon={parkingmeterIcon} 
                            color='green'
                            lat={39.74917611}
                            lng={-104.98178429999999}
                            width="25"
                            height="25"/>
                    </GoogleMapReact>
                </div>
            </Card>
        </div>
        );
    }
}

ReactDOM.render(<TheSite />, document.getElementById("root"));