import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';



/**
* template for individual activity items, 'dumb' child component of Activity
*/
export default class DashboardActivityItem extends Component {
  constructor(props) {
    super(props);

    /**
     * @type {object}
     * @property {boolean} buttonClicked triggers addToBuilder and openSnackbar
     * in ActivityContainer
     * @property {boolean} descOpen toggles card expansion
     */
    this.state = {
      buttonClicked: false,
      descOpen: false
    };
  }

  clickAddButton() {
    this.setState({
      buttonClicked: !this.state.buttonClicked
    });
    this.props.onAddToBuilderClicked();
    this.props.openSnackbar("Event has been added to your plan");
  }

  toggleDesc() {
    this.setState({
      descOpen: !this.state.descOpen
    });
  }

  render() {
    const { activity } = this.props;
    var title = activity.distance ? activity.title + ' - ' + activity.distance + " away" : activity.title;
    return (
      <Card className="item-card" style={{marginLeft: 10, marginRight:10, marginBottom: 10, cursor: 'pointer'}}>
        <div className="card-content">
        <CardHeader
          title={title}
          subtitle={activity.neighborhood ? activity.neighborhood.join(', ') : ''}
          onClick={this.toggleDesc.bind(this)}
          actAsExpander={true}
          showExpandableButton={true}
        />
        {this.state.descOpen ? 
          <CardText>
            <strong>Address:</strong><br />
            {activity.address}<br />
            {activity.city}, {activity.state}<br /><br />
            {activity.desc}
          </CardText> : null}
        </div>
        <div>
        <CardActions>
          <IconButton 
            tooltip="Add to plan"
            onClick={this.clickAddButton.bind(this)}
            disabled={activity.added ? true : false}
            label={activity.added ? 'Added' : ''}>
            <ContentAdd />
          </IconButton>
        </CardActions>
        </div>
      </Card>
    )
  }
}


const customContentStyle = {
  width: '60%',
  maxWidth: 'none'
};
