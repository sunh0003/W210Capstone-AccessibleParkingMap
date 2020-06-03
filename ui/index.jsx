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
        this.state = {
            key: 'home',
            icons: {'center': {
                //default
                    lat:39.74917208,
                    lng:-104.9870462
                },
                'wheelchairs':[], 
                'meters':[], 
                'lamps': [], 
                'hydrants': []}
            };
        this.get_icons();
    }

    get_icons = () => {
        fetch("api/get_icons")
            .then(response => response.json())
            .then(data => this.setState({'icons':data}));
    }

    render() {
        return (
            <div style={{padding:'35px', weight: 'bold'}}>
            <Card>
                <Card.Header>
                    <Card.Title>HandiPark Denver</Card.Title>Computer-vision powered guide to accessible street parking.
                </Card.Header>
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
                        bootstrapURLKeys={{ key: 'key here' }}
                        defaultCenter={this.state.icons.center}
                        defaultZoom={16}
                    >
                        {this.state.icons.meters.map(coords =>
                            <Icon icon={parkingmeterIcon} 
                            color='grey'
                            lat={coords[0]}
                            lng={coords[1]}
                            width="12"
                            height="12"/>
                        )}
                        {this.state.icons.wheelchairs.map(coords =>
                            <Icon icon={wheelchairAccessibility} 
                            color='blue'
                            lat={coords[0]}
                            lng={coords[1]}
                            width="25"
                            height="25"/>
                        )}
                        {this.state.icons.hydrants.map(coords =>
                            <Icon icon={fireHydrant} 
                            color='orange'
                            lat={coords[0]}
                            lng={coords[1]}
                            width="25"
                            height="25"/>
                        )}
                        {this.state.icons.lamps.map(coords =>
                            <Icon icon={coachLamp} 
                            color='red'
                            lat={coords[0]}
                            lng={coords[1]}
                            width="25"
                            height="25"/>
                        )}
                    </GoogleMapReact>
                </div>
            </Card>
        </div>
        );
    }
}

ReactDOM.render(<TheSite />, document.getElementById("root"));