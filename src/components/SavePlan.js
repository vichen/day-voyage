import React, { Component } from 'react';
import { connect } from 'react-redux';
import { goToDashboard,
        getDashboardActivities } from '../actions';
import { getPlansByUser } from '../utils'
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';


export default class SavePlan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emails: [],
      emailDesc: null
    };
  }

  openModal() {
    this.props.toggleModal();
  }

  finishSharing() {
    this.props.toggleModal();
    getPlansByUser(this.props.auth.user_id, response => {
      console.log('finished sharing, heres the data: ', response.data);
      this.props.getDashboardActivities(response.data);
    });
    this.props.goToDashboard();
  }

  handleEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  selectShareTab() {
    this.setState({
      value: 'share'
    });
  }

  selectEmailTab() {
    this.setState({
      value: 'email'
    });
  }

  addEmail() {
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if (this.state.email === '' || !re.test(this.state.email)) {
      this.props.toggleSnackbar("Please enter a valid email");
    } else {
      var emailsArr = this.state.emails.slice();
      emailsArr.push(this.state.email.trim());
      this.setState({
        emails: emailsArr
      });
    }
  }

  removeEmail(email){
    var emailsArr = this.state.emails.slice();
    var index = this.state.emails.indexOf(email);
    emailsArr.splice(index);
    this.setState({
      emails: emailsArr
    });
  }

  handleDesc(event) {
    this.setState({
      emailDesc: event.target.value
    })
  }

  emailPlan() {
    const { planBuilder } = this.props;

    var bodyText = this.state.emailDesc + '%0D%0A%0D%0A' + planBuilder.map((item) => [item.title, item.address, item.city + ", " + item.state].join('%0D%0A') + '%0D%0A').join('%0D%0A');
    window.open(`mailto:${this.state.emails.join(',')}?subject=${this.props.planTitle}&body=${bodyText}`);
  }

  render() {
    const actions = [
        <FlatButton
          label="Thanks"
          primary={true}
          onClick={this.finishSharing.bind(this)}/>
      ];

    var shareURL = encodeURIComponent(`https://www.dayvoyage.com/?plan=${this.props.plan_id}`);

    return (
      <Dialog
        title="You have saved your plan!"
        modal={true}
        actions={actions}
        open={this.props.modalOpen}>
        <Tabs
          value={this.state.value}>
          <Tab
            value="share"
            label="SHARE"
            onClick={this.selectShareTab.bind(this)}>
            <div className="container">
              <div className="row">
                <h3>Share with your friends</h3>
                <span style={{color: "#808080"}}><h6>{`https://www.dayvoyage.com/?plan=${this.props.plan_id}`}</h6></span>
                <a target="_blank" href={ `https://www.facebook.com/sharer/sharer.php?u=` + shareURL }>Share plan through Facebook</a>
              </div>
            </div>
          </Tab>
          <Tab
            value="email"
            label="EMAIL"
            onClick={this.selectEmailTab.bind(this)}>
            <div className="container">
              <div className="row">
                <h3>Email your plan to your friends!</h3>
                <div className="col-sm-4">
                  <TextField
                    className="text-field"
                    id="send-field"
                    type="send"
                    onChange={this.handleEmail.bind(this)}
                    placeholder="Email"
                    style={{marginBottom: 15}} /><br />
                  <br />
                  <FlatButton
                    label="Add"
                    primary={true}
                    onClick={this.addEmail.bind(this)} />
                  <FlatButton
                    label="Email plan"
                    primary={true}
                    disabled={this.state.emails.length < 1}
                    onClick={this.emailPlan.bind(this)} />
                </div>
                <div className="col-sm-4" style={{marginTop: 15}}>
                  {this.state.emails.length > 0 ? <b>Emails Added<br /></b> : null}
                  {this.state.emails.length > 0 ? this.state.emails.map((email) => {
                    return <em onClick={this.removeEmail.bind(this, email)}>{email}<br/></em>
                  }) : null}
                  <br />
                  <TextField
                    onChange={this.handleDesc.bind(this)}
                    placeholder="Tell your friends about your plan!"
                    multiLine={true}
                    rows={3} />
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Dialog>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    planBuilder: state.planBuilder,
    auth: state.auth
  }
}
export default connect(
  mapStateToProps,
  { goToDashboard,
    getDashboardActivities }
)(SavePlan)
