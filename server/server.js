'use strict';

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const planRouter = require('./routers/planRouter');
const activityRouter = require('./routers/activityRouter');
const userRouter = require('./routers/userRouter');
const commentRouter = require('./routers/commentRouter');

const config = require('../webpack.config');
const compiler = webpack(config);
const axios = require('axios');

var path = require('path');
var Yelp = require('yelp');
var yelpAPIKey = require('./config/yelp.js');

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());

// var app = require('./routes.js');

app.use(express.static(path.join(__dirname + '../src')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', userRouter);
app.use('/plan', planRouter);
app.use('/activity', activityRouter);
app.use('/comment', commentRouter);

//TODO: is this necessary
app.use('/node_modules', express.static(path.join(__dirname + '/../node_modules')));

// Yelp Search
var yelp = new Yelp({
  consumer_key: yelpAPIKey.key,
  consumer_secret: yelpAPIKey.keySecret,
  token: yelpAPIKey.token,
  token_secret: yelpAPIKey.tokenSecret
});

app.get('/api/yelpSearch', function(request, response) {
  yelp.search({ term: request.query.category, location: request.query.city, limit: 10, sort: 2 })
  .then(function (data) {
    response.send(data.businesses);
  })
  .catch(function (err) {
    console.error(err);
  });
});

// Google Distance Matrix
app.get('/api/distancematrix', function(request, response) {
  axios.get("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + request.query.location + "&destinations=" + request.query.results + "&key=AIzaSyCsZxoX3rnuvxE9pcO6jEVEdiF9WN5kib8")
    .then((res) => {
      var distances = res.data.rows[0].elements.map(function(data) {
        return data.distance.text;
      });
      response.send(distances);
    })
    .catch(function (res) {
      console.log(res);
    });
});

// Google Reverse Geocode
app.get('/api/reversegeocode', function(request, response) {
  axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+ request.query.location +"&sensor=true&key=AIzaSyCsZxoX3rnuvxE9pcO6jEVEdiF9WN5kib8")
    .then((res) => {
      var geolocationCity = res.data.results[0];
      response.send(geolocationCity);
    })
    .catch(function (res) {
      console.log(res);
    });
});



app.get('*', function (request, response){
  response.sendFile(path.join(__dirname + '/../src/index.html'));
});


const port = process.env.PORT || 443;

app.listen(port);

module.exports = app;
