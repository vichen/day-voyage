'use strict';

const userRouter = require('express').Router();
const axios = require('axios');

userRouter
  .route('/login')
  .post((request, response) => {
    console.log('inside server login route');
    const reqBody = request.body;
    axios.post('http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/access_tokens', reqBody)
    .then(data => response.send(data.data))
    .catch(error => {
      console.log(error);
      response.send(error);
    });
  });

userRouter
  .route('/signup')
  .post((request, response) => {
    console.log('inside server signup route');
    const reqBody = request.body;
    axios.post(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/users`, reqBody)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

userRouter
  .route('/update')
  .post((request, response) => {
    console.log('inside server update user');
    const userID = request.body.userID;
    const reqBody = request.body.updates;
    axios.put(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/users/${userID}`, reqBody)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });

userRouter
  .route('/delete')
  .post((request, response) => {
    console.log('inside server delete user');
    const userID = request.body.userID;
    axios.delete(`http://ec2-52-39-9-146.us-west-2.compute.amazonaws.com:443/v1/users/${userID}`)
      .then(data => response.send(data.data))
      .catch(error => {
        console.log(error);
        response.send(error);
      });
  });
module.exports = userRouter;
