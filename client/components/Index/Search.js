import { browserHistory } from 'react-router';
import React, { PropTypes, Component} from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { getAllActivities } from '../../redux/actions';
import { Provider } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// import {orange500, blue500} from 'material-ui/styles/colors';

export default class Search extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      city: ''
    }
  }

  searchActivities(event) {
    event.preventDefault();

    getAllActivities(this.state.query, this.state.city, this.context.router);
  }

  handleQuery(event) {
    this.setState({query: event.target.value});
  }

  handleCity(event){
    this.setState({city: event.target.value});
  }

  render() {
    return (
      <div className="col-sm-12">
        <form style={{textAlign: "center", marginTop: 25}} className="commentForm" onSubmit={this.searchActivities.bind(this)}>
          <h5>Search Category: </h5>
          <TextField
            id="search-query-box"
            type="text"
            placeholder="Sight-seeing"
            style={{marginBottom: 25}}
            onChange={this.handleQuery.bind(this)} />
          <TextField
            id="search-city-box"
            type="text"
            placeholder="San Francisco"
            style={{marginBottom: 25}}
            onChange={this.handleCity.bind(this)} />
          <FlatButton label="Search" type="submit"/>
        </form>
      </div>
    );
  }
}