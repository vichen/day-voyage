import React, { Component } from 'react';
import { connect } from 'react-redux';
import {deleteFromBuilder,
        reorderUp,
        reorderDown,
        editDescription,
        editPrice,
        createPlan,
        saveActivityToDb,
        receiveBudget } from '../actions';
import { bindActionCreators } from 'redux';
import ConfirmItem from '../components/ConfirmItem';
import SavePlan from '../components/SavePlan';
import TextField from 'material-ui/TextField';
import { Card, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import EditorAttachMoney from 'material-ui/svg-icons/editor/attach-money';

var shortid = require('shortid');

export class ConfirmContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      snackbar: false,
      message: '',
      plan_id: null,
      budgeting: this.props.data.budget > 0 ? true : false,
      budgetingButtonColor: this.props.data.budget? "#00cc00":"#000000"
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

  saveplan() {
    if (this.props.planTitle.length === 0) {
      this.toggleSnackbar("Please name your plan");
    } else {
      this.toggleModal();
      this.props.createPlan(Object.assign({}, {
        user_id: this.props.auth.user_id,
        clientside_id: shortid.generate(),
        title: this.props.planTitle,
        desc: this.props.planDesc,
        likes: 0
      }), [], (response) => {
        console.log('save itin response: ', response);
        this.setState({
          plan_id: response.data[0].id
        });
        var activities = [];
        this.props.planBuilder.forEach((activity, index) => {
          var activityIndex = index;
          if (activity.isYelp === false) {
            this.props.saveActivityToDb(Object.assign(activity, {
              isYelp: false,
              user_gen: false,
              clientside_id: shortid.generate(),
              plan_id: response.data[0].id,
              index: activityIndex
            }), this.props.auth.token.access_token);
          } else {
            this.props.saveActivityToDb(Object.assign(activity, {
              isYelp: true,
              user_gen: false,
              clientside_id: shortid.generate(),
              plan_id: response.data[0].id,
              index: activityIndex
            }), this.props.auth.token.access_token);
          }
        });
      });
    }
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
    this.setState({
      budgeting: !this.state.budgeting,
    })

    if (!this.state.budgeting) {
      this.setState({
        budgetingButtonColor: "#00cc00"
      })
    } else {
      this.setState({
        budgetingButtonColor: "#000000"
      })
    }
  }

  render() {
    const { planBuilder, auth, data } = this.props;
    const alphabetOrder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return (
      <div>
        <Card style={{padding: 15}}>
          <div className="confirm-budget-btn">
            <RaisedButton
              secondary={!this.state.budgeting}
              label="Budgeting"
              labelPosition="after"
              onClick={this.checkBudgeting.bind(this)}
              icon={<EditorAttachMoney />}
              labelColor={this.state.budgetingButtonColor}/>
          </div>
          {this.state.budgeting ?
            <div className="budget-field">
              <div>
                <h4>Enter Budget: $
                <TextField
                  style={{padding: 0, width: 50}}
                  type="number"
                  defaultValue={this.props.data.budget}
                  onChange={this.handleBudget.bind(this)}/></h4>
              </div>
              <div>
              <h4>Current cost so far:
              <span style={
                this.getTotalPrice() <= data.budget ?
                {color: '#00cc00'}:
                {color: '#F44336'}}> ${this.getTotalPrice()}</span></h4>
              </div>
            </div> : ''}

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
          <SavePlan
            toggleModal={this.toggleModal.bind(this)}
            toggleSnackbar={this.toggleSnackbar.bind(this)}
            planTitle={this.props.planTitle}
            plan_id={this.state.plan_id}
            modalOpen={this.state.modalOpen}/>
          <Snackbar
            open={this.state.snackbar}
            message={this.state.message}
            autoHideDuration={2000} />
        </Card>
        <div>
          <RaisedButton
            label="Save Plan"
            primary="true"
            onClick={this.saveplan.bind(this)}
            style={{position: "relative", float: "right", marginTop: 15, marginBottom: 25}}/>
        </div>
      </div>
    )
  }
}

var budgetFieldStyle = {
  marginLeft: 15,
  marginRight: 15,
  marginBottom: 15,
  flexDirection: 'row',
  justifyContent: 'flex-end'
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
  { deleteFromBuilder,
    reorderUp,
    reorderDown,
    editDescription,
    createPlan,
    editDescription,
    editPrice,
    saveActivityToDb,
    receiveBudget }
)(ConfirmContainer)
