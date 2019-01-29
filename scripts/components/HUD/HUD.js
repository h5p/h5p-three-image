import React from 'react';
import './HUD.scss';

import AudioButton from './Buttons/AudioButton';

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
    if (scene && scene.audio && scene.audio.length) {
      return {
        sceneAudioTrack: scene.audio,
        sceneId: scene.sceneId
      };
    }
  }

  render() {
    return (
      <div className="hud">
        <div className="hud-bottom-left">
          <AudioButton { ...this.getSceneAudioTrack(this.props.scene) }/>
        </div>
      </div>
    );
  }
}
