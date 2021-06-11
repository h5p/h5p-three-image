import React from 'react';
import './HUD.scss';

import { H5PContext } from '../../context/H5PContext';
import AudioButton from './Buttons/AudioButton';
import Button from './Buttons/Button/Button';
import {SceneTypes} from "../Scene/Scene";

export default class HUD extends React.Component {
  constructor(props) {
    super(props);
    this.buttons = {};
  }

  /**
   * Help pick the audio track for the given scene.
   *
   * @param {Object} scene
   * @return {Object}
   */
  getSceneAudioTrack = (scene) => {
    const props = {
      isPlaying: this.props.audioIsPlaying,
      onIsPlaying: this.props.onAudioIsPlaying,
      isHiddenBehindOverlay: this.props.isHiddenBehindOverlay,
      nextFocus: this.props.nextFocus
    };

    if (scene && scene.audio && scene.audio.length) {
      props.sceneAudioTrack = scene.audio;
      props.sceneId = scene.sceneId;
    }

    return props;
  }

  handleSceneDescription = () => {
    this.props.onSceneDescription(this.props.scene.scenedescription);
  }

  /**
   * React - create DOM elements
   */
  render() {
    const showScoresButton = this.props.showScoresButton;
    const isThreeSixty = this.props.scene.sceneType === SceneTypes.THREE_SIXTY_SCENE;

    return (
      <div className="hud" aria-hidden={ this.props.isHiddenBehindOverlay ? true : undefined }>
        <div className="hud-top-right">
        </div>
        <div className="hud-bottom-left">
          <AudioButton { ...this.getSceneAudioTrack(this.props.scene) }/>
          { this.props.scene.scenedescription &&
            <Button
              type={ 'scene-description' }
              label={ this.context.l10n.sceneDescription }
              isHiddenBehindOverlay={ this.props.isHiddenBehindOverlay }
              nextFocus={ this.props.nextFocus }
              onClick={ this.handleSceneDescription }
            />
          }
          {
            isThreeSixty &&
            <Button
              type={ 'reset' }
              label={ this.context.l10n.resetCamera }
              isHiddenBehindOverlay={ this.props.isHiddenBehindOverlay }
              nextFocus={ this.props.nextFocus }
              onClick={ this.props.onCenterScene }
            />
          }{
            <Button
              type={ 'go-to-start' }
              label={this.props.isStartScene ? this.context.l10n.userIsAtStartScene : this.context.l10n.goToStartScene}
              isHiddenBehindOverlay={ this.props.isHiddenBehindOverlay }
              nextFocus={ this.props.nextFocus }
              onClick={ this.props.onGoToStartScene }
              disabled = {this.props.isStartScene}
            />
          }{
            showScoresButton &&
            <Button
              type={ 'score-summary' }
              label={ this.context.l10n.scoreSummary }
              isHiddenBehindOverlay={ this.props.isHiddenBehindOverlay }
              nextFocus={ this.props.nextFocus }
              onClick={ this.props.onShowingScoreSummary }
            />
          }
          { false &&
            <Button
              type={ 'submit-dialog' }
              label={ this.context.l10n.submitDialog }
              isHiddenBehindOverlay={ this.props.isHiddenBehindOverlay }
              nextFocus={ this.props.nextFocus }
              onClick={ this.props.onSubmitDialog}
            />
          }
        </div>
      </div>
    );
  }
}

HUD.contextType = H5PContext;
