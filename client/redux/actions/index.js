import * as types from '../constants/ActionTypes.js';
import { store } from '../../components/App.js';

export function initApp() {
  return dispatch => {
    console.log('ready to receive activities');
  };
}

function receiveActivities(activities) {
  return {
    type: types.RECEIVE_ACTIVITIES,
    activities
  };
}

function receiveRoutes(route) {
  return { 
    type: types.RECEIVE_ROUTES,
    directions: route
  };
}

function changeRoutes(route) {
  return { 
    type: types.CHANGE_ROUTES, 
    directions: route
  };
}

export function getAllActivities(query, router) {

    fetch(`/api/yelpSearch?city=${query.city}&category=${query.category}`, {
      method: 'GET'
    })
    .then((results) => results.json())
    .then((data) => 
       data.map((activity) => {
         let transformed = Object.create(null);

         // transformed.yelpRating = activity.rating;
         transformed.title = activity.name;
         transformed.category = activity.categories[0];
         transformed.desc = activity.snippet_text;
         transformed.lat = activity.location.coordinate.latitude;
         transformed.long = activity.location.coordinate.longitude;
         transformed.address = activity.location.address[0];
         transformed.city = activity.location.city;
         transformed.state = activity.location.state_code;
         transformed.neighborhood = activity.location.neighborhoods;
         transformed.added = false;
         // TODO: cannot figure out how to pull a single item from neighborhood array, will have to be handled on client side

         return transformed;
       }))
    .then((yelpData) => {
      console.log('yelpData: ', yelpData);
      return fetch('https://sleepy-crag-32675.herokuapp.com/v1/activities', {
        method: 'GET'
      })
      .then((dbResults) => dbResults.json())
      .then((dbJson) => dbJson.data.map((item) => Object.assign(item, {added: false})))
      .then((dbArray) => dbArray.concat(yelpData))
      .then((dbActivities) => store.dispatch(receiveActivities(dbActivities)))
    })
    .then(() => {
      router.push('/activities');
    })
    .catch(e => console.log(e));
}

export function addToBuilder(activityId) {
  return { 
    type: types.ADD_TO_BUILDER, 
    activityId
  };
}

export function deleteFromBuilder(activityId) {
  return {
    type: types.DELETE_FROM_BUILDER, 
    activityId
  };
}

export function confirmPlan(activities) {
  return {
    type: types.CONFIRM_REQUEST,
    activities
  };
}

export function reorderUp(activityIndex) {
  return {
    type: types.REORDER_UP,
    activityIndex
  }
}

export function reorderDown(activityIndex) {
  return {
    type: types.REORDER_DOWN,
    activityIndex,
  }
}

export function saveToDb(activities) {
  return {
    type: types.SAVE_TO_DB,
    activities
  };
}

// map stuff
export function changingRoutes(activities) {
  const DirectionsService = new google.maps.DirectionsService();

  var places = activities.map(function(item) {
    return {position: {location: {lat: parseFloat(item.lat), lng: parseFloat(item.long) }}, title: item.title, address: [item.address, item.city, item.state].join(', ') };
  });

  DirectionsService.route(
    {
      origin: places[0].address,
      destination: places[places.length-1].address,
      waypoints: places.slice(1,-1).map((item) => item.position),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        return store.dispatch(changeRoutes(result));
      } else {
        console.error(`error fetching directions ${ result }`);
      }
  });





  // return { 
  //   type: types.CHANGE_ROUTES, 
  //   activityId
  // };
}
