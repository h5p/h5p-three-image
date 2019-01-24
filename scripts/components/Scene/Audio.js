import React from 'react';
import NavigationButton from "../Shared/NavigationButton";
import './Audio.scss';
import audioOnIcon from '../../../assets/soundon.svg';
import audioOffIcon from '../../../assets/soundoff.svg';

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
      'bottom-row',
    ];

    if (this.state.isPlaying) {
      buttonClasses.push('mute');
    }

    const audioIcon = this.state.isPlaying
      ? audioOffIcon
      : audioOnIcon;

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
          isStatic={true}
          hasNoPulse={true}
          buttonIcon={audioIcon}
          buttonClasses={buttonClasses}
          clickHandler={this.toggleAudio.bind(this)}
        />
      </div>
    );
  }
}