import { checkHttpStatus,
  parseJSON,
  searchActivities,
  searchPlans,
  getPlansByUser } from '../utils';

import {
  ADD_TO_BUILDER,
  DELETE_FROM_BUILDER,
  RECEIVE_ACTIVITIES,
  RECEIVE_YELPS,
  CONFIRM_REQUEST,
  REORDER_UP,
  REORDER_DOWN,
  SAVE_TO_DB,
  CHANGE_ROUTES,
  RECEIVE_ROUTES,
  LOGIN_USER_REQUEST,
  LOGIN_USER_FAILURE,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  SIGNUP_USER_REQUEST,
  SIGNUP_USER_FAILURE,
  SIGNUP_USER,
  FETCH_PROTECTED_DATA_REQUEST,
  RECEIVE_PROTECTED_DATA,
  CHECK_NEIGHBORHOOD,
  CHECK_CATEGORY,
  DB_CHECK_NEIGHBORHOOD,
  DB_CHECK_CATEGORY,
  DB_CHECK_BUDGET,
  EDIT_DESC,
  EDIT_PRICE,
  SAVE_ACTIVITY_CONFIRM,
  DELETE_ACTIVITY_CONFIRM,
  SAVE_PLAN_CONFIRM,
  QUERY_DB,
  RECEIVE_DBACTIVITIES,
  DB_ADD_TO_BUILDER,
  DB_DELETE_FROM_BUILDER,
  DASHBOARD_RECEIVE,
  DASHBOARD_DELETE,
  RECEIVE_PLANS,
  ADD_PLAN_TO_BUILDER,
  DELETE_PLAN_FROM_BUILDER,
  RECEIVE_BUDGET,
  RECEIVE_FILTER,
  RECEIVE_SLIDER
} from '../constants';
import { push } from 'redux-router';
import { store } from '../index.js';

export function initApp() {
  return dispatch => {
    console.log('ready to receive activities');
  };
}

export function receiveActivities(activities) {
  return {
    type: RECEIVE_ACTIVITIES,
    activities
  };
}

export function receiveDBActivities(activities) {
  return {
    type: RECEIVE_DBACTIVITIES,
    activities
  };
}

export function receivePlans(plans) {
  return {
    type: RECEIVE_PLANS,
    plans
  };
}

export function receiveRoutes(route) {
  return {
    type: RECEIVE_ROUTES,
    directions: route
  };
}

export function changeRoutes(route) {
  return {
    type: CHANGE_ROUTES,
    directions: route
  };
}

export function receiveBudget(budget) {
  return {
    type: RECEIVE_BUDGET,
    payload: {
      budget: budget
    }
  };
}

export function receiveFilter(filter) {
  return {
    type: RECEIVE_FILTER,
    filter
  };
}

export function receiveSlider(filter) {
  return {
    type: RECEIVE_SLIDER,
    filter
  };
}

/**
 * Get Yelp search results
 */
