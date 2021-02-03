import React from 'react';

import { H5PContext } from '../../../context/H5PContext';
import Button from "./Button/Button";

export default class AudioButton extends React.Component {
  constructor(props) {
    super(props);

    // Separate players for the different scenes
    this.players = {};
  }

  /**
   * Determine player ID from given props
   *
   * @param {Object} props
   * @return {string}
   */
  getPlayerId = (props) => {
    if (props.sceneId !== undefined && props.sceneAudioTrack && props.sceneAudioTrack.length) {
      return 'scene-' + props.sceneId;
    }
    if (this.context.behavior.audio && this.context.behavior.audio.length) {
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
    return (id === 'global' ? this.context.behavior.audio : this.props.sceneAudioTrack);
  }

  /**
   * Get the audio player for the current track.
   *
   * @param {string} id
   * @return {AudioElement} or 'null' if track isn't playable.
   */
  getPlayer = (id) => {
    if (!id) {
      return null;
    }
    
    // Create player if none exist
    if (this.players[id] === undefined) {
      this.players[id] = AudioButton.createAudioPlayer(
        this.context.contentId,
        this.getTrack(id),
        () => this.props.onIsPlaying(id),
        () => {
          if (this.props.isPlaying === id) {
            this.props.onIsPlaying(null);
          }
        },
        true
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
    const player = this.getPlayer(id);
    if (player) {
      if (id === this.props.isPlaying) {
        // Pause and reset the player
        player.pause();
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
    if (this.props.isPlaying && this.props.isPlaying !== prevProps.isPlaying) {
      // The Audio Player has changed

      if (AudioButton.isSceneAudio(prevProps.isPlaying)) {
        // Thas last player was us, we need to stop it

        const lastPlayer = this.getPlayer(prevProps.isPlaying);
        if (lastPlayer) {
          // Pause and reset the last player
          lastPlayer.pause();
        }
      }
    }

    if (AudioButton.isSceneAudio(this.props.isPlaying)) {
      // We are playing something

      const currentPlayerId = this.getPlayerId(this.props);
      if (this.props.isPlaying !== currentPlayerId) {
        // We are playing the audio track from another scene... we need to change track!

        const isPlayer = this.getPlayer(this.props.isPlaying);
        if (isPlayer) {
          // Pause and reset last player
          isPlayer.pause();
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
    const id = this.getPlayerId(this.props);
    if (!id) {
      return null;
    }

    const type = ('audio-track' + (this.props.isPlaying === id ? ' active' : ''));
    return (
      <Button
        type={ type }
        label={ this.props.isPlaying === id ? this.context.l10n.pauseAudioTrack : this.context.l10n.playAudioTrack }
        isHiddenBehindOverlay={ this.props.isHiddenBehindOverlay }
        onClick={ this.handleClick }
      />
    );
  }

  /**
   * Determine if the ID of the player belongs to a scene audio track.
   *
   * @param {string} id
   * @return {boolean}
   */
  static isSceneAudio(id) {
    return id && (id === 'global' || id.substr(0, 6) === 'scene-');
  }

  /**
   * Determine if the ID of the player belongs to a scene audio track.
   *
   * @param {string} id
   * @return {boolean}
   */
  static isInteractionAudio(id) {
    return id && (id.substr(0, 12) === 'interaction-');
  }

  /**
   * Determine if the ID of the player belongs to a video interaction.
   *
   * @param {string} id
   * @return {boolean}
   */
  static isVideoAudio(id) {
    return id && (id.substr(0, 6) === 'video-');
  }

  /**
   * Help create the audio player and find the approperiate source.
   *
   * @param {number} id Content ID
   * @param {Array} sources
   * @param {function} onPlay Callback
   * @param {function} onStop Callback
   * @param {boolean} loop
   */
  static createAudioPlayer(id, sources, onPlay, onStop, loop) {
    // Check if browser supports audio.
    let player = document.createElement('audio');
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
      player.loop = loop;
      player.addEventListener('play', onPlay);
      player.addEventListener('ended', onStop);
      player.addEventListener('pause', onStop);
    }

    return player;
  }
}

AudioButton.contextType = H5PContext;
