import React from 'react';
import {H5PContext} from '../../context/H5PContext';
import ThreeSixtyScene from "./SceneTypes/ThreeSixtyScene";
import StaticScene from "./SceneTypes/StaticScene";

export const SceneTypes = {
  THREE_SIXTY_SCENE: '360',
  STATIC_SCENE: 'static',
  PREVIOUS_SCENE: -1,
};

export default class Scene extends React.Component {

  render() {
    if (this.props.sceneParams.sceneType === SceneTypes.STATIC_SCENE) {
      return (
        <StaticScene
          id={this.props.id}
          isActive={this.props.isActive}
          sceneParams={this.props.sceneParams}
          imageSrc={this.props.imageSrc}
          navigateToScene={this.props.navigateToScene.bind(this)}
          showInteraction={this.props.showInteraction.bind(this)}
          sceneHistory={this.props.sceneHistory}
        />
      );
    }

    return (
      <ThreeSixtyScene
        id={this.props.id}
        isActive={this.props.isActive}
        sceneParams={this.props.sceneParams}
        addScene={this.props.addScene.bind(this)}
        imageSrc={this.props.imageSrc}
        navigateToScene={this.props.navigateToScene.bind(this)}
        forceStartCamera={this.props.forceStartCamera}
        showInteraction={this.props.showInteraction.bind(this)}
      />
    );
  }
}
Scene.contextType = H5PContext;
