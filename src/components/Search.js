import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';

export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      city: "San Francisco, CA",
      lat: null,
      lng: null,
      location: null,
      geolocation: true
    };
  }

  componentDidMount() {
    var that = this;
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      that.setState({
        lat: lat,
        lng: lng
      });
    }, (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        that.setState({
          geolocation: false
        });
      }
    });
  }


  searchActivities(event) {
    event.preventDefault();
    // if doing search by geolocation...
    if (this.state.location) {
      // use reverse geocoding to change our location to city name
      var latLng = [this.state.lat,this.state.lng].join(',');
      fetch(`/api/reversegeocode?location=${latLng}`, {
        method: 'GET'
      })
      .then((cityData) => cityData.json())
      .then((cityInfo) => {
        var city = cityInfo.formatted_address.split(", ")[1];
        // run redux action getAllActivities with our geolocation city, category, and current location (lat and lng)
        this.props.actions.getAllActivities({city: city, category: this.state.category}, this.state.location);
      });
      // otherwise run redux action getAllActivities with typed in city and category
    } else {
      this.props.actions.getAllActivities({city: this.state.city, category: this.state.category}, null);
    }
  }

  handleCategory(event) {
    this.setState({category: event.target.value});
  }

  handleCity(event){
    this.setState({city: event.target.value});
  }

  checkBox() {
    setTimeout(function() {
      var set = !this.state.location ? {lat: this.state.lat, lng: this.state.lng} : null;
        this.setState({
          location: set
        });
    }.bind(this), 0
    );
  }


  testing() {
    this.props.actions.testPlan();
  }

  triggerAPItest() {
    console.log('triggering API test');
    this.props.actions.createPlan({desc: 'Whodat fun'}, [{id: 19}]);
  }

  render() {
    var spinner = this.state.lat ?
      <Checkbox
        label="Use Current Location"
        labelPosition="left"
        style={{maxWidth: 200}}
        onCheck={this.checkBox.bind(this)} />: <CircularProgress />
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <form style={{textAlign: "center", marginTop: 25}} className="commentForm" onSubmit={this.searchActivities.bind(this)}>
              <TextField
                id="text-field-controlled"
                type="text"
                value={this.state.value}
                placeholder="Activities, Restaurants, or Places"
                style={{marginBottom: 25}}
                onChange={this.handleCategory.bind(this)} />
              {!this.state.location ? <span>  in  </span> : null}
              {!this.state.location ? <TextField
                id="text-field-controlled"
                type="text"
                value={this.state.city}
                defaultValue={this.state.city}
                style={{marginBottom: 25}}
                onChange={this.handleCity.bind(this)} /> : null}
              <FlatButton label="Search" onClick={this.searchActivities.bind(this)}/>
            </form>
          </div>
        </div>
        <button onClick={this.triggerAPItest.bind(this)}>test API</button>
        <div className="row">
          <div className="col-sm-5">
          <button onClick={this.testing.bind(this)}>TEST BUTTON</button>
          </div>
          <div className="col-sm-2">
            {this.state.geolocation ? spinner : null}
          </div>
          <div className="col-sm-5">
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
