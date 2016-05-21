'use strict';

const planRouter = require('express').Router();
const axios = require('axios');

/**
 *  PLAN ROUTES ----------------------------------------------------
 */

planRouter
  .route('/searchplans')
  .post((request, response) => {
    const city = request.body.city;

    console.log('getting from AWS server');

    axios.get(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/plans?city__icontains=${city}&private__is=false`)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

planRouter
  .route('/createplan')
  .post((request, response) => {
    console.log('creating plan >>>>>>>>>>>>>>>>>>>>>>>>')
    const plan = request.body.plan;
    const access_token = request.body.access_token;
    // const activities = request.body.activities;
    // const reqBody = Object.assign(plan, {
    //   activities: activities
    // });


    axios.post(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/plans?access_token=${access_token}`, plan)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log('Error posting plans to db from server:', error);
        response.send(error);
      });
  });

planRouter
  .route('/updateplan')
  .post((request, response) => {
    const plan = request.body.plan;
    const plan_id = request.body.plan_id;
    const access_token = request.body.access_token;
    const activities = request.body.activities;
    const reqBody = Object.assign(plan, {
      activities: activities
    });
    console.log('inside updateplan');
    axios.put(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/plans/${plan_id}?access_token=${access_token}`, reqBody)
    .then(data => response.send(data.data))
    .catch(error => {
      console.log(error);
      response.send(error);
    });
  });

planRouter
  .route('/deleteplan')
  .post((request, response) => {
    const planID = request.body.planID;

    axios.delete(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/plans/${planID}`)
      .then((data) => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

planRouter
  .route('/getplanbyuser')
  .post((request, response) => {
    console.log('inside server get plans by user');

    const userID = request.body.userID;
    axios.get(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/plans?user_id=${userID}`)
      .then((data) => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

planRouter
  .route('/getplan')
  .post((request, response) => {
    console.log('inside server route in get plan');
    const planID = request.body.planID;
    axios.get(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/plans/${planID}`)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

module.exports = planRouter;
