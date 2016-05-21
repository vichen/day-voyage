import React, { Component } from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';

export default class CommentItem extends Component {

  render() {
    const comment = this.props.comment;
    const dateArr = comment.created_at.split('T');
    const date = dateArr[0];
    const time = dateArr[1].split('.')[0];

    return(
      <Card style={{marginLeft: 10, marginRight:10, marginBottom: 10}}>
        <CardHeader
          title={comment.user.username}
          subtitle={[date, time].join(' ')} />
        <CardText>{comment.content}</CardText>
      </Card>
    )
  }
}