import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';

export default class PlanItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descOpen: false
    };
  }

  toggleDesc() {
    this.setState({
      descOpen: !this.state.descOpen
    });
  }

  render() {
    const { activity, order } = this.props;
    var title = order + '   ' + activity.title;
    return (
      <Card style={{marginLeft: 10, marginRight:10, marginBottom: 10}}>
        <CardHeader
          title={title}
          subtitle={activity.neighborhood ? activity.neighborhood.join(', ') : ''}
          onClick={this.toggleDesc.bind(this)}
          actAsExpander={true}
          showExpandableButton={true} />
        {this.state.descOpen ? <CardText><strong>Address:</strong><br />{activity.address}<br />{activity.city}, {activity.state}<br /><br />{activity.desc}</CardText> : null}
      </Card>
    )
  }
}