import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import HardwareKeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

/**
* template for individual confirm items, 'dumb' child component of ConfirmContainer
*/
export default class ConfirmItem extends Component {
  constructor(props) {
    super(props);

    /**
     * @type {object}
     * @property {boolean} descOpen toggles card expansion
     * @property {string} description of plan that user inputs
     * @property {boolean} edited toggles
     */
    this.state = {
      descOpen: false,
      description: '',
      descEdited: false,
      priceEdited: false
    };
  }

  toggleDesc(evt) {
    this.setState({
      descOpen: !this.state.descOpen
    });
  }

  removeItem() {
    this.props.openSnackbar("Event has been removed from your plan");
    this.props.onDeleteFromBuilderClicked();
  }

  handlePrice(event){
    this.setState({
      price: event.target.value,
      priceEdited: true
    })
  }

  handleSavePrice(){
    this.props.editPriceChange(this.state.price);
    this.setState({priceEdited: false});
  }

  handleDesc(event){
    this.setState({
      description: event.target.value,
      descEdited: true
    })
  }

  handleSaveDesc(){
    this.props.editDescChange(this.state.description);
    this.setState({descEdited: false});
  }

  render() {
    const { activity, order } = this.props
    const address = activity.address ?
                      activity.address + '  ' + String.fromCharCode(183) + '  ':''

    if (this.state.descOpen) {
      var cardDesc = <div>
        Estimated Cost: $
        <TextField
         id="text-field-default"
         style={{width: 50}}
         type="number"
         defaultValue={activity.price?activity.price : '0'}
         onChange={this.handlePrice.bind(this)}/>
        <FlatButton
         label={this.state.priceEdited ? "Save" : ''}
         className="save-info-btn"
         disabled={!this.state.priceEdited}
         onClick={this.handleSavePrice.bind(this)} /> <br />
          <strong>Description:</strong><br />
          <TextField
            id="text-field-default"
            defaultValue={activity.desc}
            onChange={this.handleDesc.bind(this)}
            multiLine={true}
            rows={4} />
           <FlatButton
            label={this.state.descEdited ? "Save" : ''}
            className="save-info-btn"
            disabled={!this.state.descEdited}
            onClick={this.handleSaveDesc.bind(this)} /> <br />
        </div>
    } else {
      var cardDesc = null;
    }

    return (
      <Card
        className="item-card"
        style={{marginLeft: 10, marginRight:10, marginBottom: 10}}>
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
            title={order + '   ' + activity.title}
            subtitle={address + activity.neighborhood}
            key={activity.i}
            onClick={this.toggleDesc.bind(this)} />
          <CardText style={{paddingTop: 0}}>
            {cardDesc}
          </CardText>
        </div>
        <CardActions>
          <FlatButton
              label="Remove"
              style={{color: '#F44336'}}
              onClick={this.removeItem.bind(this)} />
        </CardActions>
      </Card>
    )
  }
}