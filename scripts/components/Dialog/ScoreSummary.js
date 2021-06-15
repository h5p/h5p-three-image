import React from 'react';
import Dialog from "./Dialog"
import SceneScores from "./SceneScores"
import { H5PContext } from "../../context/H5PContext";
import "./ScoreSummary.scss";

export default class ScoreSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  getTotalScores(scores){
    const totalScores = {score: 0, max:0};
    for(const scene in this.context.params.scenes){
      const sceneScores = scores[scene];
      for(const [id, score] of Object.entries(sceneScores.scores)){
          totalScores.score += score.raw;
          totalScores.max += score.max;  
      }
    }
    return totalScores;
  }
  
  render() {
    const items = []
    const totalScores = this.getTotalScores(this.props.scores.sceneScoreCards);
    for (const [sceneId, sceneScores] of Object.entries(this.props.scores.sceneScoreCards)) {
        items.push(<SceneScores sceneId={sceneId} sceneScores={sceneScores}></SceneScores>);
    }
    const children = (
    <div class="h5p-summary-table-pages">
      <table class="h5p-score-table">
        <thead>
          <tr>
            <th class="h5p-summary-table-header slide">{this.context.l10n.assignment}</th>
            <th class="h5p-summary-table-header score">{this.context.l10n.score} <span>/</span> {this.context.l10n.total.toLowerCase()}</th>
          </tr>
        </thead>
        {items}
        <tfoot>
          <tr><td class="h5p-td h5p-summary-task-title">Total:</td><td class="h5p-td h5p-summary-score-bar"><p>{totalScores.score}/{totalScores.max}</p></td></tr>
        </tfoot>
       </table>
    </div>);

    return (
      <Dialog
          title={this.props.title}
          onHideTextDialog={this.props.onHideTextDialog}
        >
          {children}
      </Dialog>
    );
  }
}

ScoreSummary.contextType = H5PContext;
