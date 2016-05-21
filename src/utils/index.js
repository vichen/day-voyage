import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

// createConstants creates a hash with all of the constants
/**
 * Creates hash of all constants
 * @param  {...String} constants [string describing action]
 * @return {Object}    [hash of constants]
 */
export function createConstants(...constants) {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant;
    return acc;
  }, {});
}

export function isLoggedIn() {
  var token = localStorage.getItem('token');
  return !!token ? true : false;
}
/**
 * Composes a hash with reducer functions
 * @param  {Object} initialState
 * @param  {Object} reducerMap
 * @return {Object} hash with reducer functions by action
 */
export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];
    return reducer ? reducer(state, action.payload) : state;
  };
}

/**
 * Checks status of API responses
 * @param  {Object} response
 * @return {Object} response || error
 */
export function checkHttpStatus(response) {
  //TODO: adjust the error that are being put onto the response object
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export function parseJSON(response) {
  return response.json();
}

/** Helps remove state and extra from city input */
export function parseCity(cityInput) {
  return cityInput.replace(/,.*/, '');
}

/**
 * API HELPERS TO INTERFACE WITH DB
 */

/**
 * USER helpers -------------------------------------------------------
 */

//NOTE: create user is in actions since coupled with signup actions

//TOD0: check if run into CORS issues
export function updateUser(userID, updates, cb) {
  const reqBody = {
    userID: userID,
    updates: updates
  };
  fetch(`/user/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  })
  .then(parseJSON)
  .then(response => cb(response))
  .catch(error => console.log(`Error updating user: ${error}`))
}

//TOD0: check if run into CORS issues
export function deleteUser(userID, cb) {
  const reqBody = {
    userID: userID
  };
  fetch(`/user/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })
  .then(parseJSON)
  .then(response => cb(response))
  .catch(error => console.log(error));
}

/**
 * ACTIVITY helpers -----------------------------------------------------
 */

export function searchActivities(searchTerm, city, cb) {
  city = parseCity(city);
  const reqBody = { city };

  fetch('/activity/searchActivities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })
    .then(parseJSON)
    .then(result => {
      let activities = result.data;
      let matchHash = Object.create(null);
      let query = new RegExp(searchTerm, 'gi');
      let matches = activities.filter((activity) => {
        let categoryString = activity.categories.join(',');
        return query.test(activity.desc) || query.test(categoryString) || query.test(activity.title);
      });
      matches.forEach((activity, i) => {
        matchHash[activity.title] = activity;
      });
      let uniqueMatches = [];
      for (const title in matchHash) {
        uniqueMatches.push(matchHash[title]);
      }
      cb(uniqueMatches);
    })
    .catch(error => console.log(error));
}


export function getActivitiesByUser(id, cb) {
  fetch(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/activities?user_id=${id}`)
  .then(parseJSON)
  .then(response => cb(response))
  .catch(error => console.log(`Error getting activities by userID: ${error}`));
}

export function getActivitiesUnderBudget(amount, cb) {
  console.log('getting activities under budget');
  fetch(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/activities?costPerPerson__lte=${amount}`)
  .then(parseJSON)
  .then(response => cb(response))
  .catch(error => console.log(`Error getting activities under budget: ${error}`));
}


/**
 * Get all activities for a given plan
 * @param  {int}   planID
 * @param  {Function} cb
 */
export function getActivitiesByPlan(planID, cb) {
  fetch(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/activities/?plan_id=${planID}`)
  .then(parseJSON)
  .then(response => cb(response))
  .catch(error => console.log(`Error getting activities by planID: ${error}`));
}


export function updateActivity(activityID, updates, cb) {
  const token = localStorage.getItem('token');
  const access_token = JSON.parse(token).access_token;

  const reqBody = {
    access_token: access_token,
    updates: updates,
  };

  fetch(`/activity/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })
  .then(parseJSON)
  .then(response => cb(response))
  .catch(err => console.log(`Error updating activities: ${err}`));
}

/**
 * PLAN helpers -------------------------------------------------------
 */

/**
 * Seach for plans
 * @param  {String}   searchTerm
 * @param  {String}   city
 * @param  {Function} cb
 */

export function getAllPlans(cb) {
  fetch('http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/plans')
  .then(parseJSON)
  .then(response => cb(response))
  .catch(error => console.log(`Error getting all plans: ${error}`));
}

