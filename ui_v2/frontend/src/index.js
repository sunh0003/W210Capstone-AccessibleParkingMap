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

//npm install google-map-react
// npm install --save-dev @iconify/react @iconify/icons-mdi @iconify/icons-whh
//npm install file-loader --save-dev
//npm install baseui styletron-engine-atomic styletron-react
// npm install react-bootstrap bootstrap
//define constants for networking - todo - this may be different on the cluster

//const PATH='http://ec2-54-183-149-77.us-west-1.compute.amazonaws.com:5000/';
const PATH='http://localhost:5000/';
const engine = new Styletron();

var markerStyling= {
  clear: "both", display: "inline-block", backgroundColor: "#00921A", fontWeight: '500',
  color: "#FFFFFF", boxShadow: "0 6px 8px 0 rgba(63,63,63,0.11)", borderRadius: "23px",
  padding: "8px 16px", whiteSpace: "nowrap", width: "160px", textAlign: "center"
};

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
                'nopark': []}
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
        console.log(this.state.icons);
        console.log(this.state.icons.center);

        const InternalMap = props => (
            <GoogleMap defaultZoom={18} defaultCenter={this.state.icons.center}>
                <Polyline
                path={[{ lat: 39.739492999999996, lng: -104.982258 }, { lat: 39.73, lng: -151.644 }, { lat: -90, lng: 151.644 }]}
                />
                
                
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
            );

        const MapHoc = withScriptjs(withGoogleMap(InternalMap));
            
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
                <p>tbd</p>
                }
                {this.state.selected == 'about' &&
                <p>tbd</p>
                }
                {this.state.selected == 'map' &&
                    <MapHoc
                        googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + key + "&v=3.exp&libraries=geometry,drawing,places"}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `90vh` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                    
                }
                </div>
                </BaseProvider>
            </StyletronProvider>
        );
    }
}

ReactDOM.render(
  <TheSite />,
  document.getElementById("root")
);