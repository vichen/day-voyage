import React, { Component } from 'react';
import Maps from '../components/Maps';
import ConfirmContainer from '../containers/ConfirmContainer';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import { Card, CardText } from 'material-ui/Card';
import { connect } from 'react-redux';

export class ConfirmView extends Component {

   constructor(props) {
    super(props);
    this.state = {
      snackbar: false,
      message: '',
      planTitle: '',
      description: '',
    };
  }

  handleTitle(event) {
    this.setState({planTitle: event.target.value});
  }

  handleDesc(event){
    this.setState({
      description: event.target.value
    })
  }

  initiateSnackbar(message) {
    this.setState({message: message, snackbar: true});
    var that = this;
    setTimeout(function() {
      that.setState({snackbar: false});
    }, 2000);
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <Maps size="small" /> <br />
            <Card style={{padding: 30}}>
            <div>
              <h4 style={{padding: 0}}>Plan Name: </h4>
              <TextField
                onChange={this.handleTitle.bind(this)}/><br />
              <h4 style={{padding: 0}}>Plan Description: </h4>
              <TextField
                onChange={this.handleDesc.bind(this)}
                multiLine={true}
                rows={4}
              /><br />
            </div>
            </Card>
          </div>
          <div className="col-sm-6">
            <ConfirmContainer 
              openSnackbar={this.initiateSnackbar.bind(this)}
              planTitle={this.state.planTitle}
              planDesc={this.state.description}/>
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
    planBuilder: state.planBuilder
  }
}

export default connect(
  mapStateToProps,
)(ConfirmView);