import React from 'react';
import { H5PContext } from "../../context/H5PContext";

export default class SceneTotalScores extends React.Component {
  constructor(props) {
    super(props);
  }
  
  getSceneTitle(sceneId, sceneTitle){
    if(sceneTitle !== undefined && sceneTitle !== ""){
      return `${this.context.l10n.scene}: ${sceneTitle}`
    }
    return `${this.context.l10n.scene}: ${sceneId}`
  }

  render() {
    const sceneTitle = this.getSceneTitle(this.props.sceneId, this.props.sceneScores.title);
    const totalScore = 0;
    const items = []
    for (const [scoreId, score] of Object.entries(this.props.sceneScores.scores)){
        items.push(<tr key={scoreId}><td className="h5p-td h5p-summary-task-title">{score.title ? score.title : this.context.l10n.untitled}</td><td className="h5p-td h5p-summary-score-bar">{score.raw}/{score.max}</td></tr>)
    }
    return (
      <tbody>
        <tr><td class="h5p-td h5p-summary-task-title" colSpan={2}>{sceneTitle}</td></tr>
        {items}
      </tbody>
    );
  }
}

SceneTotalScores.contextType = H5PContext;
