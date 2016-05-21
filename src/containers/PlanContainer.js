import React, { Component } from 'react';
import PlanItem from '../components/PlanItem';
import AddComment from '../components/AddComment';
import CommentItem from '../components/CommentItem';
import PlanMaps from '../components/PlanMaps';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardHeader } from 'material-ui/Card';

export default class PlanContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentsOpen: false
    };
  }

  printScreen() {
    window.print();
  }

  toggleComments() {
    this.setState({
      commentsOpen: !this.state.commentsOpen
    });
  }
  
  render() {
    const plan = this.props.plan;
    const alphabetOrder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const comments = plan ?
      plan.comments.map((comment, index) => 
        <CommentItem
          key={index}
          comment={comment} />) : null;
                  
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h2 style={{marginLeft: 15, marginTop: 15}}>{plan ? plan.title : "Plan"}</h2>
            <FlatButton
              label="Print Plan"
              primary={true}
              onClick={this.printScreen.bind(this)} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <Card>
              <CardHeader
                title="Plan Details"
                subtitle={plan ? plan.desc : null} />
                {plan ?
                plan.activities.map((activity, index) =>
                  <PlanItem
                    key={index}
                    order={alphabetOrder[index] + '.'}
                    activity={activity} />
                  ) : null
                }
            </Card>
          </div>
          <div className="col-sm-6">
          <div>
          </div>
            <PlanMaps size="small" activities={plan ? plan.activities : null}/>
            <Card>
              <CardHeader
                title="Comments" 
                onClick={this.toggleComments.bind(this)}
                actAsExpander={true}
                showExpandableButton={true} />
                {this.state.commentsOpen ? 
                  <div>
                    <AddComment plan={plan}/>
                    {comments}
                  </div> : null}
            </Card>
          </div>
        </div>
      </div>
    )
  }
}



