import React from 'react';
import Audio from "./Scene/Audio";

export default class Main extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.isShowingAudio &&
          <Audio
            audioSrc={this.props.audioSrc}
            audioOnIcon={this.props.audioOnButtonIcon}
            audioOffIcon={this.props.audioOffButtonIcon}
          />
        }
        {
          this.props.isShowingImagePopup &&
          <div>okay..</div>
        }
      </div>
    );
  }
}