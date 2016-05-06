import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addToBuilder } from '../../redux/actions'
import { getActivities } from '../../redux/reducers/activities.js'
import ActivityItem from './ActivityItem'
import ActivitiesList from './ActivitiesList'

class ActivitiesContainer extends Component {
  render() {
    const { activities } = this.props
    return (
      <div className="col-md-4">
        <ActivitiesList title="Activities">
          {activities.map(activity =>
            <ActivityItem
              key={activity.title}
              activity={activity}
              onAddToBuilderClicked={() => this.props.addToBuilder(activity.title)} />
          )}
        </ActivitiesList>
      </div> 
    )
  }
}

ActivitiesContainer.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    // categories: PropTypes.array.isRequired,
    city: PropTypes.string.isRequired,
    added: PropTypes.bool.isRequired
  })).isRequired,
  addToBuilder: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    activities: state.activities
  }
}

export default connect(
  mapStateToProps,
  { addToBuilder }
)(ActivitiesContainer)