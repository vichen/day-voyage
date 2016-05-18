import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToBuilder } from '../actions'
import DBActivitiesContainer from '../containers/DBActivitiesContainer';
import DBPlansContainer from '../containers/DBPlansContainer';
import ActivitiesContainer from '../containers/ActivitiesContainer';
import FilterContainer from '../containers/FilterContainer';
import PlanBuilderContainer from '../containers/PlanBuilderContainer';
import CreateActivity from '../components/CreateActivity';
import Snackbar from 'material-ui/Snackbar';
import Search from '../components/Search';
import { isLoggedIn } from '../utils';


import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';

import MapsPlace from 'material-ui/svg-icons/maps/place';
import MapsMap from 'material-ui/svg-icons/maps/map';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';


export class ActivitiesView extends Component {
   constructor(props) {
    super(props);
    this.state = {
      snackbar: false,
      modalOpen: false,
      message: '',
      value: 'a'
    };
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  openCreate() {
    if (!!isLoggedIn()) {
      this.toggleModal();
    } else {
      this.props.openSnackbar("Please sign in or create a profile to continue");
    }
  }

  initiateSnackbar(message) {
    this.setState({message: message, snackbar: true});
    var that = this;
    setTimeout(function() {
      that.setState({snackbar: false});
    }, 2000);
  }

  handleChangeA(value) {
     this.setState({
       value: 'a',
     });
   };

  handleChangeB(value) {
     this.setState({
       value: 'b',
     });
   };

   handleChangeC(value) {
      this.setState({
        value: 'c',
      });
    };

  render() {
    return (
      <div className="activity">
        <div className="row">
          <div className="col-sm-12 activity__top-actions">
            <Search />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <FlatButton
              label="Create Activity"
              style={{marginTop: 18}}
              onClick={this.openCreate.bind(this)} />
            <CreateActivity
              modal={this.state.modalOpen}
              toggleModal={this.toggleModal.bind(this)}
              openSnackbar={this.props.openSnackbar}
              addFromCreate={(activity) => this.props.addToBuilder(activity)}
              user_id={this.props.auth.user_id}/>
            <FilterContainer />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <Tabs 
              value={this.state.value}>
             <Tab 
                value="a"
                icon={<MapsPlace />}
                label="PLACES"
                onClick={this.handleChangeA.bind(this)}>
                <DBActivitiesContainer 
                  openSnackbar={this.initiateSnackbar.bind(this)} />
              </Tab>
              <Tab
                value="b"
                icon={<MapsMap />}
                label="Plans"
                onClick={this.handleChangeB.bind(this)}>
                <DBPlansContainer
                  openSnackbar={this.initiateSnackbar.bind(this)} />
              </Tab>
              <Tab
                value="c"
                icon={<ActionFavoriteBorder />}
                label="YELP SEARCH"
                onClick={this.handleChangeC.bind(this)}>
                <ActivitiesContainer
                  openSnackbar={this.initiateSnackbar.bind(this)} />
              </Tab>
            </Tabs>
          </div>
          <div className="col-sm-6">
            <PlanBuilderContainer
              openSnackbar={this.initiateSnackbar.bind(this)} />
            <Snackbar
              open={this.state.snackbar}
              message={this.state.message}
              autoHideDuration={2000} />
          </div>
       </div>
     </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activities: state.activities,
    planBuilder: state.planBuilder,
    auth: state.auth
  }
}

export default connect(
  mapStateToProps,
  { addToBuilder }
)(ActivitiesView);
