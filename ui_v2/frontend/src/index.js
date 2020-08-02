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
import {Paragraph3, Paragraph1} from 'baseui/typography';
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
import nopark from "./icons/icons8-no-parking-30.png";
import lamp from "./icons/icons8-street-lamp-50.png";
import park from "./icons/icons8-parking-30.png";
import ramp from "./icons/icons8-filled-circle-16.png";
import logo from "./icons/logo.png";
import lot from "./icons/icons8-square-40.png"
import Autocomplete from 'react-google-autocomplete';


const PATH='http://ec2-54-183-149-77.us-west-1.compute.amazonaws.com:5000/';
//const PATH='http://localhost:5000/';
const engine = new Styletron();

const bounds = [{'lat':39.625055, 'lng':-105.1083229},{'lat':39.8926559,'lng':-104.6403155}];
//const bounds = [{'lat':39.71681, 'lng':-105.0606},{'lat':39.79398,'lng':-104.9685}];


class TheSite extends React.Component {
    //declare intial state vars
    constructor(props) {
        super(props);
        this.state = {
            key: {key:key},
            selected: 'guide', //initial tab selection
            center:  {"lat": 39.7289820, "lng": -104.984931},
            zip: 80264,
            icons: {'wheelchairs':[], 
                'meters':[], 
                'lamps': [], 
                'hydrants': [],
                'nopark': [],
                'sidewalks': [],
                'm_streets':[],
                'ramps':[],
                'facilities':[]},
            text: 'Charting Accessibility Obstacles and Accessible Parking Opportunities with Computer Vision, Google Street View and Denver OpenData.',
            secondary: "Search anywhere in the Denver area to populate that section of the map, or pan and click to re-center!",
            third: "(Non-locals - try searching 'River North Brewery - Blake Street Taproom' or 'Goed Zuur'.)"
            };
        //this.get_lookup();
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

    get_icons = () => {
        fetch(PATH + "api/get_icons/" + this.state.zip, {
                method: "post",
                body:
                    JSON.stringify({
                        center: this.state.center
                    }),
                headers: {"Content-Type": "application/json"}
            })
            .then(this.handleErrors)
            .then(response => response.json())
            .then(data => this.setState({'icons':data}));
    }

    
    onPlaceSelected = ( place ) => {

        if (place.geometry){
            this.setState({text: 'Updating center...'});
            console.log(place);
            const latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();

            const center = {'lat':latValue, 'lng': lngValue};
            if (this.in_bounds(center)){
                console.log('in bounds');
                this.update(center, place.formatted_address);
            }else{
                this.setState({'text':'Location '+place.formatted_address+' is out of bounds.'});
            }
            
        }
    }


    update = (center, a) => {
        this.setState({center: center, text: 'Viewing features near '+a+'.'});
        this.get_icons();
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

    onMap = () => {
        this.setState({'selected': 'map'});
    }

    onGuide = () => {
        this.setState({'selected': 'guide'});
    }


    mapClicked(event) {

        this.setState({text: 'Updating center...'});
        console.log(event);
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        this.update({'lat':lat, 'lng':lng}, 'mouse location')
    }

    render() {
        var lineSymbol = {
            path: "M 0,-1 0,1",
            strokeOpacity: 0.6,
            scale: 4
        };

        const OPTIONS = {
            minZoom: 17,
            maxZoom: 21,
            }

        const InternalMap = props => (
            <div>
            
            <GoogleMap defaultZoom={19} 
                options={OPTIONS}
                defaultCenter={this.state.center}
                onClick={this.mapClicked.bind(this)}
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
                        strokeColor: "#9B59B6",
                        strokeOpacity: 0.75,
                        strokeWeight: 2,
                        fillColor: "#9B59B6",
                        fillOpacity: 0.25
                    }}
                    />
                )}
                {this.state.icons.sidewalks.map((points) => 
                    <Polyline
                    path={points}
                    options={{
                        strokeColor: "#3498DB",
                        strokeWeight: 0,
                        icons: [
                            {
                                icon: lineSymbol,
                                offset: "0",
                                repeat: "20px"
                            }
                            ]
                    }}
                    />
                )}
                {this.state.icons.m_streets.map((points) => 
                    <Polyline
                    path={points}
                    options={{
                        strokeColor: "#2ECC71",
                        strokeWeight: 0,
                        icons: [
                            {
                                icon: lineSymbol,
                                offset: "0",
                                repeat: "20px"
                            }
                            ]
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
                    position={{ lat: coords[0], lng: coords[1] }}
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
                            <StyledLink href='http://accessipark.com/'>
                                Homepage
                            </StyledLink>
                        </StyledNavigationItem>
                    </StyledNavigationList>
                </HeaderNavigation>
                </div>

            <div style={{ height: '90vh', width: '100%', padding: '12px'}}>
                {this.state.selected == 'guide' &&
                    
                    <div style={{padding: '12px'}}>
                        <Paragraph3><strong>Charting Accessibility Obstacles and Accessible Parking Opportunities with Computer Vision, Google Street View and Denver OpenData.</strong></Paragraph3>
                        <Paragraph3>Disclaimer: Accuracy is not guaranteed.</Paragraph3>
                        <div style={{ padding: '12px'}}>
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
                                    <ListItemLabel><img src={lot}/></ListItemLabel>
                                )}
                                >
                                <ListItemLabel>Parking Facilities - OpenData</ListItemLabel>
                                
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
                    </div>
                }
                {this.state.selected == 'map' &&
                    <div>
                    <Paragraph3><strong>{this.state.text}</strong></Paragraph3>
                    <Paragraph3>{this.state.secondary}</Paragraph3>
                    <Paragraph3><i>{this.state.third}</i></Paragraph3>
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