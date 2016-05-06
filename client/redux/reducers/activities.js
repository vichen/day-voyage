import { combineReducers } from 'redux';
import { RECEIVE_ACTIVITIES, 
        ADD_TO_BUILDER, 
        DELETE_FROM_BUILDER } from '../constants/ActionTypes';

export function activities(state = [], action) {
  switch (action.type) {
    case RECEIVE_ACTIVITIES:
      return action.activities
    case ADD_TO_BUILDER:
      return Object.assign({}, state, {
        added: true
      })
    case DELETE_FROM_BUILDER:
      return Object.assign({}, state, {
        added: false
      })
    default:
      return state
  }
}

// function byId(state = {}, action) {
//   switch (action.type) {
//     case RECEIVE_ACTIVITIES:
//       return Object.assign({},
//         state,
//         action.activities.reduce((obj, activity) => {
//           obj[activity.title] = activity
//           return obj
//         }, {})
//       )
//     default:
//       const { activityId } = action
//       if (activityId) {
//         return Object.assign({}, state, {
//           [activityId]: activities(state[activityId], action)
//         })
//       }
//       return state
//   }
// }

// function visibleIds(state = [], action) {
//   switch (action.type) {
//     case RECEIVE_ACTIVITIES:
//       return action.activities.map(activity => activity)
//     default:
//       return state
//   }
// }

// export default combineReducers({
//   byId,
//   visibleIds
// })

// export function getActivity(state, title) {
//   return state.byId[title]
// }

// export function getActivities(state) {
//   return state.visibleIds.map(title => getActivity(state, title))
// }
