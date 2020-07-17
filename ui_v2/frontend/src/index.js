import React from "react";
import ReactDOM from "react-dom";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polyline,
  Polygon,
  Marker
} from "react-google-maps";
import key from './key.js';
import { Icon } from '@iconify/react';
import chartLineVariant from '@iconify/icons-mdi/chart-line-variant';
import {Paragraph3} from 'baseui/typography';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";
import {BaseProvider, LightTheme} from 'baseui';
import { ListItem, ListItemLabel } from "baseui/list";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import signh from "./icons/icons8-assistive-technology-48.png";
import hydrant from "./icons/icons8-fire-hydrant-50.png";
import nopark from "./icons/icons8-no-parking-48.png";
import lamp from "./icons/icons8-street-lamp-50.png";
import park from "./icons/icons8-parking-30.png";
import ramp from "./icons/icons8-filled-circle-16.png";
import logo from "./icons/logo.png";
import Autocomplete from 'react-google-autocomplete';

//const PATH='http://ec2-54-183-149-77.us-west-1.compute.amazonaws.com:5000/';
const PATH='http://localhost:5000/';
const engine = new Styletron();

const bounds = [{'lat':39.71681, 'lng':-105.0606},{'lat':39.79398,'lng':-104.9685}];
//this doesn't seem to actually bar results from the autocomplete but it might prioritize
//had to restrict manually with this.in_bounds()

class TheSite extends React.Component {
    //declare intial state vars
    constructor(props) {
        super(props);
        this.state = {
            key: {key:key},
            selected: 'map', //initial tab selection
            center:  {"lat": 39.735360298000046, "lng": -104.98630657599995},
            'zip': 80264,
            icons: {'wheelchairs':[], 
                'meters':[], 
                'lamps': [], 
                'hydrants': [],
                'nopark': [],
                'sidewalks': [],
                'm_streets':[],
                'ramps':[],
                'facilities':[]},
            text: 'We scanned Google Street View images with our YOLO object detection model and augmented the results with Denver Open Data to map accessible parking and mobility obstacles.'
            };
        this.get_icons();
    }

    handleErrors = (response) => {
        if (!response.ok) {
            this.setState({
                text: 'Oops! Something went wrong.'});
            throw Error(response.statusText);
        }
        return response;
    }

    onPlaceSelected = ( place ) => {
        if (place.geometry){
            console.log(place);
            const latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();

            const center = {'lat':latValue, 'lng': lngValue};
            if (this.in_bounds(center)){
                console.log('in bounds');
                this.setState({center: center,
                    text: 'Viewing features near '+place.formatted_address+'.'
                });
                console.log('old zip ' + this.state.zip);
                var old_zip = this.state.zip.valueOf();
                console.log('old zip');
                this.get_zip();
                console.log('new zip ' + this.state.zip);
                if (old_zip != this.state.zip){
                    this.get_icons();
                } else {
                    console.log('same zip');
                    console.log(latValue, lngValue);
                }
            }else{
                this.setState({'text':'Location '+place.formatted_address+' is out of bounds.'});
            }
            
        }
    }

    in_bounds = (center) => {
        const b = bounds;
        const c = center;
        console.log(b);
        console.log(c);
        if (b[0].lat <= c.lat && c.lat <= b[1].lat && b[0].lng <= c.lng && c.lng <=b[1].lng){
            return(true);
        }else{
            return(false);
        }
    }

