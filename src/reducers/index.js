import {combineReducers} from 'redux';
import {routerStateReducer} from 'redux-router';
import auth from './auth';
import data from './data';
import activities from './activities';
import dbactivities from './dbactivities';
import plans from './plans';
import directions from './map';
import planBuilder from './planBuilder';
import dashboard from './dashboard';
import filter from './filter';

export default combineReducers({
 auth,
 data,
 activities,
 dbactivities,
 plans,
 directions,
 planBuilder,
 dashboard,
 filter,
 router: routerStateReducer
});
