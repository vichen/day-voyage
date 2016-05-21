import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {logoutAndRedirect,
        getDashboardActivities,
        goToDashboard } from '../actions';
import { getPlansByUser } from '../utils'
import LoginComponent from '../components/LoginComponent';
import FlatButton from 'material-ui/FlatButton';
import { push } from 'redux-router';

@connect((state) => {
  return {
   isAuthenticated: state.auth.isAuthenticated,
  };
})

export default class CoreLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: 'false'
    };
  }

  toggleModal () {
    this.setState({
      'modalOpen': !this.state.modalOpen
    });
  }

  handleDashboard() {
    getPlansByUser(this.props.auth.user_id, response => {
      this.props.getDashboardActivities(response.data);
    });
    this.props.goToDashboard();
  }

  render () {
    const {dispatch} = this.props;
    return (
      <nav className="app-navbar">
        <div className="app-navbar__header">
            <Link className="app-title" to="/"><img style={{height: '30%', width: '30%'}} src="http://s32.postimg.org/i33xfbc05/dayvoyage.png"/></Link>
        </div>
        <div className="app-navbar__actions">
          {this.props.isAuthenticated
            ?
              <span>
                <FlatButton
                  label="Activities"
                  onClick={() => this.props.dispatch(push('/activities'))}
                />
                <FlatButton
                  label="Dashboard"
                  onClick={this.handleDashboard.bind(this)}
                />
                <FlatButton
                  label="Logout"
                  secondary={true}
                  style={{color: "#eb6157"}}
                  onClick={() => this.props.dispatch(logoutAndRedirect(this.props.openSnackbar))}
                />
              </span>
            :
              <span>
                <LoginComponent
                  modal={this.state.modalOpen}
                  toggleModal={this.toggleModal.bind(this)}
                  openSnackbar={this.props.openSnackbar}
                />
              </span>
          }
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  dashboard: state.dashboard
});

// const mapDispatchToProps = (dispatch) => ({
//   actions: bindActionCreators(actionCreators, dispatch),
// });

export default connect(
  mapStateToProps,
  { logoutAndRedirect,
    getDashboardActivities,
    goToDashboard }
  )(CoreLayout);
