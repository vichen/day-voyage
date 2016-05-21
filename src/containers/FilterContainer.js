
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Slider from 'material-ui/Slider';
import Checkbox from 'material-ui/Checkbox';
import { 
  checkNeighborhood,
  checkCategory, 
  dbCheckNeighborhood,
  dbCheckCategory, 
  dbCheckBudget } from '../actions';
import { sliderclass } from './styles.css';

export default class FilterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      priceSlider: 0
    };
  }

  componentWillMount() {
    const { filter } = this.props;

    this.setState({
      priceSlider: filter.maxPrice
    });
  }

  toggleDrawer() {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  }

  handleSlider(event, value) {
    var budget = Math.round(value);
    this.setState({priceSlider: budget});
    this.props.dbCheckBudget(budget);
  }

  handleCategory(category) {
    const { filter } = this.props;
    var categoryArr = filter.categories;

    for(var i = 0; i < categoryArr.length; i++) {
      if(categoryArr[i].type === category) {
        categoryArr[i].visible = !categoryArr[i].visible;
      }
    }

    var checkedCategories = categoryArr
      .filter(item => item.visible === true)
      .map(item => item.type);

    this.props.checkCategory(checkedCategories);
    this.props.dbCheckCategory(checkedCategories);

  }

  handleNeighborhood(neighborhood) {
    const { filter } = this.props;
    var neighborhoodArray = filter.neighborhoods;
    
    for(var i = 0; i < neighborhoodArray.length; i++) {
      if(neighborhoodArray[i].location === neighborhood) {
        neighborhoodArray[i].visible = !neighborhoodArray[i].visible;
      }
    }

    var checkedNeighborhoods = neighborhoodArray
      .filter(item => item.visible === true)
      .map(item => item.location);

    this.props.checkNeighborhood(checkedNeighborhoods);
    this.props.dbCheckNeighborhood(checkedNeighborhoods);
  }

  render() {
    const { filter } = this.props;

    var neighborhoodOptions = filter.neighborhoods.map((neighborhood, index) => {
      return ( 
        <Checkbox
          key={ index }
          label={neighborhood.location}
          defaultChecked={neighborhood.visible}
          style={{marginLeft: 25, marginRight: 25, marginBottom: 10}}
          onCheck={(e) => this.handleNeighborhood(neighborhood.location)} />
        )
    })

    var categoryOptions = filter.categories.map((category, index) => {
      return ( 
        <Checkbox
          key={ index }
          label={category.type}
          defaultChecked={category.visible}
          style={{marginLeft: 25, marginRight: 25, marginBottom: 10}}
          onCheck={(e) => this.handleCategory(category.type)} />
      )
    })
    
    return (
      <div>
        <FlatButton 
          style={{marginTop: 6, marginRight: 18}}
          label="Filter" onClick={this.toggleDrawer.bind(this)} />
        <Drawer open={this.state.drawerOpen}>
          <FlatButton label="Close Filter" onClick={this.toggleDrawer.bind(this)} />
          <div>
            <MenuItem>Budget ${this.state.priceSlider}</MenuItem>
            <h6 style={{marginLeft: 25}}>*Not all activities have prices</h6>
            <Slider
              style={{marginLeft: 25, marginRight: 25}}
              min={filter.minPrice}
              max={filter.maxPrice}
              step={0.01}
              className="slider-class"
              defaultValue={filter.maxPrice}
              onChange={this.handleSlider.bind(this)}/>
            <MenuItem>Neighborhoods</MenuItem>
            {neighborhoodOptions}
            <MenuItem>Categories</MenuItem>
            {categoryOptions}
          </div>
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activities: state.activities,
    filter: state.filter
  }
}

export default connect(mapStateToProps, 
  { checkNeighborhood, 
    checkCategory, 
    dbCheckNeighborhood, 
    dbCheckCategory, 
    dbCheckBudget }
  )(FilterContainer)