export function getAllActivities(query, location) {
  return (dispatch) => {
    /**
    * do Yelp search based on query city (may be geolocation or typed in) and category
    */
    searchActivities(query.category, query.city, (activities) => {
      var dbNoLocation = activities.map((activity) => Object.assign(activity, {added: false, icon: 'https://storage.googleapis.com/support-kms-prod/SNP_2752129_en_v0', visArea: true, visCategory: true, visBudget: true}));
      if (location !== null) {
        /**
        * check distances of all activities from current location using Google distance matrix api
        */
        var dbCoords = dbNoLocation.slice().map((info) => {
          return [info.lat, info.long].join('%2C');
        }).join('%7C');
        fetch(`/api/distancematrix?location=${location.lat+','+location.lng}&results=${dbCoords}`, {
          method: 'GET'
        }).then((dbDistanceResults) => dbDistanceResults.json())
        .then((dbDistances) => {
          console.log('have distances for db', dbDistances);
          /**
          * add distance key to each activity
          */
          var dbWithLocation = dbNoLocation.map((activity, i) => {
            activity.distance = dbDistances[i];
            return activity;
          });
          /**
          * dispatch activities with new distance key
          */
         console.log('db with location', dbWithLocation);
          dispatch(receiveDBActivities(dbWithLocation));
        });
      } else {
        dispatch(receiveDBActivities(dbNoLocation));
      }
      dispatch(receiveSlider(createSlider(activities)));
    });

    searchPlans(query.category, query.city, (results) => {
      dispatch(receivePlans(results));
    });

    fetch(`/api/yelpSearch?city=${query.city}&category=${query.category}`, {
      method: 'GET'
    })
    .then((yelpResults) => yelpResults.json())
    .then((yelpData) => {
      /**
      * transform data to correct format for activities
      */
      var withoutLocation = yelpData.map((activity, i) => {
        let transformed = Object.create(null);
        transformed.title = activity.name;
        transformed.category = activity.categories[0];
        transformed.desc = activity.snippet_text;
        transformed.lat = activity.location.coordinate.latitude;
        transformed.long = activity.location.coordinate.longitude;
        transformed.address = activity.location.address[0];
        transformed.city = activity.location.city;
        transformed.state = activity.location.state_code;
        transformed.neighborhood = activity.location.neighborhoods || [];
        transformed.added = false;
        transformed.icon = 'http://www.maddiesrestaurant.com/wp-content/themes/maddies/images/yelp-icon.png';
        transformed.visArea = true;
        transformed.visCategory = true;
        transformed.visBudget = true;
        transformed.notes= '';
        return transformed;
      });
      return withoutLocation;
    })
    .then((noLocation) => {
      /**
      * if current location was included
      */
      if (location !== null) {
        /**
        * check distances of all activities from current location using Google distance matrix api
        */
        var coords = noLocation.slice().map((info) => {
          return [info.lat, info.long].join('%2C');
        }).join('%7C');
        fetch(`/api/distancematrix?location=${location.lat+','+location.lng}&results=${coords}`, {
          method: 'GET'
        }).then((distanceResults) => distanceResults.json())
        .then((distances) => {
          /**
          * add distance key to each activity
          */
          var withLocation = noLocation.map((activity, i) => {
            activity.distance = distances[i];
            return activity;
          });
          /**
          * dispatch activities with new distance key
          */
          dispatch(receiveActivities(withLocation));
          dispatch(receiveFilter(createFilter(withLocation)));
        })
        .then(() => {
          /**
          * route to activities page
          */
          dispatch(push('/activities'));
        })
        .catch(e => console.log(e));
      /**
      * otherwise if no location is set, just dispatch activities without distance
      */
      } else {
        dispatch(receiveActivities(noLocation));
        dispatch(receiveFilter(createFilter(noLocation)));
      }
    })
    .then(() => {
      if (location === null) {
        dispatch(push('/activities'));
      }
    })
    .catch(e => console.log(e));
  };
}

export function createFilter(activityArr) {
  var neighborhood_id = [];
  var neighborhoodArray = [];
  var categoryArr = [];
  var category_id = [];
  activityArr.forEach((activity) => {
    for (var i = 0; i < activity.neighborhood.length; i++){
      if (neighborhood_id.indexOf(activity.neighborhood[i].toUpperCase()) === -1) {
        neighborhood_id.push(activity.neighborhood[i].toUpperCase());
        neighborhoodArray.push({location: activity.neighborhood[i].toUpperCase(), visible: true});
      }
    }

    for (var j = 0; j < activity.category.length; j++) {
      if (category_id.indexOf(activity.category[j].toUpperCase().replace(/\s/g,'')) === -1) {
        category_id.push(activity.category[j].toUpperCase().replace(/\s/g, ''));
        categoryArr.push({type: activity.category[j].toUpperCase().replace(/\s/g, ''), visible: true});
      }
    }
  });
  neighborhoodArray.sort((a, b) => a.location > b.location);
  categoryArr.sort((a, b) => a.type > b.type);
  var newFilter = {
    neighborhoods: neighborhoodArray,
    categories: categoryArr,
  };
  return newFilter;
}

export function createSlider(activityArr) {
  var maxPrice = 0;
  activityArr.forEach((activity) => {
    if (activity.price > maxPrice) {
      maxPrice = activity.price;
    }
  });

  var newFilter = {
    minPrice: 0,
    maxPrice: Math.round(maxPrice) + 10
  };
  return newFilter;
}

export function addToBuilder(activity) {
  return {
    type: ADD_TO_BUILDER,
    activity
  };
}

export function DBaddToBuilder(activity) {
  return {
    type: DB_ADD_TO_BUILDER,
    activity
  };
}

