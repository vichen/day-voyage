import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavContainer from '../containers/NavContainer';
import PlanContainer from '../containers/PlanContainer';
import Snackbar from 'material-ui/Snackbar';
import { getPlan } from '../utils';

export default class CoreLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: false,
      message: '',
      plan: null
    };
  }

  componentWillMount() {
    if (this.props.children.props.location.query.plan) {
      var plan_id = this.props.children.props.location.query.plan;
      getPlan(plan_id, (results) => {
        console.log(results);
        this.setState({
          plan: results.data[0]
        });
      });
    }
  }

  initiateSnackbar(message) {
    this.setState({message: message, snackbar: true});
    var that = this;
    setTimeout(() => this.setState({snackbar: false}), 2000)
  }

  render () {
    var planExists = this.props.children.props.location.query.plan;
    var plan = this.props.children.props.location.query.plan ? <PlanContainer plan={this.state.plan}/> : null;

    const {dispatch} = this.props;
    return (
      <div>
        <NavContainer
          openSnackbar={this.initiateSnackbar.bind(this)}/>
        {plan}
        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          autoHideDuration={2000} />
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              {planExists ? null : this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}