import React from 'react';
import { H5PContext } from "../../context/H5PContext";

export default class SceneScores extends React.Component {
  constructor(props) {
    super(props);
  }

  render() { 
    const items = []
    for (const [title, score] of Object.entries(this.props.sceneScores.scores)){
      items.push(<tr><td>{title}</td><td>{score}</td></tr>)
    }
    return (
      <tbody>
        <tr><td>Scene: {this.props.sceneId}</td></tr>
        {items}
      </tbody>
    );
  }
}

SceneScores.contextType = H5PContext;


