import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardHeader} from 'material-ui/Card';

export default class DBPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descOpen: false
    };
  }

  openLink() {
    const { plan } = this.props;
    window.open(`https://www.dayvoyage.com/?plan=${plan.id}`, 'blank');
  }

  render() {
    const { plan } = this.props;
    var title = plan.title;
    return (
      <Card style={{marginLeft: 10, marginRight:10, marginBottom: 10}}>
        <CardHeader
          title={plan.title}
          subtitle={plan.desc}
          actAsExpander={true}/>
        <FlatButton
          onClick={this.openLink.bind(this)}
          label="View More Details" />
        <FlatButton
          onClick={this.props.onAddToBuilderClicked}
          label="Copy" />
      </Card>
    )
  }
}
