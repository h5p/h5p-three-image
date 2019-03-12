import React from 'react';
import './InteractionContent.scss';
import {H5PContext} from '../../context/H5PContext';
import AudioButton from '../HUD/Buttons/AudioButton';

export default class InteractionContent extends React.Component {
  constructor(props) {
    super(props);

    this.contentRef = React.createRef();
    this.state = {
      isInitialized: false,
    };
  }

  componentDidMount() {
    if (!this.state.isInitialized) {
      this.initializeContent();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.state.isInitialized) {
      this.initializeContent();
    }

    if (this.props.audioIsPlaying && this.props.audioIsPlaying !== prevProps.audioIsPlaying) {
      // The Audio Player has changed

      if (AudioButton.isVideoAudio(prevProps.audioIsPlaying)) {
        // Thas last player was us, we need to stop it
        this.instance.pause();
      }
    }
  }

  initializeContent() {
    // Remove any old content
    while (this.contentRef.current.firstChild) {
      this.contentRef.current.removeChild(this.contentRef.current.firstChild);
    }

    const scene = this.context.params.scenes.find(scene => {
      return scene.sceneId === this.props.currentScene;
    });
    const interaction = scene.interactions[this.props.currentInteraction];
    const library = interaction.action;

    this.instance = H5P.newRunnable(
      library,
      this.context.contentId,
      H5P.jQuery(this.contentRef.current)
    );

    if (library.library.split(' ')[0] === 'H5P.Video') {
      this.instance.on('stateChange', e => {
        if (e.data === H5P.Video.PLAYING) {
          this.props.onAudioIsPlaying('video-' + scene.sceneId + '-' + this.props.currentInteraction);
        }
      });
    }

    this.setState({
      isInitialized: true,
    });

    if (this.instance.libraryInfo.machineName === 'H5P.Image') {
      const img = this.contentRef.current.children[0];
      const isWide = (this.instance.width > this.instance.height);
      img.style.width = isWide ? '100%' : 'auto';
      img.style.height = isWide ? 'auto' : '100%';
    }
  }

  render() {
    return (
      <div ref={this.contentRef} />
    );
  }
}

InteractionContent.contextType = H5PContext;
