import React from 'react';
import ReactDOM from 'react-dom';
// import css from 'style.scss';
import GoogleMapReact from 'google-map-react';
import { Icon } from '@iconify/react';
import wheelchairAccessibility from '@iconify/icons-mdi/wheelchair-accessibility';
import fireHydrant from '@iconify/icons-mdi/fire-hydrant';
import coachLamp from '@iconify/icons-mdi/coach-lamp';
import parkingmeterIcon from '@iconify/icons-whh/parkingmeter';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";
import {BaseProvider, LightTheme} from 'baseui';
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
//Todo - drop
import ListGroup from 'react-bootstrap/ListGroup'
import key from './key.js';
import {StatefulSelect as Search, TYPE} from 'baseui/select';
//npm install google-map-react
// npm install --save-dev @iconify/react @iconify/icons-mdi @iconify/icons-whh
//npm install file-loader --save-dev
//npm install baseui styletron-engine-atomic styletron-react
// npm install react-bootstrap bootstrap
//define constants for networking - todo - this may be different on the cluster
const PATH='http://localhost:5000/';

const engine = new Styletron();

class TheSite extends React.Component {
    //declare intial state vars
    constructor(props) {
        super(props);
        this.state = {
            key: {key:key},
            selected: 'map', //initial tab selection
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
        fetch(PATH + "api/get_icons")
            .then(response => response.json())
            .then(data => this.setState({'icons':data}));
    }

    onMap = () => {
        this.setState({'selected': 'map'});
    }

    onGuide = () => {
        this.setState({'selected': 'guide'});
    }

    onAbout = () => {
        this.setState({'selected': 'about'});
    }

    render() {
        const size = 25;
        return (
            <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                <div style={{width:'205px'}}>
                <HeaderNavigation>
                    <StyledNavigationList $align={ALIGN.left}>
                        <StyledNavigationItem>
                            <div style={{padding: '5px', display: 'inline-block'}}>
                                <Icon icon={wheelchairAccessibility} 
                                    color='blue'/>
                            </div>
                            AccessPark Denver
                    </StyledNavigationItem>
                    </StyledNavigationList>
                    <StyledNavigationList $align={ALIGN.center} />
                    <StyledNavigationList $align={ALIGN.right}>
                        <StyledNavigationItem>
                        <StyledLink href='#' onClick={this.onMap}>
                            Map
                        </StyledLink>
                        </StyledNavigationItem>
                        <StyledNavigationItem>
                        <StyledLink href='#' onClick={this.onGuide}>
                            User Guide
                        </StyledLink>
                        </StyledNavigationItem>
                    </StyledNavigationList>
                    <StyledNavigationList $align={ALIGN.right}>
                        <StyledNavigationItem>
                            <StyledLink href='#' onClick={this.onAbout}>
                                About Us
                            </StyledLink>
                        </StyledNavigationItem>
                    </StyledNavigationList>
                    <StyledNavigationList $align={ALIGN.right}>
                    <StyledNavigationItem style={{width: '300px'}}>
                        <Search
                        // {...options}
                         type={TYPE.search}
                        // getOptionLabel={props => props.option.id || null}
                        // onChange={() => {}}
                        />
                    </StyledNavigationItem>
                    </StyledNavigationList>
                </HeaderNavigation>
                </div>
                <div style={{ height: '90vh', width: '100%', padding: '12px'}}>
                    {this.state.selected == 'guide' &&
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Icon icon={parkingmeterIcon} 
                                color='grey'
                                width={size}
                                height={size}/>
                                Parking Meter - <i> <a href="https://www.denvergov.org/opendata/dataset/city-and-county-of-denver-parking-meters">Denver Open Data</a></i>
                                </ListGroup.Item>
                        <ListGroup.Item>
                            <Icon icon={wheelchairAccessibility} 
                                color='blue'
                                width={size}
                                height={size}/>
                                Handicap Parking  
                            <Icon icon={fireHydrant} 
                                color='orange'
                                width={size}
                                height={size}/>
                                Fire Hydrant 
                            <Icon icon={coachLamp} 
                                color='red'
                                width={size}
                                height={size}/>
                                Lamp - <i><a href="http://maps.google.com">Google Streetview</a></i> and Computer Vision
                        </ListGroup.Item>
                    </ListGroup>
                    }
                {this.state.selected == 'map' &&
                    <GoogleMapReact
                        bootstrapURLKeys={this.state.key}
                        defaultCenter={this.state.icons.center}
                        defaultZoom={18}
                    >
                        {this.state.icons.meters.map(coords =>
                            <Icon icon={parkingmeterIcon} 
                            color='grey'
                            lat={coords[0]}
                            lng={coords[1]}
                            width="20"
                            height="20"/>
                        )}
                        {this.state.icons.wheelchairs.map(coords =>
                            <Icon icon={wheelchairAccessibility} 
                            color='blue'
                            lat={coords[0]}
                            lng={coords[1]}
                            width="20"
                            height="20"/>
                        )}
                        {this.state.icons.hydrants.map(coords =>
                            <Icon icon={fireHydrant} 
                            color='orange'
                            lat={coords[0]}
                            lng={coords[1]}
                            width="20"
                            height="20"/>
                        )}
                        {this.state.icons.lamps.map(coords =>
                            <Icon icon={coachLamp} 
                            color='red'
                            lat={coords[0]}
                            lng={coords[1]}
                            width="20"
                            height="20"/>
                        )}
                    </GoogleMapReact>
                    }
                </div>
                </BaseProvider>
            </StyletronProvider>
        );
    }
}

ReactDOM.render(<TheSite />, document.getElementById("root"));