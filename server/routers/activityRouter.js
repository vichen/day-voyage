'use strict';

const activityRouter = require('express').Router();
const axios = require('axios');

activityRouter
  .route('/searchActivities')
  .post((request, response) => {
    const city = request.body.city;

    axios.get(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/activities?city__icontains=${city}&private__is=false&isYelp__is=false`)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

activityRouter
  .route('/saveactivity')
  .post((request, response) => {
    console.log('inside server route for activity save>>>>>>>>>>>>>>>>');

    const access_token = request.body.access_token;
    const reqBody = request.body.activity;

    console.log('>>>>>>>>>>>>>>>>>>>', request.body.activity);

    delete request.body.activity.icon;
    delete request.body.activity.clientside_id;
    // delete request.body.activity.index;
    request.body.activity.categories = JSON.stringify([].concat(request.body.activity.categories));
    // request.body.activity.categories;
    delete request.body.activity.neighborhood;

    console.log('AFTER>>>>>>>>>>>>>>>>>>>', request.body.activity);

    axios.post(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/activities?access_token=${access_token}`, reqBody)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

activityRouter
  .route('/deleteactivity')
  .post((request, response) => {
    console.log('delete activity');
    const activityId = request.body.activityId;
    axios.delete(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/activities/${activityId}`)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

activityRouter
  .route('/update')
  .post((request, response) => {
    console.log('inside update activity in server');
    const activityId = request.body.activityId;
    const reqBody = request.body.updates;

    axios.put(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/activities/${activityID}?access_token=${access_token}`, reqBody)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

module.exports = activityRouter;
