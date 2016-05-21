import React, { Component } from 'react';
import { connect } from 'react-redux';
import DBActivitiesContainer from '../containers/DBActivitiesContainer';
import DBPlansContainer from '../containers/DBPlansContainer';
import ActivitiesContainer from '../containers/ActivitiesContainer';
import FilterContainer from '../containers/FilterContainer';
import PlanBuilderContainer from '../containers/PlanBuilderContainer';
import Snackbar from 'material-ui/Snackbar';
import Search from '../components/Search';
import {Tabs, Tab} from 'material-ui/Tabs';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import MapsMap from 'material-ui/svg-icons/maps/map';
import NavigationMoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';

export class ActivitiesView extends Component {
   constructor(props) {
    super(props);
    this.state = {
      snackbar: false,
      message: '',
      value: 'a'
    };
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
      <div className="activities">
        <div className="row activities__toolbar">
          <FilterContainer />
          <Search />
        </div>
        <div className="row" style={{marginTop: 20}}>
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
                label="PLANS"
                onClick={this.handleChangeB.bind(this)}>
                <DBPlansContainer
                  openSnackbar={this.initiateSnackbar.bind(this)} />
              </Tab>
              <Tab
                value="c"
                icon={<NavigationMoreHoriz />}
                label="MORE IDEAS"
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
    planBuilder: state.planBuilder
  }
}

export default connect(
  mapStateToProps,
)(ActivitiesView);