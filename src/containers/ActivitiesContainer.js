import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addToBuilder } from '../actions';
import ActivityItem from '../components/ActivityItem';
import { Card, CardText } from 'material-ui/Card';


class ActivitiesContainer extends Component {
  render() {
    const { activities, auth } = this.props;
    const hasActivities = activities.length > 0;
    if (hasActivities && activities[0].distance) {
      activities.sort((a, b) => parseFloat(a.distance) > parseFloat(b.distance));
    }
    return (
      <div>
        <Card style={cardColumnStyle}>
        <h3 style={{marginLeft: 15}}>Yelp Results</h3>
          {!hasActivities ? 
            <CardText>
              <em>0 search results</em>
            </CardText> :
            activities.map((activity, index) => {
              if (activity.visArea && activity.visCategory && activity.visBudget) {
                return <ActivityItem
                  key={index}
                  activity={activity}
                  openSnackbar={this.props.openSnackbar}
                  onAddToBuilderClicked={() => {
                    this.props.addToBuilder(activity);
                  }}/>
              }
          })}
        </Card>
      </div>
    )
  }
}

var cardColumnStyle = {
 paddingTop: 15,
 paddingBottom: 15,
 paddingLeft: 15,
 paddingRight: 15
};

ActivitiesContainer.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    city: PropTypes.string
  })).isRequired,
  addToBuilder: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    activities: state.activities,
    auth: state.auth
  }
}

export default connect(
  mapStateToProps,
  { addToBuilder }
)(ActivitiesContainer)