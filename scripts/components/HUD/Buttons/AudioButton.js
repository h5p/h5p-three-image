import React from 'react';

import { H5PContext } from '../../../context/H5PContext';
import Button from "./Button/Button";

export default class AudioButton extends React.Component {
  constructor(props) {
    super(props);

    // Separate players for the different scenes
    this.players = {};

    this.state = {
      isPlaying: false
    };
  }

  /**
   * Determine player ID from given props
   *
   * @param {Object} props
   * @return {string}
   */
  getPlayerId = (props) => {
    if (props.sceneId && props.sceneAudioTrack && props.sceneAudioTrack.length) {
      return 'scene-' + props.sceneId;
    }
    if (this.context.behavior && this.context.behavior.length) {
      return 'global';
    }
  }

  /**
   * Get track from given player ID
   *
   * @param {string} props
   * @return {Array}
   */
  getTrack = (id) => {
    return (id === 'global' ? this.context.behavior : this.props.sceneAudioTrack);
  }

  /**
   * Get the audio player for the current track.
   *
   * @return {AudioElement} or 'null' if track isn't playable.
   */
  getPlayer = (id) => {
    // Create player if none exist
    if (this.players[id] === undefined) {
      this.players[id] = AudioButton.createAudioPlayer(
        this.context.contentId,
        this.getTrack(id),
        this.handlePlay,
        this.handleStop
      );
    }

    return this.players[id];
  }

  /**
   * Handle audio button clicked
   */
  handleClick = () => {
    // Determine player ID
    const id = this.getPlayerId(this.props);
    if (!id) {
      return; // Not found
    }

    const player = this.getPlayer(id);
    if (player) {
      if (this.state.isPlaying) {
        // Pause and reset the player
        player.pause();
        player.currentTime = 0;
      }
      else {
        // Start the playback!
        player.play();
      }
    }
  }

  /**
   * Handle audio started playing
   */
  handlePlay = () => {
    this.setState({
      isPlaying: true
    });
  }

  /**
   * Handle audio stopped playing
   */
  handleStop = () => {
    this.setState({
      isPlaying: false
    });
  }

  /**
   * React - runs after render.
   */
  componentDidUpdate(prevProps) {
    if (this.state.isPlaying) {
      const lastPlayerId = this.getPlayerId(prevProps);
      const currentPlayerId = this.getPlayerId(this.props);

      if (lastPlayerId !== currentPlayerId) {
        // The scene has a new audio track
        // stop the previous player
        const lastPlayer = this.getPlayer(lastPlayerId);
        if (lastPlayer) {
          // Pause and reset last player
          lastPlayer.pause();
          lastPlayer.currentTime = 0;
        }

        // and start the current player
        const currentPlayer = this.getPlayer(currentPlayerId);
        if (currentPlayer) {
          currentPlayer.play();
        }
      }
    }
  }

  /**
   * React - adds dom elements.
   */
  render() {
    const type = ('audio-track' + (this.state.isPlaying ? ' active' : ''));
    const hasPlayer = !!this.getPlayerId(this.props)
    if (!hasPlayer) {
      return null;
    }

    return (
      <Button
        type={ type }
        label={ this.context.l10n.playAudioTrack }
        onClick={ this.handleClick }
      >
      </Button>
    );
  }

  /**
   * Help create the audio player and find the approperiate source.
   *
   * @param {number} id Content ID
   * @param {Array} sources
   * @param {function} onPlay Callback
   * @param {function} onStop Callback
   */
  static createAudioPlayer(id, sources, onPlay, onStop) {
    // Check if browser supports audio.
    const player = document.createElement('audio');
    if (player.canPlayType !== undefined) {
      // Add supported source files.
      for (var i = 0; i < sources.length; i++) {
        if (player.canPlayType(sources[i].mime)) {
          var source = document.createElement('source');
          source.src = H5P.getPath(sources[i].path, id);
          source.type = sources[i].mime;
          player.appendChild(source);
        }
      }
    }

    if (!player.children.length) {
      player = null; // Not supported
    }
    else {
      player.controls = false;
      player.preload = 'auto';
      player.loop = true;
      player.addEventListener('play', onPlay);
      player.addEventListener('ended', onStop);
      player.addEventListener('pause', onStop);
    }

    return player;
  }
}

AudioButton.contextType = H5PContext;
