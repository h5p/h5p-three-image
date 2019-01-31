import React from 'react';
import './HUD.scss';

import { H5PContext } from '../../context/H5PContext';
import AudioButton from './Buttons/AudioButton';
import Button from './Buttons/Button/Button';

export default class HUD extends React.Component {
  constructor(props) {
    super(props);
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
      onIsPlaying: this.props.onAudioIsPlaying
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
    return (
      <div className="hud">
        <div className="hud-bottom-left">
          <AudioButton { ...this.getSceneAudioTrack(this.props.scene) }/>
          { this.props.scene.scenedescription &&
            <Button
              type={ 'scene-description' }
              label={ this.context.l10n.sceneDescription }
              onClick={ this.handleSceneDescription }
            />
          }
          { false &&
            <Button
              type={ 'reset' }
              label={ this.context.l10n.reset }
              onClick={ this.props.onReset }
            />
          }
          { false &&
            <Button
              type={ 'submit-dialog' }
              label={ this.context.l10n.submitDialog }
              onClick={ this.props.onSubmitDialog}
            />
          }
        </div>
      </div>
    );
  }
}

HUD.contextType = H5PContext;
