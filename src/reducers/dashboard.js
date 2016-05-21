// import { createReducer } from '../utils';
import {
  DASHBOARD_RECEIVE,
  DASHBOARD_DELETE,
  RECEIVE_ROUTES
} from '../constants';


export default function dashboard(state = [], action) {
  switch (action.type) {
    case DASHBOARD_RECEIVE:
      console.log('here at dashboard receive');
      return action.dashboard;
    case DASHBOARD_DELETE:
      var newState = state.slice();
      newState.splice(action.planIndex, 1);
      return newState;
    default:
      return state;
  }
}


