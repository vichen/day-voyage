import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteFromDashboard } from '../actions'
import { getPlansByUser,
        getPlan } from '../utils';
import DashboardPlanItem from '../components/DashboardPlanItem';
import { Card } from 'material-ui/Card';



export class DashboardView extends React.Component {

  render() {
    const { data, auth, dashboard } = this.props;
    return (
      <div>
        <div>
          <h1>Welcome, {auth.username}</h1>
          <h3>Itineraries</h3>
          {dashboard.length > 0 ? '' : 'You don\'t have any itineraries, create one now!'}
          <Card>
          {dashboard.map((item, index) => {
            return <DashboardPlanItem
              key={index}
              title={item.title}
              desc={item.desc}
              plan_id={item.id}
              onDeleteClicked={() => {
                this.props.deleteFromDashboard(index);
              }}
              activities={item.activities} />
          })}
          </Card>
        </div>
      </div>
    );
  }
}



const mapStateToProps = (state) => ({
  data: state.data.data,
  isFetching: state.data.isFetching,
  auth: state.auth,
  dashboard: state.dashboard
});

// const mapDispatchToProps = (dispatch) => ({
//   actions: bindActionCreators(actionCreators, dispatch),
// });

export default connect(
  mapStateToProps,
  { deleteFromDashboard }
  )(DashboardView);

