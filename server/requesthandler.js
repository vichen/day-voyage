// var express = require('express');
// var bodyParser = require('body-parser');
// var path = require('path');
// var Yelp = require('yelp');
// var yelpAPIKey = require('./config/yelp.js');

// exports.navToIndex = function (request, response){
//   response.sendFile(path.join(__dirname + '/../client/index.html'));
// }

// var yelp = new Yelp({
//   consumer_key: yelpAPIKey.key,
//   consumer_secret: yelpAPIKey.keySecret,
//   token: yelpAPIKey.token,
//   token_secret: yelpAPIKey.tokenSecret
// });

// exports.yelpSearch = function(request, response) {
//   console.log(request.query);
//   yelp.search({ term: request.query.category, location: request.query.city })
//   .then(function (data) {
//     response.send(data.businesses);
//   })
//   .catch(function (err) {
//     console.error(err);
//   });
// }