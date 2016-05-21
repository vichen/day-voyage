import React, { Component } from 'react';
import Search from '../components/Search';

export default class HomeView extends Component {

  render () {
    return (
      <div className="home">
        <h1 className="home__tagline">where will your day take you?</h1>
        <Search />
        <div className="home__background"></div>
      </div>
    );
  }
}