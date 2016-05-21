import { createReducer } from '../utils';
import {
  ADD_TO_BUILDER,
  DELETE_FROM_BUILDER,
  REORDER_UP,
  REORDER_DOWN,
  EDIT_DESC,
  EDIT_PRICE,
  SAVE_ACTIVITY_CONFIRM,
  DELETE_ACTIVITY_CONFIRM,
  SAVE_PLAN_CONFIRM,
  QUERY_DB
} from '../constants'
import {
  changingRoutes
} from '../actions'

// const initialState = {
//   activities: [],
// };

export default function planBuilder(state = [], action) {
  switch (action.type) {
    case ADD_TO_BUILDER:
      var newState = state.slice();
      newState.push(action.activity);
      changingRoutes(newState);
      return newState;
    case DELETE_FROM_BUILDER:
      var newState = state.slice();
      var activityIndex = state.indexOf(action.activity);
      newState.splice(activityIndex, 1);
      if (newState.length > 0) {

        changingRoutes(newState);
      }
      return newState;
    case REORDER_UP:
      if (action.activityIndex === 0) {
        return state;
      } else {
        var newState = state.slice();
        var index = action.activityIndex;
        var newIndex = action.activityIndex - 1;
        newState[index] = newState.splice(newIndex, 1, newState[index])[0];
        changingRoutes(newState)
        return newState;
      }
    case REORDER_DOWN:
      if (action.activityIndex === state.length - 1) {
        return state;
      } else {
        var newState = state.slice();
        var index = action.activityIndex;
        var newIndex = action.activityIndex + 1;
        newState[index] = newState.splice(newIndex, 1, newState[index])[0];
        changingRoutes(newState)
        return newState;
      }
    case EDIT_DESC:
      var newState = state.slice();
      newState[action.activityIndex].desc = action.text;
      return newState;
    case EDIT_PRICE:
      var newState = state.slice();
      newState[action.activityIndex].price = action.price;
      return newState;
    case SAVE_ACTIVITY_CONFIRM:
      var newState = state.slice();
      var index = newState.indexOf(action.activity);
      newState[index].id = action.activity_db_id
      return newState;
    case DELETE_ACTIVITY_CONFIRM:
      return state
    case SAVE_PLAN_CONFIRM:
      var newState = state.slice();
      for (var i = 0; i < newState.length; i++) {
        newState[i].plan_id = action.planId;
      }
      return newState
    case QUERY_DB:
      return state
    default:
      return state
  }
}

