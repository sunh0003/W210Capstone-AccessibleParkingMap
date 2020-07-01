import React from 'react';
import ReactDOM from 'react-dom';
import css from './style.css';
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
                    {this.state.selected == 'about' &&

                        <div className={css.body}>
                            <div className={css.container}>
                                <img src="13247.jpg" alt="Olympic" style={{width:"92%"}}/>
                                <div className={css.centered}>
                                <dr/> <dr/><dr/>
                                    <h1 style={{color:'steelblue'}}>AccessiPark</h1>
                                    <h2 style={{color:'steelblue'}}>W210 Capstone Project</h2>
                                    <h2 style={{color:'steelblue'}}>Michelle Sun, Rachael Burns, Hong Yang, Richard Ryu</h2>
                                </div>
                            </div>
                            <div className={css.about_map} id="map">
                                <h2 id="map"> AccessiPark MAP </h2>
                                <p> <strong>Target Audience:</strong>People who care about city accessibility for handicap people. People who want to find the accessible parking easily </p>
                                <p> <strong>What's on the map:</strong> (1) Accessible parking lot (2) Pole (3) Fire hydrant (4) No parking signs (5) stop signs (6) parkig meters </p>
                                <br />
                            </div>
                        
                            <div>
                            <img src="map.png" alt="Olympic" style={{width:'100%'}}/>
                            </div>

                            <div id="navbar">
                                <a href="#project">ABOUT PROJECT</a>
                                <a href="#team">ABOUT US</a>
                            </div>

                            <div id="wrapper">
                                <div className={css.about_map} id="project">
                                    <h2 id="project"> ABOUT PROJECT</h2>
                                    <p> Our capstone project is to identify accessible parking and reduce street-level accessibility problems using computer vision </p>
                                </div>

                                <div style={{background:'#F0EDEC'}} className={css.about_text}>
                                    <span className={css.img_container}>
                                    <img src="steps.png" alt="Olympic" style={{width:'70%'}}/>
                                    </span>
                                    <h2> <strong> Problem Statement</strong> </h2>
                                    <h3><strong> Problem 1: street-level accessibility problems </strong> </h3>
                                    <p> According to US Census (2010), there are 30.6 million individual have physical disabilities. Among these, nearly half of them are using an assistive aid such as wheelchair (3.6 million) or a cane, crutches, or walker (11.6 million). Many cities streets, sidewalks, and businesses in the US remain inaccessible. The problem here is obvious that sidewalk accessibility fundamentally affects where and how people travel in cities. Only few, if any, mechanisms to determin the accessible areas of a city needs. Based on the survey from Ntational Council of Disability, it couldn't find comprehensive information on the "degree to which sidewalks are accessible" across the US. Tranditionally, the sidewalk accessment was done via in-person street audits or via citizen call-in reports which is label intensive and costly. <br/>
                                    <h3> <strong> Problem 2: Accessible parking is not easy to find</strong> </h3>
                                    According to Accessible Parking Coalition website, 69% of people with disabilities have prolems finding accessible parking in their communities. 96% say parking availability is important to leading an independent life. 70% say their decision to drive or ride is influenced by parking availablity. 62% would like to drive or ride if parking was more available. 52% have decided not to make a trip because of concerns about finding parking. Clearly, accessible parking create a problem for disabled people. <br/>
                                    </p>
                                    <br />
                                    <h2> <strong> Mission and Vision Statment</strong> </h2>
                                    <p>Our mission is to help handicap people reduce street-level accessibility problems and find handicap parking easily.</p>
                                    <p> For our prototype product, we decided to plot Denver in the map.</p>
                                    <br />
                                    <h2> <strong>Gather Data </strong></h2>
                                    <p> We used ArcGIS Pro to get the street location in terms of latitude and longitude. After that we use Google Static Streetview API to download google streetview images. For model we used Denver Downtown area. In total we downloaded ~6000 images. For inference, we use the latitude/longitude outside Downtown area of Denver. In total we have over 200,000 images with the size larger than 10 GB. </p>
                                    <br />
                                    <h2> <strong>Modeling</strong> </h2>
                                    <p> We split the data into train/test/validation. Train vs. Test is 70/30 split. We experiemented with two models:(1) EfficientDet (2) yolo v5 and both with custome dataset using TRANSFER LEARNING  and leveraging the pre-train weight. The reason why we choose these two models is because they are relative small in size and have less parameters to train. For training, we use TensorFlow on Google Colab and extract the weights for inference. </p>
                                    <br />
                                    <h2> <strong>Inference </strong></h2>
                                    <p> Inference was conducted using the yolo v5 trained weights and detect objects on 200,000 images. The results are summarized in a csv file with object latitude, longitude, confidence leve, bounding box coordinates. We then use this cvs file to plot our visulization. </p>
                                    <br />
                                    <h2> <strong>Visualization</strong></h2>
                                    <br />
                                </div>
                            </div>
                            <div className={css.about_section}>
                                <h1 id="team">About Us</h1>
                                <p>We are group of data scientists who want to help the community</p>
                                <p>We are students from UC Berkeley - Department of Information Science </p>
                            </div>
                        </div>
                    }
                </div>
                
                </BaseProvider>
            </StyletronProvider>
            </div>
        );
    }
}

ReactDOM.render(<TheSite />, document.getElementById("root"));