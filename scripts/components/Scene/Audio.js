import React from 'react';
import NavigationButton, {Icons} from "../Shared/NavigationButton";
import './Audio.scss';

export default class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.audioRef = React.createRef();
    this.state = {
      isPlaying: false,
    };
  }

  toggleAudio() {
    this.setState((prevState) => {
      if (prevState.isPlaying) {
        this.audioRef.current.pause();
      }
      else {
        this.audioRef.current.play();
      }

      return {
        isPlaying: !prevState.isPlaying,
      };
    });
  }

  render() {
    const buttonClasses = [
      'h5p-audio-button',
      'bottom',
    ];

    // TODO: Update icon when play state is changed in css
    if (this.state.isPlaying) {
      buttonClasses.push('mute');
    }

    return (
      <div className='audio-wrapper'>
        <audio
          ref={this.audioRef}
          className='hidden-audio'
          src={this.props.audioSrc}
          loop={true}
        />
        <NavigationButton
          title={this.state.isPlaying ? 'Pause audio' : 'Play audio'}
          icon={Icons.AUDIO}
          buttonClasses={buttonClasses}
          clickHandler={this.toggleAudio.bind(this)}
        />
      </div>
    );
  }
}