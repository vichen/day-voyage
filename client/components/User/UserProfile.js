import React, { Component, PropTypes } from 'react'

// username - cannot update
// first name
// last name
// email

export default class UserProfile extends Component {
  constructor(props) {
      super(props);

      this.state = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email'
      };
    }
  render() {


    return (
      <div>
        
      </div>
    )
  }
}