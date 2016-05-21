import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { createComment } from '../utils';


export default class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    };
  }
  handleComment(event) {
    this.setState({
      comment: event.target.value
    });
  }

  commentSubmit() {
    const { auth } = this.props;
    createComment({content: this.state.comment, user_id: auth.user_id, plan_id: this.props.plan.id}, 
      (data) => console.log(data));
  }

  render() {
    const { auth } = this.props;
    return(
      <Card style={{marginLeft: 10, marginRight:10, marginBottom: 10}}>
        <div style={{marginLeft: 10, marginRight:10, marginBottom: 10}}>
          <TextField
            onChange={this.handleComment.bind(this)}
            placeholder="Add a comment"
            multiLine={true}
            fullWidth={true}
            disabled={!auth.isAuthenticated}
            rows={3} /><br />
          <FlatButton
            label="Submit"
            primary={true}
            disabled={this.state.comment.length < 1}
            onClick={this.commentSubmit.bind(this)} />
        </div>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(
  mapStateToProps
)(AddComment)