// export function addPlanToBuilder(plan) {
//   return {
//     type: ADD_PLAN_TO_BUILDER,
//     plan
//   };
// }

export function deleteFromBuilder(activity) {
  return {
    type: DELETE_FROM_BUILDER,
    activity
  };
}

export function DBdeleteFromBuilder(activity) {
  return {
    type: DB_DELETE_FROM_BUILDER,
    activity
  };
}

export function deletePlanFromBuilder(plan) {
  return {
    type: DELETE_PLAN_FROM_BUILDER,
    plan
  };
}

export function goToActivities() {
  return dispatch => {
    dispatch(push('/activities'));
  };
}

export function goToConfirm() {
  return dispatch => {
    dispatch(push('/confirm'));
  };
}

export function getDashboardActivities(dashboard) {
  return {
    type: DASHBOARD_RECEIVE,
    dashboard
  }
}

export function goToDashboard() {
  return dispatch => {
    dispatch(push('/dashboard'));
  };
}

export function deleteFromDashboard(planIndex) {
  return {
    type: DASHBOARD_DELETE,
    planIndex
  }
}

export function reorderUp(activityIndex) {
  return {
    type: REORDER_UP,
    activityIndex
  };
}

export function reorderDown(activityIndex) {
  return {
    type: REORDER_DOWN,
    activityIndex
  };
}

// map stuff
export function changingRoutes(activities) {
    const DirectionsService = new google.maps.DirectionsService();

    if (activities.length === 0) {
      return dispatch(changeRoutes(null));
    }

    var places = activities.map(function(item) {
      return {position: {location: {lat: parseFloat(item.lat), lng: parseFloat(item.long) }}, icon: item.icon};
    });

    DirectionsService.route(
      {
        origin: places[0].position,
        destination: places[places.length-1].position,
        waypoints: places.slice(1,-1).map((item) => item.position),
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.WALKING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          return store.dispatch(changeRoutes(result));
        } else {
          console.error(`error fetching directions ${ result }`);
          return store.dispatch(changeRoutes(null));
        }
    });
}


export function loginUserSuccess(token, snackbar, signedup) {
  localStorage.setItem('token', JSON.stringify(token));
  if (snackbar) {
    if (signedup) {
      snackbar("Congratulations, you have signed up!");
    } else {
      snackbar("You have successfully logged in");
    }
  }
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token: token
    }
  }
}

export function loginUserFailure(error, snackbar) {
  localStorage.removeItem('token');
  snackbar('The user name and password you have entered do not match our records');
  console.log(error);
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST
  }
}

export function logout() {
    localStorage.removeItem('token');
    return {
      type: LOGOUT_USER
    }
}

// pay attention to this fn signature...
// appear returns a function that takes dispatch as a param
export function logoutAndRedirect(snackbar) {
    return (dispatch, state) => {
        dispatch(logout());
        dispatch(push('/'));
        snackbar("You have successfully logged out");
    }
}

export function loginUser(username, password, snackbar, signedup) {
    return function(dispatch) {
        dispatch(loginUserRequest());
        return fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({username: username, password: password,grant_type: 'password'})
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginUserSuccess(response.data[0], snackbar, signedup));
                } catch (e) {
                    console.log(e);
                    dispatch(loginUserFailure({
                        response: {
                          status: 403,
                          statusText: 'Invalid token'
                        }
                    }, snackbar));
                }
            })
            .catch(error => {
               // snackbar('The user name and password you have entered do not match our records');
               let response = {
                status: 401,
                statusText: `Unauthorized`
               };
               let resError = Object.assign({}, {
                response: response
              });
               dispatch(loginUserFailure(resError, snackbar));
            })
    }
}

export function signUpUser(username, password, email, snackbar) {
  // console.log(`username is ${username}\npassword is ${password}\nemail is ${email}`);
  return function(dispatch) {
    dispatch(signUpUserRequest());
    return fetch('/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      try {
          dispatch(loginUser(username, password, snackbar, true));
        } catch (e) {
          snackbar('Please enter a valid username, password, or email');
          dispatch(signUpUserFailure({
            response: {
              status: 403,
              statusText: `Error Signing Up`
            }
          }));
        }
      })
    .catch(error => {
      snackbar('Please enter a valid username, password, or email');
      let response = {
        status: 401,
        statusText: `Error with sign up request`
      };
      let resError = Object.assign({}, {
        response: response
      });
      dispatch(signUpUserFailure(resError));
    })
  }
}

