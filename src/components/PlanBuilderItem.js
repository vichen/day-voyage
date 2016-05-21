import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import HardwareKeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import TextField from 'material-ui/TextField';

export default class PlanBuilderItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descOpen: false,
      price: 0,
      edited: false
    };
  }

  removeItem() {
    this.props.openSnackbar("Event has been removed from your plan");
    this.props.onDeleteFromBuilderClicked();
  }

  toggleDesc(evt) {
    this.setState({
      descOpen: !this.state.descOpen
    });
  }

  handlePrice(event){
    this.setState({
      price: event.target.value,
      edited: true
    })
  }

  handleSave(){
    this.props.editPriceChange(this.state.price);
    this.setState({edited: false});
  }

  render() {
    const { activity, order } = this.props;

    var title = activity.distance ? order + '   ' + activity.title + ' - ' + activity.distance + " away" : order + '   ' + activity.title;

    if (this.state.descOpen) {
      var cardDesc = <div>
          Estimated Cost: $
          <TextField
           id="text-field-default"
           style={budgetTextFieldStyle}
           type="number"
           defaultValue={activity.price?activity.price : '0'}
           onChange={this.handlePrice.bind(this)}/>
          <FlatButton
          label={this.state.edited ? "Save" : ''}
           className="save-info-btn"
           disabled={!this.state.edited}
           onClick={this.handleSave.bind(this)} /> <br />
          <strong>Address:</strong><br />
          {activity.address}<br />
          {activity.city}, {activity.state}<br /><br />
          {activity.desc} <br />
        </div>
    } else {
      var cardDesc = null;
    }
    return (
      <Card 
        className="item-card"
        style={{marginLeft: 10, marginRight:10, marginBottom: 10, cursor: 'pointer'}}>
        <div className="reorder-btns">
          <IconButton 
            tooltip="Move Up"
            onClick={this.props.onMoveUpClicked}>
            <HardwareKeyboardArrowUp />
          </IconButton>
          <IconButton 
            tooltip="Move Down"
            onClick={this.props.onMoveDownClicked}>
            <HardwareKeyboardArrowDown />
          </IconButton>
        </div>
        <div className="card-content">
          <CardHeader
            style={{paddingBottom: 0}}
            title={title}
            subtitle={activity.neighborhood ? activity.neighborhood.join(', ') : ''}
            onClick={this.toggleDesc.bind(this)}
            key={activity.i}
            actAsExpander={true}
            showExpandableButton={true}
            onClick={this.toggleDesc.bind(this)} />
          <CardText style={{paddingTop: 0}}>
            {cardDesc}
          </CardText>
        </div>
        <CardActions>
          <FlatButton
              className="remove-btn"
              label="Remove"
              style={{color: '#F44336'}}
              onClick={this.removeItem.bind(this)}/>
        </CardActions>
        
      </Card>
    )
  }
}

var budgetTextFieldStyle = {
  width: 100,
  marginTop: 0,
  marginBottom: 15
}


PlanBuilderItem.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    city: PropTypes.string
  }).isRequired,
  onDeleteFromBuilderClicked: PropTypes.func.isRequired
}
