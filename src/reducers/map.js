// import { createReducer } from '../utils';
import {
  CHANGE_ROUTES,
  RECEIVE_ROUTES
} from '../constants';

const initialState = {
  directions: null,
};

export default function directions(state = initialState.directions, action) {
  switch (action.type) {
    case CHANGE_ROUTES:
      return action.directions;
    case RECEIVE_ROUTES:
      return state;
    default:
      return state;
  }
}
