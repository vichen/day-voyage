import React, { Component } from 'react';
import { GoogleMapLoader, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";
import { changingRoutes } from '../actions';
import { connect } from 'react-redux';

export default class Maps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: null 
    };
  }

  componentDidMount() {
    const { planBuilder } = this.props;
    if (planBuilder.length > 0) {
      changingRoutes(planBuilder);
    }
  }

  render() {
    const { directions, activities, dbactivities } = this.props;
    var centerLat = 37.7749;
    var centerLng = -122.4194;
    var markers = [];

    var allActivities = activities.concat(dbactivities);

    if (activities.length > 0) {
      centerLat = activities.map((item) => item.lat).reduce((a, b) => a + b)/activities.length;
      centerLng = activities.map((item) => item.long).reduce((a, b) => a + b)/activities.length;
      markers = allActivities.map(function(item) {
        return {position: {lat: parseFloat(item.lat), lng: parseFloat(item.long) }, title: item.title, icon: item.icon, added: item.added, visible: item.visArea && item.visCategory && item.visBudget };
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
                  {markers.map((marker, index) => {
                    if (!marker.added && marker.visible) {
                      return (
                        <Marker
                          key={ index }
                          title={ marker.title }
                          icon={ marker.icon }
                          {...marker} />
                      );
                      
                    } else {
                      return;
                    }
                  })}
                  { directions && !this.props.lat ? <DirectionsRenderer directions={directions} /> : null}
              </GoogleMap>
            }
          />
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    planBuilder: state.planBuilder,
    directions: state.directions,
    activities: state.activities,
    dbactivities: state.dbactivities
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

export default connect(
  mapStateToProps,
  { changingRoutes }
)(Maps)