export function searchPlans(searchTerm, city, cb) {
  city = parseCity(city);

  const reqBody = {
    city: city,
  };

  fetch(`/plan/searchPlans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  })
  .then(parseJSON)
  .then(result => {
    let plans = result.data;
    let query = new RegExp(searchTerm, 'gi');
    let matchHash = Object.create(null);
    let matches = plans.filter((plan) => query.test(plan.desc) || query.test(plan.title));
    matches.forEach((plan, i) => {
      matchHash[plan.title] = plan;
    });
    let uniqueMatches = [];
    for (const title in matchHash) {
      uniqueMatches.push(matchHash[title]);
    }
    cb(matches);
    })
  .catch(error => console.log(error));
}

/**
 * Get all plans for a given user
 * @param  {int}   userID
 * @param  {Function} cb
 */
export function getPlansByUser(userID, cb) {
  const reqBody = { userID };
  console.log('routing get plans by user to server');
  fetch('/plan/getplanbyuser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })
  .then(parseJSON)
  .then(response => cb(response))
  .catch(error => console.log(`Error getting plans by userID: ${error}`));
}

/**
 * Get a single plan, including activities associated with plan
 * @param  {int}   planID
 * @param  {Function} cb
 */
export function getPlan(planID, cb) {
  let reqBody = {
    planID: planID
  };
  fetch(`/plan/getplan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })
   .then(parseJSON)
   .then(data => {
      console.log('getting comments');
      getComments('plan', planID, comments => {
        data.data[0].comments = comments.data;
        cb(data);
      });
    })
   .catch(error => console.log(error));
}

/**
 * Update plan
 * @param  {Int}   planID
 * @param  {Object}   planUpdates hash with plan updates
 * @param  {Array}   activities  array of activity ojects to update
 * @param  {Function} cb
 */
export function updatePlan(planID, planUpdates, activities, cb) {
  let token = localStorage.getItem('token');
  let access_token = JSON.parse(token).access_token;
  let reqBody = {
    plan: planUpdates,
    access_token: access_token,
    activities: activities,
    plan_id: planID
  };
  fetch(`plan/updateplan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  })
  .then(parseJSON)
  .then(data => cb(data))
  .catch(error => console.log(`Error updating plan: ${error}`))
}


/**
 * Delete plan
 * @param  {int}   planID
 * @param  {Function} cb
 */
export function deletePlan(planID, cb) {
  const reqBody = { planID };
  fetch(`/plan/deleteplan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })
  .then(parseJSON)
  .then(response => cb(response))
  .catch(error => console.log(error));
}

/**
 * COMMENT HELPERS --------------------------------------------------------
 */


/**
 * Get comments from DB
 * @param  {String}   type user, activity, plan
 * @param  {int}   id   id of type
 * @param  {Function} cb   callback to execute with response
 */
 export function getComments(type, id, cb) {
   let queryString = `?${type}_id=${id}`;
   let reqBody = {
     queryString: queryString
   };
   // let url = `http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/comments${queryString}`;
   fetch('/comment/get', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(reqBody),
   })
     .then(parseJSON)
     .then(response => cb(response))
     .catch(error => console.log(error));
 }

export function createComment(comment, cb) {
  let url = `/comment/create`;
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
  })
  .then(parseJSON)
  .then((response) => cb(response))
  .catch(error => console.log(error));
}

/**
 * ADDITIONAL HELPERS --------------------------------------------------------
 */

/**
 * Run custom queries on tables
 * @param  {string}    table
 * @param  {Object}    queries attributes for object to match
 * @param  {Function}  cb
 */
export function queryTable(table, queries, cb) {
  let queryString = '?';
  let contains = '__icontains=';
  let is = '__is=';
  const keys = Object.keys(queries);
  keys.forEach((key, i) => {
    let queryValue = queries[key];
    if (typeof queryValue === 'string') {
      queryString+=`${key}${contains}${queryValue}`;
    } else {
      queryString+=`${key}${is}${queryValue}`;
    }
    if (!(i === keys.length - 1)) {
      queryString+='&'
    }
  });
  let url = `http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/${table}${queryString}`;
  fetch(url)
    .then(parseJSON)
    .then(response => cb(response))
    .catch(error => console.log(error));
}




