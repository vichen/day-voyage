import React, { Component } from 'react';
import { GoogleMapLoader, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";

export default class PlanMaps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null
    };
  }

  render() {
    var centerLat = 37.7749;
    var centerLng = -122.4194;
    if (this.props.activities) {
      const DirectionsService = new google.maps.DirectionsService();
      var places = this.props.activities.map(function(item) {
        return {position: {location: {lat: parseFloat(item.lat), lng: parseFloat(item.long) }}, icon: item.icon};
      });

      var that = this;
      DirectionsService.route(
        {
          origin: places[0].position,
          destination: places[places.length-1].position,
          waypoints: places.slice(1,-1).map((item) => item.position),
          optimizeWaypoints: false,
          travelMode: google.maps.TravelMode.WALKING,
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            that.setState({
              directions: result
            });
          } else {
            console.error(`error fetching directions ${ result }`);
          }
      });
    }

    return (
      <div>
        <section style={styles[this.props.size].mapSize}>
          <GoogleMapLoader
            containerElement={
              <div
                {...this.props}
                style={styles[this.props.size].mapPosition}
              />
            }
            googleMapElement={
              <GoogleMap
                defaultZoom={12}
                defaultCenter={{lat: centerLat, lng: centerLng}}>
                  { this.state.directions ? <DirectionsRenderer directions={this.state.directions} /> : null}
              </GoogleMap>
            }
          />
        </section>
      </div>
    );
  }
}


var styles = {
  large: {
    mapSize: {
      height: "500px",
      // width: "500px"
    },
    mapPosition: {
      height: "100%",
      width: "100%",
      position: "absolute"
    },
    divClass: "col-sm-8"
  },
  small: {
    mapSize: {
      height: "400px",
      // width: "650px"
    },
    mapPosition: {
      height: "100%",
      width: "100%"
      // position: "absolute"
    },
    divClass: "col-sm-4"
  }
}