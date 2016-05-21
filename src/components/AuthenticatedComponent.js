import React from 'react';
import {connect} from 'react-redux';
import {push} from 'redux-router';

export function requireAuthentication(Component) {

  class AuthenticatedComponent extends React.Component {

    componentWillMount () {
      this.checkAuth(this.props.isAuthenticated);
    }

    componentWillReceiveProps (nextProps) {
      this.checkAuth(nextProps.isAuthenticated);
    }

    checkAuth (isAuthenticated) {
      console.log('props from auth comp', this.props);
      if (!isAuthenticated) {
        let redirectAfterLogin = this.props.location.pathname;
        this.props
          .dispatch(push(`/?next=${redirectAfterLogin}`));
      }
    }

    render () {
      return (
        <div>
          {this.props.isAuthenticated === true
            ? <Component {...this.props}/>
            : null
          }
        </div>
      )

    }
  }

  const mapStateToProps = (state) => ({
    token: state.auth.token,
    userName: state.auth.user_id,
    isAuthenticated: state.auth.isAuthenticated
  });

  return connect(mapStateToProps)(AuthenticatedComponent);

}
