import React from 'react';

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
    const navWrapperClasses = [
      'nav-button-wrapper',
      'h5p-static-button',
      'h5p-info-button',
      'h5p-audio-button',
      'show',
    ];

    if (this.state.isPlaying) {
      navWrapperClasses.push('mute');
    }

    const audioIcon = this.state.isPlaying
      ? this.props.audioOffIcon
      : this.props.audioOnIcon;

    return (
      <div className='audio-wrapper'>
        <audio
          ref={this.audioRef}
          className='hidden-audio'
          src={this.props.audioSrc}
          loop={true}
        />
        <div className={navWrapperClasses.join(' ')}>
          <div className='outer-nav-button'/>
          <div className='nav-button'>
            <img className='nav-button-icon' src={audioIcon}/>
          </div>
          <div
            className='nav-button-pulsar no-pulse'
            onClick={this.toggleAudio.bind(this)}
          />
        </div>
      </div>
    );
  }
}