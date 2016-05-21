# Day Voyage
where will your day take you?

## Team

  - [Steven Tran] (https://github.com/steventran06)
  - [Vivian Chen] (https://github.com/vichen)
  - [Tor Sinclair] (https://github.com/torsinclair)
  - [Michael Rico] (https://github.com/mrmrico)

## Table of Contents

1. [Why Day Voyage](#why-day-voyage)
1. [Up and Running](#up-and-running)
1. [Requirements](#requirements)
1. [Development](#development)
1. [Depolyement] (#deployment)
1. [Application Architecture](#application-architecture)
1. [Unstacking the Stack](#unstacking-the-stack)
1. [API's](#api's)
1. [Challenges](#challenges)
1. [Roadmap] (#roadmap)
1. [Contributing](#contributing)

## Why Day Voyage

For locals and travelers to build and share custom plans of fun things to do around town or anywhere you go.

On a budget? Day Voyage helps tailor your plans to meet a budget of any size.

## GIF goes here

## Up and running
- Install dependencies
- Export environment
- Start server
- Please visit API [repo](https://github.com/sweaty-figs/sweaty-figs-db) for instructions on setting up api for data layer.

```sh
npm install
npm start
```

> You are now running locally on [localhost:3000](http://localhost:3000/)

## Requirements

- React
- Redux
- Node 0.10.x // TODO: what version?
- Webpack 1.11.0
- Postgres 9.5.2.0
- Nodal 0.1.0

Please see this [repo](https://github.com/sweaty-figs/sweaty-figs-db) for information about requirments and set up for the API driving our data layer.

## Development

To build webpack and generate a bundle:
From within the root directory:
```sh
npm start
```

## Deployment

DayVoyage is deployed on AWS, taking advantage of their Elastic Compute Cloud (EC2) that makes web-scale convenient. For those not familiar with AWS, AWS provides a simple web service interface making it relatively easy to configure capacity.

To leverage off the AWS infrastructure DayVoyage chose to deploy its Express Server within an EC2 instance. The Express Server handles all api requests from clients and interfaces with Nodal Server.

Nodal Server, in turn, is reponsible for all API requests to the database and we have chosen to deploy the Nodal Server as its own EC2 instance also.

The Postgres SQL Database has been setup witin AWS Managed Relational Database Service. The purpose for deploying the database within its own environment is to extend AWS managed service that makes it easy to operate and scale a relational database in the cloud. Amazon RDS automatically patches the database software and backs up your database, storing the backups for a user-defined retention period.

Deployment runs Screen. screen <followed by command> ensures process runs even when terminal exits screen -r enters same session on re-login.

### Testing

DayVoyage is tested using Mocha and Chai.

To generate docs:
```sh
npm start doc
```
Refer to http://en.blog.koba04.com/2015/06/28/esdoc-documentation-for-react-and-es6/ for how to
document

## Application Architecture

Diagram of architecture goes here

## Unstacking the stack

_**Day Voyage is a Single Page Application built with:**_
- React (drives user driven client side interface)
- Redux (application state management)
- React Router and Redux Router (client side routing)

### React
- Views are created using modular and reusable components built in React/JSX.
- React components implement one-way reactive data flow to immediately rerender views upon changes.

### React Router
- Day Voyage uses the React Router library for dynamic route matching to keep our UI in sync with the URL.
- URL paths are synced seamlessly with React view components and allows for smooth transition between page routes.

### Redux
- Unidirectional data-flow normalizes data and provides predictability
- Manages states and acts as a single source of truth for data shared by components throughout the application
- Utilized in conjunction with local states to preserve modularity
- Snapshot of application state tree:
  - **activities:** results from Yelp API call
  - **auth:** stores web tokens and user information
  - **dashboard:** stores user created plans (itineraries)
  - **data:** loading information and miscellaneous items (i.e. budget)
  - **dbactivities:** results from database api call for activities
  - **directions:** stores map coordinates of activities
  - **planBuilder:** temporary list of activities that the user is creating before sa**ving the** the database
  - **router:** keeps track of react router history and location change

### Node
- Day Voyage utilizes Node.js for its extensive package ecosystem through npm, including React and other libraries.

###### Express
- Day Voyage is served using Express, which provides server-side routing and an enviornment for executing API calls to the database and external APIs.
- Utilizes middleware such as body-parser for requests and webpack-dev-middleware to serve our Webpack assets.

###### Webpack

## API's
The data powering our app

###### [Day Voyage API](https://github.com/sweaty-figs/sweaty-figs-db)
- Built with Nodal and Postgres
- See linked repo for endpoints and schemas
- **[Postgress](http://www.postgresql.org)**
  - Our solution for the relational nature of the data
  - Recommended to use [Postgress.app](http://postgresapp.com) for mac users
- **[Nodal](http://www.nodaljs.com)**
  - Our server interfacing with the Postgres instance
  - Separating our API from the application server decouples concerns of the cient and data

###### [Yelp](https://www.yelp.com/developers/documentation/v2/overview) _External API_
- Day Voyage utilizes the **Yelp Search API** to supplement user-generated activities with local establishments based on your search query in the city of your choosing.

###### [Google Maps](https://developers.google.com/maps) _External API_
- **Google Maps** - Implemented using the React-Google-Maps library. Day Voyage generates all search points on the map and creates routes between activities in a plan based on the order of activities set.
- **Google Geocoding** - When geolocation search is activated, Google Geocoding is used to translate the coordinates from latitude/longitude to a city name, so it can be implemented as a location query for our database and the Yelp Search API.
- **Google Distance Matrix** - allows for searches based on geolocation. All activities in the application include the distance from the user's location in miles.

## Challenges
Our team sailed through on calm seas!

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

