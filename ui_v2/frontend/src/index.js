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

import signh from "./icons/icons8-assistive-technology-48.png";
import hydrant from "./icons/icons8-fire-hydrant-50.png";
import nopark from "./icons/icons8-no-parking-48.png";
import lamp from "./icons/icons8-street-lamp-50.png";
import park from "./icons/icons8-parking-30.png";
import ramp from "./icons/icons8-ramp-32.png";
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
            center:  {
                //default
                    lat:39.74528706,
                    lng:-104.99208540000001
                },
            'zip': 80264,
            icons: {'wheelchairs':[], 
                'meters':[], 
                'lamps': [], 
                'hydrants': [],
                'nopark': [],
                'sidewalks': [],
                'm_streets':[],
                'ramps':[]}
            };
        this.get_icons();
    }

    onPlaceSelected = ( place ) => {
        console.log(place);
        const address = place.formatted_address,
        addressArray =  place.address_components,
        latValue = place.geometry.location.lat(),
        lngValue = place.geometry.location.lng();
        console.log(addressArray[6].types);
        var zip = this.state.zip;
        if (addressArray[6].types.includes('postal_code')){
            zip = addressArray[6]['short_name'];
        }else if(addressArray[7].types.includes('postal_code')){
            zip = addressArray[7]['short_name'];
        }else{
            zip = addressArray[8]['short_name'];
        }
        const center = {'lat':latValue, 'lng': lngValue};
        this.setState({center: center});
        console.log(zip);
        console.log(this.state.zip);
        if (zip != this.state.zip){
            this.setState({zip:zip});
            this.get_icons(); //TODO - send center point to check geocoding
            //80202, 80264 
        } else {
            console.log('same zip');
            console.log(latValue, lngValue);
        }
    }

    get_icons = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ center: this.state.center})
        };
        fetch(PATH + "api/get_icons/" + this.state.zip, requestOptions)
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
            
            <GoogleMap defaultZoom={18} 
                defaultCenter={this.state.center}
                handleOnLoad={this.handleOnLoad}

                >
                <Autocomplete
                    style={{
                        align: 'center',
                        width: '300px',
                        paddingLeft: '16px',
                        marginTop: '2 px',
                        marginBottom: '2px',
                        height: '40px',
                        position: 'absolute',
                        left:     250,
                        top:      5
                    }}
                    onPlaceSelected={this.onPlaceSelected}
                    types={[]}
                    componentRestrictions={{country: "usa"}}
                    position={this.state.center}
                />
                <Marker
                    position={this.state.center}
                />
                {this.state.icons.sidewalks.map((points) => 
                    <Polyline
                    path={points}
                    options={{
                        strokeColor: "#3498DB",
                        strokeOpacity: 0.75,
                        strokeWeight: 2
                    }}
                    />
                )}
                {this.state.icons.m_streets.map((points) => 
                    <Polyline
                    path={points}
                    options={{
                        strokeColor: "#2ECC71",
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
                {this.state.icons.ramps.map(coords =>
                    <Marker
                    position={coords}
                    icon={ramp}
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
                        mapElement={<div id='map' style={{ height: `100%`, position: 'static' }} />}
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