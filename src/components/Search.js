import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import Checkbox from 'material-ui/Checkbox';
import LinearProgress from 'material-ui/LinearProgress';
import ActionSearch from 'material-ui/svg-icons/action/search';
import * as utils from '../utils';


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
    this.setState({category: event});
  }

  handleCity(event){
    this.setState({city: event});
  }

  checkBox() {
    setTimeout(function() {
      var set = !this.state.location ? {lat: this.state.lat, lng: this.state.lng} : null;
        this.setState({
          location: set,
        });
    }.bind(this), 0
    );
  }

  testing() {
    this.props.actions.testPlan();
  }

  triggerAPItest() {
    console.log('triggering API test');

    // utils.searchActivities('a', 'san francisco, wassh', activities => console.log('activity matches are',activities));

    // utils.searchPlans('d', 'san francisco', plans => console.log('plan matches are',plans));


    // utils.createPlan({desc: 'Ow ow sweaty figs corner office', 'title': 'what you know about titles wanted'}, [{activity_id: 10, title: 'watermelon'}], response => console.log('Posted it!', response));

    // utils.getPlansByUser(11, result => console.log(result));

    // utils.getActivitiesByUser(2, (result) => console.log(result));

    // utils.updateActivity(2, {duration: 100});

    // utils.updatePlan(2, {desc: `Now that's what I call a description`, title: 'Afternoon delight'});

    // utils.updateUser(2, {username: 'Iamsam'});

    // utils.getActivitiesByPlan(8, activities => console.log(activities));

    utils.deleteActivity(13, (result) => console.log(result));

    // utils.updatePlan(2, {title: 'oh please'},[{activity_id: 3, title:'do it to meybabt'}, {activity_id: 4, title:'DA BOMB', desc: 'a man walks to a church, ha'}], result => console.log(result));

    // utils.getPlan(2, (result) => console.log(result));

    // utils.getPlan(8, (result) => console.log(result));


    // utils.getAllPlans(plans => console.log(plans));

    // utils.queryTable('activities', {user_gen: true, city: 'San Francisco', 'title': 'heaven'}, (result) => console.log(result));
    
    // utils.deletePlan(8, (plan) => console.log(plan));

    // utils.getComments('user', 4, comment => console.log(comment));

    // utils.getComments('activity', 3, comment => console.log(comment));

    // utils.createComment({
    //   content: 'Yo momma so fat... she got up from the couch and the decks on the bay bridge collapsed',
    //   user_id: 3,
    //   plan_id: 5
    // }, (result) => console.log('result', result));

  }

  render() {

    var spinner = this.state.lat ?
      <Checkbox
        label="Use current location"
        iconStyle={checkboxIconStyle}
        labelStyle={checkboxLabelStyle}
        onCheck={this.checkBox.bind(this)} /> :
        <div>
          getting your current location... <br />
          <LinearProgress
            mode="indeterminate"
            color={"#FF9800"}
            style={{width: 100}}/>
        </div>

    return (
      <div className="search">
        <form className="search-form" onSubmit={this.searchActivities.bind(this)}>
          <div className="search-form__inputs">
            <ActionSearch className="search-icon hidden-xs" />
            <AutoComplete
              floatingLabelText="Activities, Restaurants, or Places"
              fullWidth={true}
              style={{flex: '1 1 300px'}}
              className="search-form__activity-input"
              filter={AutoComplete.fuzzyFilter}
              dataSource={catSearch}
              maxSearchResults={6}
              value={this.state.value}
              onUpdateInput={this.handleCategory.bind(this)} />
            <div className="search-form__separator hidden-xs">in</div>
            <AutoComplete
              floatingLabelText="City"
              fullWidth={true}
              style={{width: '300px'}}
              className="search-form__activity-input"
              filter={AutoComplete.fuzzyFilter}
              dataSource={citySearch}
              maxSearchResults={3}
              value={this.state.city}
              disabled={this.state.location}
              onUpdateInput={this.handleCity.bind(this)} />
            <FlatButton className="search-btn" type="submit" label="Search" style={{marginLeft: 16}} />
          </div>
          <div className="search__location-checkbox">
            { spinner }
          </div>
        </form>
        <div className="search__call-to-action">
          <RaisedButton primary="true" className="search-btn" label="Start Planning Your Trip" onClick={this.searchActivities.bind(this)}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

const checkboxIconStyle = {
  // fill: '#424242'
};

const checkboxLabelStyle = {
  color: '#424242',
  'fontWeight': 'normal'
}

const catSearch = ['Active', 'Arts & Entertainment', 'Food', 'Nightlife', 'Personal', 'Shopping'];
const citySearch = ['San Francisco', 'Oakland', 'San Jose'];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
