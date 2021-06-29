// @ts-check

import React from "react";

import { H5PContext } from "../../../context/H5PContext";
import {
  createAudioPlayer,
  isInteractionAudio,
  isPlaylistAudio,
  isSceneAudio,
  fadeAudioInAndOut,
} from "../../../utils/audio-utils";
import Button from "./Button/Button";

/**
 * @typedef {{
 *   sceneAudioTrack: Array<unknown>;
 *   sceneId: string;
 *   playlistId: string;
 *   onIsPlaying: (playerId: string) => void;
 *   playerId: string;
 *   isPlaying: string;
 *   isHiddenBehindOverlay: boolean;
 *   sceneWasPlaying: string;
 *   onSceneWasPlaying: (playerId: string) => void;
 *   restartAudioOnSceneStart: boolean;
 *   updateSceneAudioPlayers: (players) => void;
 *   interactionAudioPlayers: Array;
 * }} Props
 */
export default class AudioButton extends React.Component {
  /**
   * @param {Props} props
   */
  constructor(props) {
    super(props);

    /** @type {Props} */
    this.props = this.props;

    // Separate players for the different scenes
    this.players = {};
  }

  /**
   * Determine player ID
   *
   * @return {string}
   */
  getPlayerId = () => {
    if (
      this.props.sceneId !== undefined &&
      this.props.sceneAudioTrack?.length &&
      !this.props.playlistId
    ) {
      return "scene-" + this.props.sceneId;
    }

    if (
      this.props.playlistId !== undefined &&
      this.props.sceneAudioTrack?.length
    ) {
      return "playlist-" + this.props.playlistId;
    }

    if (this.context.behavior.audio?.length) {
      return "global";
    }

    if (
      this.context.behavior.playlist &&
      this.context.behavior.audioType === "playlist"
    ) {
      return "playlist-" + this.context.behavior.playlist;
    }
  };

  /**
   * Get track from given player ID
   *
   * @param {string} id
   * @return {Array}
   */
  getTrack = (id) => {
    return id === "global"
      ? this.context.behavior.audio
      : this.props.sceneAudioTrack;
  };

  /**
   * Get the audio player for the current track.
   *
   * @param {string} id
   * @return {HTMLAudioElement} or 'null' if track isn't playable.
   */
  getPlayer = (id) => {
    if (!id) {
      return null;
    }
    const playerId = this.props.playerId || this.context.contentId;

    // Create player if none exist
    if (this.players[id] === undefined) {
      this.players[id] = createAudioPlayer(
        playerId,
        this.getTrack(id),
        () => {
          this.props.onIsPlaying(id);
          if (!this.players[id].audioTrack) {
            this.players[id].audioTrack = 0;
          }
        },
        () => {
          // Current track ended, and player is playlist with multiple tracks (else it is looped)
          const currentTrackNumber = this.players[id].audioTrack
            ? this.players[id].audioTrack
            : 0;
          const trackList = this.getTrack(id);
          const newTrackNumber =
            trackList.length - 1 === currentTrackNumber
              ? 0
              : currentTrackNumber + 1;
          const newTrackPath = H5P.getPath(
            trackList[newTrackNumber].path,
            this.context.contentId
          );
          const currentPlayer = this.players[id];
          // Play next track
          currentPlayer.audioTrack = newTrackNumber;
          currentPlayer.src = newTrackPath;
          currentPlayer.load();
          currentPlayer.play();
          this.props.onIsPlaying(id);
        },
        () => {
          if (this.props.isPlaying === id) {
            this.props.onIsPlaying(null);
          }
        },
        (!this.props.playlistId || this.getTrack(id).length < 2)
      );
    }

    this.props.updateSceneAudioPlayers(this.players);

    return this.players[id];
  };

  /**
   * Handle audio button clicked
   */
  handleClick = () => {
    // Determine player ID
    const id = this.getPlayerId();
    const player = this.getPlayer(id);
    if (player) {
      if (id === this.props.isPlaying) {
        // Reset sceneWasPlaying
        this.props.onSceneWasPlaying(null);

        // Pause and reset the player
        fadeAudioInAndOut(player, null, false);
      } else {
        // Find out if there is an interaction playing
        const lastPlayer = isInteractionAudio(this.props.isPlaying) 
          ? this.props.interactionAudioPlayers[this.props.isPlaying] 
          : null;
          
        // Pause if lastplayer, then start the playback!
        fadeAudioInAndOut(lastPlayer, player, true);
      }
    }
  };

