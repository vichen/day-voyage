// import { createReducer } from '../utils';
import {
  RECEIVE_FILTER,
  RECEIVE_SLIDER
} from '../constants';

const initialState = {
    neighborhoods: [],
    categories: [],
    minPrice: 0,
    maxPrice: 100
};

export default function filter(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_FILTER:
      return Object.assign({}, state, {
          neighborhoods: action.filter.neighborhoods,
          categories: action.filter.categories
      });
    case RECEIVE_SLIDER:
      return Object.assign({}, state, {
          maxPrice: action.filter.maxPrice
      });
    default:
      return state;
  }
}


