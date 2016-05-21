import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addToBuilder,
        deleteFromBuilder,
        reorderUp,
        reorderDown,
        goToConfirm,
        editPrice,
        receiveBudget } from '../actions';
import PlanBuilderItem from '../components/PlanBuilderItem';
import CreateActivity from '../components/CreateActivity';
import Maps from '../components/Maps';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardText } from 'material-ui/Card';
import EditorAttachMoney from 'material-ui/svg-icons/editor/attach-money';
import { isLoggedIn } from '../utils';
import TextField from 'material-ui/TextField';


class PlanBuilderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      budgeting: false,
      budgetingButtonColor: "#000000",
      open: true
    };
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  handleBarToggle() {
    this.setState({
      open: !this.state.open
    });
  }


  goToConfirm() {
    if (!!isLoggedIn()) {
      this.props.goToConfirm();
    } else {
      this.props.openSnackbar("Please sign in or create a profile to continue");
    }
  }

  openCreate() {
    if (!!isLoggedIn()) {
      this.toggleModal();
    } else {
      this.props.openSnackbar("Please sign in or create a profile to continue");
    }
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

  getTotalPrice() {
    var total = 0;
    this.props.planBuilder.forEach(activity => {
      if (activity.price) { 
        total += parseInt(activity.price) ;
      }});
    return total;
  }

  render() {
    const { planBuilder, activities, auth, data } = this.props;
    const hasActivities = planBuilder.length > 0;
    const alphabetOrder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const nodes = !hasActivities ?
      <CardText>
        <em>Start building your plan here!</em>
      </CardText> :
      <div>
        <div>
        {planBuilder.map((activity, index) =>
          <PlanBuilderItem
            key={index}
            activity={activity}
            order={alphabetOrder[index] + '.'}
            openSnackbar={this.props.openSnackbar}
            editPriceChange={price => this.props.editPrice(index, price)}
            onDeleteFromBuilderClicked={() => this.props.deleteFromBuilder(activity)}
            onMoveUpClicked={() => {
              this.props.reorderUp(planBuilder.indexOf(activity));

            }}
            onMoveDownClicked={() => {
              this.props.reorderDown(planBuilder.indexOf(activity));

            }}/>
        )}
        </div>
      </div>

    return (
      <div>
        <div className="row" style={{marginBottom: 10}}>
          <Maps size="small" />
        </div>
        <Card style={cardColumnStyle}>
          <div className="planBuilder-btns">
            <CreateActivity
              modal={this.state.modalOpen}
              toggleModal={this.toggleModal.bind(this)}
              openSnackbar={this.props.openSnackbar}
              addFromCreate={(activity) => this.props.addToBuilder(activity)}
              user_id={auth.user_id}/>
            <RaisedButton
              secondary={true}
              label="Create Own Activity"
              onClick={this.openCreate.bind(this)} />
            <RaisedButton
              secondary={true}
              label="Clear All"
              onClick={() => planBuilder.forEach(element => this.props.deleteFromBuilder(element))} />
            <RaisedButton
              secondary={!this.state.budgeting}
              label="Budgeting"
              labelPosition="after"
              onClick={this.checkBudgeting.bind(this)}
              icon={<EditorAttachMoney />}
              labelColor={this.state.budgetingButtonColor}
            />
          </div>
            <br />
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
          {nodes}
        </Card>
          <div>
            <RaisedButton
              label="Confirm"
              primary="true"
              onClick={this.goToConfirm.bind(this)}
              style={{position: "relative", float: "right", marginTop: 15, marginBottom: 25}}
              disabled={hasActivities ? false : true} />
          </div>
      </div>
    )
  }
}

var cardColumnStyle = {
 paddingTop: 15,
 paddingBottom: 15,
 paddingLeft: 15,
 paddingRight: 15
}

// var budgetFieldStyle = {
//   marginLeft: 15,
//   marginRight: 15,
//   marginBottom: 15,
//   flexDirection: 'row',
//   justifyContent: 'flex-end'
// }

PlanBuilderContainer.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    city: PropTypes.string
  })).isRequired
}

const mapStateToProps = (state) => {
  return {
    planBuilder: state.planBuilder,
    activities: state.activities,
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
    goToConfirm,
    editPrice,
    receiveBudget }
)(PlanBuilderContainer)

