import React from 'react';
import ReactDOM from 'react-dom';
import css from 'style.scss';
import GoogleMapReact from 'google-map-react';
// import Icon from '@material-ui/core/Icon';

//npm install google-map-react
// npm install @material-ui/core
// npm install @material-ui/icons
// AIzaSyDSqApHsSdl6Nv7eQrgN8Z3nLWStEGwUJM

const AnyReactComponent = ({ text }) => <div style={{color:'red'}}>{text}</div>;
 
class TheSite extends React.Component {
    //declare intial state vars
    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {
        center: {
        lat: 39.7392,
        lng: -105.0201
        },
        zoom: 15
    };

    render() {
        return (
            <div style={{padding:'35px'}}>
                <div style={{ padding:'35px'}}>Accessible Parking Denver</div>
                <div style={{ padding:'35px'}}>
                To add - snazzy header. 2 Tabs - one w map, one w project info. 
                Center using geolocation api. Get array of points from flask call.
                Plot as icon instead of text.
                Maybe clicking on an icon shows the street view image where we found it?
                Way to qc model.
                </div>
                <div style={{ height: '100vh', width: '100%', padding: '35px' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: 'AIzaSyDSqApHsSdl6Nv7eQrgN8Z3nLWStEGwUJM' }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                    >
                    {/* <Icon color='blue'
                        lat={39.7439}
                        lng={-105.0201}>
                        'accessible'
                    </Icon> */}
                    <AnyReactComponent
                        lat={39.7439}
                        lng={-105.0201}
                        text="Coors Stadium!"
                    />
                    </GoogleMapReact>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<TheSite />, document.getElementById("root"));