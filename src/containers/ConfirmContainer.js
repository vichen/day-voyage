import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addToBuilder, 
        deleteFromBuilder, 
        reorderUp, 
        reorderDown, 
        changingRoutes,
        editDescription,
        editPrice,
        createPlan,
        deleteActivityFromDb,
        saveActivityToDb,
        updateActivity,
        receiveBudget } from '../actions';
import { bindActionCreators } from 'redux';
import ConfirmItem from '../components/ConfirmItem';
import SavePlan from '../components/SavePlan';
import TextField from 'material-ui/TextField';
import { Card, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
import Checkbox from 'material-ui/Checkbox';
import EditorAttachMoney from 'material-ui/svg-icons/editor/attach-money';

var shortid = require('shortid');

export class ConfirmContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      planTitle: '',
      modalOpen: false,
      snackbar: false,
      message: '',
      plan_id: null,
      budgeting: this.props.data.budget > 0 ? true : false
    };
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  toggleSnackbar(message) {
    this.setState({message: message, snackbar: true});
    var that = this;
    setTimeout(() => this.setState({snackbar: false}), 2000);
  }

  saveItinerary() {

    if (this.state.planTitle.length === 0) {
      this.toggleSnackbar("Please name your itinerary");
    } else {
      this.toggleModal();
      this.props.createPlan(Object.assign({}, {
        user_id: this.props.auth.user_id,
        clientside_id: shortid.generate(),
        title: this.state.planTitle,
        desc: '',
        likes: 0
      }), [], (response) => {
        console.log('save itin response: ', response);
        this.setState({
          plan_id: response.data[0].id
        });
        var activities = [];
        this.props.planBuilder.forEach((activity, index) => {
          this.props.saveActivityToDb(Object.assign(activity, {
            isYelp: true,
            user_gen: false,
            clientside_id: shortid.generate(),
            plan_id: response.data[0].id,
            index: index
          }), this.props.auth.token.access_token);
        });

      });
    }
  }

  handleTitle(event) {
    this.setState({planTitle: event.target.value});
  }

  getTotalPrice() {
    var total = 0;
    this.props.planBuilder.forEach(activity => {
      if (activity.price) { 
        total += parseInt(activity.price) ;
      }});
    return total;
  }

  handleBudget(event){
    this.props.receiveBudget(event.target.value)
  }

  checkBudgeting() {
    this.setState({budgeting: !this.state.budgeting})
    console.log(this.state.budgeting);
  }

  render() {
    const { planBuilder, auth, data } = this.props;
    const alphabetOrder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const budgetField = this.state.budgeting ?
      <div>
        <CardText>
          Budget: $<TextField
           type="number"
           defaultValue={this.props.data.budget}
           onChange={this.handleBudget.bind(this)}/><br />
        Current cost so far: 
        <span style={
          this.getTotalPrice() <= data.budget ?
          {color: '#009900'}:
          {color: '#F44336'}}> ${this.getTotalPrice()}</span>
        </CardText>
      </div> : ''


    return (
      <Card>
        <TextField
          hintText="Name Your Itinerary"
          onChange={this.handleTitle.bind(this)}/><br />
        <div>
        <Checkbox
          checkedIcon={<EditorAttachMoney />}
          iconStyle={{color: "#00cc00"}}
          uncheckedIcon={<EditorAttachMoney />}
          label="Budgeting"
          onCheck={this.checkBudgeting.bind(this)}
        />
        {budgetField}
        {planBuilder.map((activity, index) => 
          <ConfirmItem
            key={index}
            activity={activity}
            order={alphabetOrder[index] + '.'}
            openSnackbar={this.props.openSnackbar}
            editPriceChange={price => this.props.editPrice(index, price)}
            editDescChange={(text) => this.props.editDescription(index, text)}
            onDeleteFromBuilderClicked={() => this.props.deleteFromBuilder(activity)}
            onMoveUpClicked={() => {
              this.props.reorderUp(planBuilder.indexOf(activity));
              
            }}
            onMoveDownClicked={() => {
              this.props.reorderDown(planBuilder.indexOf(activity));
              }}/>
        )}
        </div>
        <FlatButton
          onClick={() => this.saveItinerary()}>
          Save Itinerary
        </FlatButton>
        <SavePlan
          toggleModal={this.toggleModal.bind(this)}
          toggleSnackbar={this.toggleSnackbar.bind(this)}
          planTitle={this.state.planTitle}
          plan_id={this.state.plan_id}
          modalOpen={this.state.modalOpen}/>
        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          autoHideDuration={2000} />
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    planBuilder: state.planBuilder,
    auth: state.auth,
    data: state.data
  }
}

export default connect(
  mapStateToProps,
  { addToBuilder,
    deleteFromBuilder,
    reorderUp,
    reorderDown,
    changingRoutes,
    editDescription,
    createPlan,
    editDescription,
    editPrice,
    deleteActivityFromDb,
    saveActivityToDb,
    updateActivity,
    receiveBudget }
)(ConfirmContainer)