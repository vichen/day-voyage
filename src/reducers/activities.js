import { createReducer } from '../utils';
import { RECEIVE_ACTIVITIES,
         ADD_TO_BUILDER,
         DELETE_FROM_BUILDER,
         CHECK_NEIGHBORHOOD,
         CHECK_CATEGORY
       } from '../constants';

import { pushState } from 'redux-router';

export default function activities(state = [], action) {
  switch (action.type) {
    case RECEIVE_ACTIVITIES:
      return action.activities;
    case ADD_TO_BUILDER:
      action.activity.added = true;
      action.activity.icon = '';
      return state;
    case DELETE_FROM_BUILDER:
      action.activity.added = false;
      action.activity.icon = 'https://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0';
      return state;
    case CHECK_NEIGHBORHOOD:
      var newState = state.slice();
      newState.forEach((activity) => {
        var isVisible = false;
        for (var i = 0; i < activity.neighborhood.length; i++) {
          if (action.neighborhoods.indexOf(activity.neighborhood[i].toUpperCase()) >= 0) {
            isVisible = true;
          }
        }
        activity.visArea = isVisible;
      });
      return newState;
    case CHECK_CATEGORY:
      var newState = state.slice();
      newState.forEach((activity) => {
        var isVisible = false;
        for (var i = 0; i < activity.category.length; i++) {
          if (action.categories.indexOf(activity.category[i].toUpperCase()) >= 0) {
            isVisible = true;
          }
        }
        activity.visCategory = isVisible;
      });
      return newState;
    default:
      return state;
  }
}
