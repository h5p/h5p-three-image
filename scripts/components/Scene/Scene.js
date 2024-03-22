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
          isActive={this.props.isActive}
          isHiddenBehindOverlay={ this.props.isHiddenBehindOverlay }
          nextFocus={ this.props.nextFocus }
          sceneIcons={this.props.sceneIcons}
          sceneParams={this.props.sceneParams}
          imageSrc={this.props.imageSrc}
          navigateToScene={this.props.navigateToScene.bind(this)}
          showInteraction={this.props.showInteraction.bind(this)}
          sceneHistory={this.props.sceneHistory}
          audioIsPlaying={ this.props.audioIsPlaying }
          sceneId={ this.props.sceneId }
          onBlurInteraction={this.props.onBlurInteraction}
          onFocusedInteraction={this.props.onFocusedInteraction}
          focusedInteraction={this.props.focusedInteraction}
          sceneWaitingForLoad={this.props.sceneWaitingForLoad}
          doneLoadingNextScene={this.props.doneLoadingNextScene}
          canTakeFocus={this.props.canTakeFocus}
        />
      );
    }

    return (
      <ThreeSixtyScene
        threeSixty={this.props.threeSixty}
        updateThreeSixty={this.props.updateThreeSixty}
        isActive={this.props.isActive}
        isHiddenBehindOverlay={ this.props.isHiddenBehindOverlay }
        nextFocus={ this.props.nextFocus }
        sceneIcons={this.props.sceneIcons}
        sceneParams={this.props.sceneParams}
        addThreeSixty={ this.props.addThreeSixty }
        imageSrc={this.props.imageSrc}
        navigateToScene={this.props.navigateToScene.bind(this)}
        forceStartCamera={this.props.forceStartCamera}
        showInteraction={this.props.showInteraction.bind(this)}
        audioIsPlaying={ this.props.audioIsPlaying }
        sceneId={ this.props.sceneId }
        toggleCenterScene={ this.props.toggleCenterScene }
        onSetCameraPos={ this.props.onSetCameraPos }
        onBlurInteraction={this.props.onBlurInteraction}
        onFocusedInteraction={this.props.onFocusedInteraction}
        focusedInteraction={this.props.focusedInteraction}
        isEditingInteraction={this.props.isEditingInteraction}
        sceneWaitingForLoad={this.props.sceneWaitingForLoad}
        doneLoadingNextScene={this.props.doneLoadingNextScene}
        canTakeFocus={this.props.canTakeFocus}
      />
    );
  }
}
Scene.contextType = H5PContext;