export function signUpUserFailure(error) {
  return {
    type: SIGNUP_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  };
}

export function signUpUserRequest() {
  return {
    type: SIGNUP_USER_REQUEST
  }
}

export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data: data
        }
    }
}

export function fetchProtectedDataRequest() {
  return {
    type: FETCH_PROTECTED_DATA_REQUEST
  }
}


export function fetchProtectedData(token) {

    // return (dispatch, state) => {
    //     dispatch(fetchProtectedDataRequest());
    //     return fetch('http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/plans', {
    //             credentials: 'include',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //         .then(checkHttpStatus)
    //         .then(parseJSON)
    //         .then(response => {
    //             dispatch(receiveProtectedData(response.data));
    //         })
    //         .catch(error => {
    //             if(error.response.status === 401) {
    //               dispatch(loginUserFailure(error));
    //               dispatch(push('/login'));
    //             }
    //         })
    //    }
}

export function checkNeighborhood(neighborhoods) {
  return {
    type: CHECK_NEIGHBORHOOD,
    neighborhoods
  }
}


export function checkCategory(categories) {
  return {
    type: CHECK_CATEGORY,
    categories
  }
}

export function dbCheckNeighborhood(neighborhoods) {
  return {
    type: DB_CHECK_NEIGHBORHOOD,
    neighborhoods
  }
}


export function dbCheckCategory(categories) {
  return {
    type: DB_CHECK_CATEGORY,
    categories
  }
}

export function dbCheckBudget(budget) {
  return {
    type: DB_CHECK_BUDGET,
    budget
  }
}

export function saveActivityConfirm(activity, activity_db_id) {

  return {
    type: SAVE_ACTIVITY_CONFIRM,
    activity: activity,
    activity_db_id: activity_db_id
  }
}

export function savePlanConfirm(planId) {
  return {
    type: SAVE_PLAN_CONFIRM,
    planId
  }
}

export function deleteConfirm() {
  return {
    type: DELETE_ACTIVITY_CONFIRM
  }
}

export function saveActivityToDb(activity, access_token) {
  return dispatch => {

    const reqBody = {
      access_token: access_token,
      activity: activity,
    };
    console.log('sending save to db');
    return fetch('/activity/saveactivity', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify(reqBody)
        })
        .then(checkHttpStatus)
        .then(parseJSON)
        .then(response => {
          console.log('here is the response upon saving', response);
            try {
              dispatch(saveActivityConfirm(activity, response.data[0].id))
            } catch (e) {
              console.log(e);
              snackbar('There was an error saving the activity');
            }
        })
        .catch(error => {
           console.log(error);
        })
    }
}

export function deleteActivityFromDb(activityId, cb) {
  return dispatch => {
    const reqBody = {
      activityId: activityId
    };

    return fetch(`/activity/deleteactivity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    })
    .then(parseJSON)
    .then(response => {
      cb(response);
    })
    .then(() => dispatch(deleteConfirm()))
    .catch(error => console.log(`Error deleting activity: ${error}`));
    }
}




/**
 * [createPlan description]
 * @param  {[type]} plan       [object]
 * @param  {[type]} activities [an array of activity objects, include any properties to be updated]
 * @return {[type]}            [promise with response from db]
 */
export function createPlan(plan, activities, cb) {
  return dispatch => {
    let token = localStorage.getItem('token');
    let access_token = JSON.parse(token).access_token;
    let reqBody = {
      plan: plan,
      access_token: access_token,
      activities: activities
    };

    fetch(`/plan/createplan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    })
    .then(parseJSON)
    .then(response => {
      cb(response);
      var planId = response.data[0].id
      dispatch(savePlanConfirm(planId));
    })
    .catch(error => console.log(`Error creating plan: ${error}`))
  }
}


export function editDescription(activityIndex, text) {
  return {
    type: EDIT_DESC,
    activityIndex: activityIndex,
    text: text
  }
}

export function editPrice(activityIndex, price) {
  return {
    type: EDIT_PRICE,
    activityIndex: activityIndex,
    price: price
  }
}

export function unCheckCity(city) {
  return {
    type: UNCHECK_CITY,
    city
  }
}

export function queryDb() {
  return {
    type: QUERY_DB
  };
}
