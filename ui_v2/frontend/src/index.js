import React from "react";
import ReactDOM from "react-dom";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polyline,
  Marker
} from "react-google-maps";
import key from './key.js';
import { Icon } from '@iconify/react';
import wheelchairAccessibility from '@iconify/icons-mdi/wheelchair-accessibility';
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
import {StatefulSelect as Search, TYPE} from 'baseui/select';

import signh from "./icons/icons8-assistive-technology-48.png";
import hydrant from "./icons/icons8-fire-hydrant-50.png";
import nopark from "./icons/icons8-no-parking-48.png";
import lamp from "./icons/icons8-street-lamp-50.png";
import park from "./icons/icons8-parking-30.png";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';

// Geocode.setApiKey(key);
// Geocode.enableDebug();

//const PATH='http://ec2-54-183-149-77.us-west-1.compute.amazonaws.com:5000/';
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
                'hydrants': [],
                'nopark': [],
                'sidewalks': [],
                'm_streets':[]}
            };
        this.get_icons();
    }

    onPlaceSelected = ( place ) => {
        const address = place.formatted_address,
        addressArray =  place.address_components,
        latValue = place.geometry.location.lat(),
        lngValue = place.geometry.location.lng();
        // city = this.getCity( addressArray ),
        // area = this.getArea( addressArray ),
        // state = this.getState( addressArray ),
        
        console.log(address);
        console.log(latValue);
        console.log(lngValue);
        // Set these values in the state.
        // this.setState({
        // address: ( address ) ? address : '',
        // area: ( area ) ? area : '',
        // city: ( city ) ? city : '',
        // state: ( state ) ? state : '',
        // markerPosition: {
        //     lat: latValue,
        //     lng: lngValue
        // },
        // mapPosition: {
        //     lat: latValue,
        //     lng: lngValue
        // },
        // })
        this.state.icons.center = {'lat':latValue, 'lng': lngValue};
        this.setState({icons: this.state.icons});
        //todo - get new data
        };

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
        const InternalMap = props => (
            <div>
            <Autocomplete
                        style={{
                            align: 'top',
                            width: '100%',
                            height: '40px',
                            paddingLeft: '16px',
                            marginTop: '2px',
                            marginBottom: '100px',
                            position: 'relative',
                            display: 'inline-block'
                        }}
                        onPlaceSelected={this.onPlaceSelected}
                        types={[]}
                        componentRestrictions={{country: "usa"}}
                    />
            <GoogleMap defaultZoom={18} defaultCenter={this.state.icons.center}>
                {this.state.icons.sidewalks.map((points) => 
                    <Polyline
                    path={points}
                    options={{
                        strokeColor: "blue",
                        strokeOpacity: 0.75,
                        strokeWeight: 2
                    }}
                    />
                )}
                {this.state.icons.m_streets.map((points) => 
                    <Polyline
                    path={points}
                    options={{
                        strokeColor: "green",
                        strokeOpacity: 0.75,
                        strokeWeight: 2
                    }}
                    />
                )}
                {this.state.icons.hydrants.map(coords =>
                    <Marker
                    position={{ lat: coords[0], lng: coords[1] }}
                    icon={hydrant}
                    />)
                }
                {this.state.icons.lamps.map(coords =>
                    <Marker
                    position={{ lat: coords[0], lng: coords[1] }}
                    icon={lamp}
                    />)
                }
                {this.state.icons.meters.map(coords =>
                    <Marker
                    position={{ lat: coords[0], lng: coords[1] }}
                    icon={park}
                    />)
                }
                {this.state.icons.nopark.map(coords =>
                    <Marker
                    position={{ lat: coords[0], lng: coords[1] }}
                    icon={nopark}
                    />)
                }
                {this.state.icons.wheelchairs.map(coords =>
                    <Marker
                    position={{ lat: coords[0], lng: coords[1] }}
                    icon={signh}
                    />)
                }
            </GoogleMap>
            
            </div>
            );


        const MapHoc = withScriptjs(withGoogleMap(InternalMap));
        
            
        return (
            <div>
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
                            AccessiPark Denver
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
                                About This Project
                            </StyledLink>
                        </StyledNavigationItem>
                    </StyledNavigationList>
                    <StyledNavigationList $align={ALIGN.right}>
                    <StyledNavigationItem style={{width: '300px'}}>
                        
                    </StyledNavigationItem>
                    </StyledNavigationList>
                </HeaderNavigation>
                </div>
                </BaseProvider>
            </StyletronProvider>
            <div style={{ height: '90vh', width: '100%', padding: '12px'}}>
                {this.state.selected == 'guide' &&
                <p>tbd</p>
                }
                {this.state.selected == 'about' &&
                <p>tbd</p>
                }
                {this.state.selected == 'map' &&
                    <div>
                    
                    <MapHoc
                        googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + key + "&v=3.exp&libraries=geometry,drawing,places"}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `90vh`, position: 'relative' }} />}
                        mapElement={<div style={{ height: `100%`, position: 'relative' }} />}
                    />
                    </div>
                }
                </div>
            </div>

        );
    }
}

ReactDOM.render(
  <TheSite />,
  document.getElementById("root")
);