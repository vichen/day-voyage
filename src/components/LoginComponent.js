import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';


export class LoginComponent extends Component {
  constructor(props) {
    super(props);
    // console.log('>>>>>  prop in login modal:', props);
    const { router } = props;
    const redirectRoute = router.location.query.next || router.location.pathName;
    this.state = {
      username: '',
      password: '',
      email: '',
      redirectTo: redirectRoute,
      open: false,
      value: 'login'
    };
  }

  selectLoginTab() {
    this.setState({
      value: 'login'
    });
  }

  selectSignupTab() {
    this.setState({
      value: 'signup'
    });
  }

  toggleOpen () {
    this.setState({open: !this.state.open});
  }

  handleSubmit (e) {
    e.preventDefault();
    if (this.state.value === 'login') {
     this.props.actions.loginUser(this.state.username, this.state.password, this.props.openSnackbar);
   } else if (this.state.value === 'signup') {
     this.props.actions.signUpUser(this.state.username, this.state.password, this.state.email, this.props.openSnackbar);
   }
    this.toggleOpen();
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  render() {
    const actions = [
          <FlatButton
            label="Cancel"
            onClick={this.toggleOpen.bind(this)}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            // disabled={true}
            onClick={this.handleSubmit.bind(this)}
          />,
        ];

    return (
      <div>
        <div>
          <FlatButton label="Login" onClick={this.toggleOpen.bind(this)} />
          <Dialog
            title="Come in"
            actions={actions}
            modal={true}
            open={this.state.open}
            >
            <Tabs
              value={this.state.value}>
              <Tab
                value="login"
                label="LOGIN"
                onClick={this.selectLoginTab.bind(this)}>
                  <TextField
                    className="text-field"
                    id="username-field"
                    type="text"
                    onChange={this.handleUsernameChange.bind(this)}
                    placeholder="username"
                    style={{
                      marginBottom: 15,
                      marginTop: 30
                    }} />
                  <br />
                  <TextField
                    className="text-field"
                    id="password-field"
                    type="password"
                    onChange={this.handlePasswordChange.bind(this)}
                    placeholder="password"
                    style={{marginBottom: 15}} />
              </Tab>
              <Tab
                value="signup"
                label="SIGNUP"
                onClick={this.selectSignupTab.bind(this)}>
                  <TextField
                    className="text-field"
                    id="username-field"
                    type="text"
                    onChange={this.handleUsernameChange.bind(this)}
                    placeholder="username"
                    style={{
                      marginBottom: 15,
                      marginTop: 30
                    }} />
                  <br />
                  <TextField
                    className="text-field"
                    id="email-field"
                    type="text"
                    onChange={this.handleEmailChange.bind(this)}
                    placeholder="email"
                    style={{marginBottom: 15}} />
                  <br />
                  <TextField
                    className="text-field"
                    id="password-field"
                    type="password"
                    onChange={this.handlePasswordChange.bind(this)}
                    placeholder="password"
                    style={{marginBottom: 15}} />
                  <span style={{color: "#808080"}}><h6>Password must be at least 5 characters</h6></span>
              </Tab>
            </Tabs>
          </Dialog>
        </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticating: state.auth.isAuthenticating,
  statusText: state.auth.statusText,
  router: state.router,
  isSigningUp: state.auth.isSigningUp,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);
