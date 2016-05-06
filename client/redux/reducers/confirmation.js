import {
  CONFIRM_REQUEST,
  SAVE_TO_DB,
  REORDER_UP,
  REORDER_DOWN
} from '../constants/ActionTypes'

export default function confirmation(state = [], action) {
  switch (action.type) {
    case ADD_TO_BUILDER:
      var newState = state.slice()
      newState.concat(action.activity)
      return newState
    case CONFIRM_REQUEST:
      return action.activities
    case SAVE_TO_DB:
      console.log('save to db pressed')
      return state
    case REORDER_UP:
      if (action.activityIndex === 0) {
        return state;
      } else {
        var newState = state.slice();
        var index = action.activityIndex;
        var newIndex = action.activityIndex - 1;
        newState[index] = newState.splice(newIndex, 1, newState[index])[0];
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
        return newState;
      }
    default:
      return state
  }
}

