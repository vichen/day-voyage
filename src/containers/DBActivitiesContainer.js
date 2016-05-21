import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addToBuilder, 
        saveActivityToDb } from '../actions';
import { Card, CardText } from 'material-ui/Card';
import ActivityItem from '../components/ActivityItem';

var shortid = require('shortid');


class DBActivitiesContainer extends Component {
  render() {
    const { dbactivities, auth } = this.props;
    console.log('dbActivities in DBActivitiesContainer', dbactivities);
    const hasdbActivities = dbactivities.length > 0;
    if (hasdbActivities && dbactivities[0].distance) {
      dbactivities.sort((a, b) => parseFloat(a.distance) > parseFloat(b.distance));
    }
    return (
      <div>
        <Card style={cardColumnStyle}>
          {!hasdbActivities ? 
            <CardText>
              <em>0 search results</em>
            </CardText> :
            dbactivities.map((activity, index) => {
              if (activity.visArea && activity.visCategory && activity.visBudget) {
                return <ActivityItem
                  key={index}
                  activity={activity}
                  openSnackbar={this.props.openSnackbar}
                  onAddToBuilderClicked={() => {
                    this.props.addToBuilder(activity);
                    this.props.saveActivityToDb(Object.assign(activity, {
                      isYelp: false,
                      user_gen: false,
                      clientside_id: shortid.generate()
                    }), auth.token.access_token);
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

DBActivitiesContainer.propTypes = {
  dbactivities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    city: PropTypes.string
  })).isRequired,
  addToBuilder: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    dbactivities: state.dbactivities,
    auth: state.auth
  }
}

export default connect(
  mapStateToProps,
  { addToBuilder,
    saveActivityToDb }
)(DBActivitiesContainer)