    get_zip = () => {
        //function to geocode consistently
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ center: this.state.center})
        };
        fetch(PATH + "api/get_zip", requestOptions)
            .then(this.handleErrors)
            .then(response => response.json())
            .then(data => this.setState({'zip':data}));
    }

    get_icons = () => {
        console.log(this.state.center);
        console.log(this.state.zip);
        fetch(PATH + "api/get_icons/" + this.state.zip)
            .then(this.handleErrors)
            .then(response => response.json())
            .then(data => this.setState({'icons':data}));
    }

    onMap = () => {
        this.setState({'selected': 'map'});
    }

    onGuide = () => {
        this.setState({'selected': 'guide'});
    }
    
    render() {
        const InternalMap = props => (
            <div>
            
            <GoogleMap defaultZoom={19} 
                defaultCenter={this.state.center}
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
                {this.state.icons.facilities.map((points) => 
                    <Polygon
                    paths={points}
                    options={{
                        strokeColor: "#F1C40F",
                        strokeOpacity: 0.75,
                        strokeWeight: 2,
                        fillColor: "#F1C40F",
                        fillOpacity: 0.25
                    }}
                    />
                )}
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
                    />
                    )
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
                <div style={{width:'230px'}}>
                <HeaderNavigation>
                    <StyledNavigationList $align={ALIGN.left}>
                        <StyledNavigationItem>
                            <div style={{display: 'inline-block'}}>
                                <img src={logo}></img>
                            </div>
                            <div style={{display: 'inline-block', padding:'2px'}}>
                                AccessiPark Denver
                            </div>
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
                            <StyledLink href='#'>
                                About This Project
                            </StyledLink>
                        </StyledNavigationItem>
                    </StyledNavigationList>
                </HeaderNavigation>
                </div>

            <div style={{ height: '90vh', width: '100%', padding: '12px'}}>
                {this.state.selected == 'guide' &&
                    
                    <div style={{padding: '12px'}}>
                        <Paragraph3>We scanned Google Street View images with our YOLO object detection model and augmented the results with Denver Open Data to map accessible parking and mobility obstacles.</Paragraph3>
                        <ListItem
                            endEnhancer={() => (
                                <ListItemLabel><img src={signh}/></ListItemLabel>
                            )}
                            >
                            <ListItemLabel>Accessible Parking - Model</ListItemLabel>
                        </ListItem>
                        <ListItem
                            endEnhancer={() => (
                                <ListItemLabel><img src={park}/></ListItemLabel>
                            )}
                            >
                            <ListItemLabel>Parking Meter - OpenData</ListItemLabel>
                            
                        </ListItem>
                        <ListItem
                            endEnhancer={() => (
                                <ListItemLabel><img src={nopark}/></ListItemLabel>
                            )}
                            >
                            <ListItemLabel>No Parking - Model</ListItemLabel>
                        </ListItem>
                        <ListItem
                            endEnhancer={() => (
                                <ListItemLabel>
                                <Icon icon={chartLineVariant} 
                                    color= "#3498DB"
                                    width="48"
                                    height="48"/>
                                </ListItemLabel>
                            )}
                            >
                            <ListItemLabel>Sidewalk - OpenData</ListItemLabel>
                        </ListItem>
                        <ListItem
                            endEnhancer={() => (
                                <ListItemLabel><img src={ramp}/></ListItemLabel>
                            )}
                            >
                            <ListItemLabel>Sidewalk Ramp - OpenData</ListItemLabel>
                        </ListItem>
                        <ListItem
                            endEnhancer={() => (
                                <ListItemLabel>
                                <Icon icon={chartLineVariant} 
                                    color= "#2ECC71"
                                    width="48"
                                    height="48"/>
                                </ListItemLabel>
                            )}
                            >
                            <ListItemLabel>Construction Free Street (Moratorium) - OpenData</ListItemLabel>
                        </ListItem>
                        <ListItem
                            endEnhancer={() => (
                                <ListItemLabel><img src={hydrant}/></ListItemLabel>
                            )}
                            >
                            <ListItemLabel>Fire Hydrant - Model</ListItemLabel>
                        </ListItem>

                        <ListItem
                            endEnhancer={() => (
                                <ListItemLabel><img src={lamp}/></ListItemLabel>
                            )}
                            >
                            <ListItemLabel>Lamp - Model</ListItemLabel>
                        </ListItem>
                    </div>
                }
                {this.state.selected == 'map' &&
                    <div>
                    <Paragraph3>{this.state.text}</Paragraph3>
                    <MapHoc
                        googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + key + "&v=3.exp&libraries=geometry,drawing,places"}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `90vh`, position: 'relative' }} />}
                        mapElement={<div id='map' style={{ height: `100%`, position: 'static' }} />}
                    />
                    </div>
                }
                </div>
                </BaseProvider>
            </StyletronProvider>
        </div>
        );
    }
}

ReactDOM.render(
  <TheSite />,
  document.getElementById("root")
);