  /**
   * Handle audio started playing
   */
  handlePlay = () => {
    this.setState({
      isPlaying: true,
    });
  };

  /**
   * Handle audio stopped playing
   */
  handleStop = () => {
    this.setState({
      isPlaying: false,
    });
  };

  /**
   * @param {Props} prevProps
   */
  componentDidUpdate(prevProps) {
    if (this.props.isPlaying && this.props.isPlaying !== prevProps.isPlaying) {
      // The Audio Player has changed

      if (
        isSceneAudio(prevProps.isPlaying) ||
        isPlaylistAudio(prevProps.isPlaying)
      ) {
        // Thas last player was us, we need to stop it

        const lastPlayer = this.getPlayer(prevProps.isPlaying);
        if (lastPlayer) {
          // Save the prev player from this scene
          this.props.onSceneWasPlaying(prevProps.isPlaying);

          // Pause and reset the last player
          fadeAudioInAndOut(lastPlayer, null, false);
        }
      }
    }

    if (isSceneAudio(this.props.isPlaying) || isPlaylistAudio(this.props.isPlaying)) {
      // We are playing something

      const currentPlayerId = this.getPlayerId();
      if (this.props.isPlaying !== currentPlayerId) {
        // We are playing the audio track from another scene... we need to change track!

        const isPlayer = this.getPlayer(this.props.isPlaying);
        const currentPlayer = this.getPlayer(currentPlayerId);
        // Pause and reset last player, and start the current player
        fadeAudioInAndOut(isPlayer, currentPlayer, false);
      }
    }

    if (isSceneAudio(this.props.isPlaying) || isPlaylistAudio(this.props.isPlaying)) {
      const isNewScene = this.props.sceneId !== prevProps.sceneId; 
      if (this.props.restartAudioOnSceneStart && isNewScene) {
        const currentPlayerId = this.getPlayerId();
        const player = this.getPlayer(currentPlayerId);
        
        if (isPlaylistAudio(currentPlayerId)) { 
          // Pause 
          player.pause();

          // Get the first track
          const trackList = this.getTrack(currentPlayerId);
          const newTrackPath = H5P.getPath(
            trackList[0].path,
            this.context.contentId
          );
          player.audioTrack = 0;
          player.src = newTrackPath;
          player.load();
          
          // Play
          player.play();
        } 
        else {
          player.currentTime = 0;
        }
      }
    }

    if (
      !this.props.isPlaying &&
      this.props.sceneWasPlaying &&
      isInteractionAudio(prevProps.isPlaying)
    ) {
      // An interaction audio is over and we played scene audio or global audio before that!

      const lastPlayer = this.getPlayer(this.props.sceneWasPlaying);
      const currentPlayerId = this.getPlayerId();

      if (lastPlayer && this.props.sceneWasPlaying === currentPlayerId) {
        // Play the scene audio or global audio if it matches the current scene
        fadeAudioInAndOut(null, lastPlayer, false);
      } else if (currentPlayerId) {
        // Else the user moved directly to new scene when playing interaction audio
        const currentPlayer = this.getPlayer(currentPlayerId);

        if (currentPlayer) {
          // Then play the current scene audio or global audio
          fadeAudioInAndOut(null, currentPlayer, false);
        }
      }
    }
  }

  /**
   * React - adds dom elements.
   */
  render() {
    const id = this.getPlayerId();
    if (!id) {
      return null;
    }

    const type = "audio-track" + (this.props.isPlaying === id ? " active" : "");
    return (
      <Button
        type={type}
        label={
          this.props.isPlaying === id
            ? this.context.l10n.pauseAudioTrack
            : this.context.l10n.playAudioTrack
        }
        isHiddenBehindOverlay={this.props.isHiddenBehindOverlay}
        onClick={this.handleClick}
      />
    );
  }
}

AudioButton.contextType = H5PContext;
