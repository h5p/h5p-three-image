import React from 'react';
import Audio from "./Scene/Audio";
import Scene, {SceneTypes} from "./Scene/Scene";
import SceneDescription from "./Scene/SceneDescription";
import Dialog from "./Dialog/Dialog";
import InteractionContent from "./Dialog/InteractionContent";
import {H5PContext} from "../context/H5PContext";
import './Main.scss';
import HUD from './HUD/HUD';
import AudioButton from './HUD/Buttons/AudioButton';
import NoScene from "./Scene/NoScene";

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.audioPlayers = {};

    this.state = {
      showingTextDialog: false,
      currentText: null,
      showingInteraction: false,
      currentInteraction: null,
      sceneHistory: [],
      audioIsPlaying: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const validScenes = this.context.params.scenes.map(scene => {
      return scene.sceneId;
    });

    const prunedHistory = this.state.sceneHistory.filter(sceneId => {
      return validScenes.includes(sceneId);
    });

    // Scene has been removed from params, but not yet from history
    if (this.state.sceneHistory.length !== prunedHistory.length) {
      let lastElement = prunedHistory[prunedHistory.length - 1];
      // Remove current scene if it is at the top of the history
      while (lastElement === this.props.currentScene) {
        prunedHistory.pop();
        lastElement = prunedHistory.length
          ? prunedHistory[prunedHistory.length - 1]
          : null;
      }
      this.setState({
        sceneHistory: prunedHistory,
      });
    }
    if (this.props.currentScene !== prevProps.currentScene) {

      // We skip adding to history if we navigated backwards
      if (this.skipHistory) {
        this.skipHistory = false;
        return;
      }

      this.setState({
        sceneHistory: [
          ...this.state.sceneHistory,
          prevProps.currentScene,
        ],
      });
    }

    if (this.state.audioIsPlaying && this.state.audioIsPlaying !== prevState.audioIsPlaying) {
      // Something is playing audio

      if (AudioButton.isInteractionAudio(prevState.audioIsPlaying)) {
        // Thas last player was us, we need to stop it

        const lastPlayer = this.getAudioPlayer(prevState.audioIsPlaying);
        if (lastPlayer) {
          // Pause and reset the last player
          lastPlayer.pause();
          lastPlayer.currentTime = 0;
        }
      }
    }
  }

  navigateToScene(sceneId) {
    let nextSceneId = null;
    if (sceneId === SceneTypes.PREVIOUS_SCENE) {
      const history = [...this.state.sceneHistory];
      nextSceneId = history.pop();
      this.skipHistory = true;
      this.setState({
        sceneHistory: history,
      });
    }
    else {
      nextSceneId = this.context.params.scenes.find(scene => {
        return scene.sceneId === sceneId;
      }).sceneId;
    }

    this.props.setCurrentSceneId(nextSceneId);
  }


  /**
   * The user wants to see the scene description, handling it.
   *
   * @param {string} text Scene description
   */
  handleSceneDescription = (text) => {
    this.setState({
      showingTextDialog: true,
      currentText: text,
    });
  }

  /**
   * The user wants to close the text dialog, handling it.
   */
  handleCloseTextDialog = () => {
    this.setState({
      showingTextDialog: false,
      currentText: null,
    });
  }

  /**
   * Get the audio player for the current track.
   *
   * @param {string} id
   * @param {Object} [interaction] Parameters (Only needed initially)
   * @return {AudioElement} or 'null' if track isn't playable.
   */
  getAudioPlayer = (id, interaction) => {
    // Create player if none exist
    if (this.audioPlayers[id] === undefined) {
      if (!interaction || !interaction.action || !interaction.action.params ||
          !interaction.action.params.files ||
          !interaction.action.params.files.length) {
        return; // No track to play
      }
      this.audioPlayers[id] = AudioButton.createAudioPlayer(
        this.context.contentId,
        interaction.action.params.files,
        () => {
          this.setState({
            audioIsPlaying: id // Set state on starting to play
          });
        },
        () => {
          if (this.state.audioIsPlaying === id) {
            this.setState({
              audioIsPlaying: null  // Clear state on playing ended
            });
          }
        },
        false
      );
    }
    return this.audioPlayers[id];
  }

  showInteraction(interactionIndex) {
    const scene = this.context.params.scenes.find(scene => {
      return scene.sceneId === this.props.currentScene;
    });
    const interaction = scene.interactions[interactionIndex];

    const library = H5P.libraryFromString(interaction.action.library);
    const machineName = library.machineName;

    if (machineName === 'H5P.GoToScene') {
      const nextSceneId = parseInt(interaction.action.params.nextSceneId);
      this.navigateToScene(nextSceneId);
    }
    else if (machineName === 'H5P.Audio') {
      const playerId = 'interaction-' + scene.sceneId + '-' + interactionIndex;
      if (this.state.audioIsPlaying === playerId) {
        // Pause and reset player
        const lastPlayer = this.getAudioPlayer(playerId);
        if (lastPlayer) {
          lastPlayer.pause();
          lastPlayer.currentTime = 0;
        }
      }
      else {
        // Start current audio playback
        const player = this.getAudioPlayer(playerId, interaction);
        if (player) {
          player.play();
        }
      }
    }
    else {
      // Show interaction in dialog by default
      this.setState({
        showingInteraction: true,
        currentInteraction: interactionIndex,
      });
    }
  }

  hideInteraction() {
    this.setState({
      showingInteraction: false,
      currentInteraction: null,
    });
  }

  addScene(scene, sceneId) {
    this.props.addScene(scene, sceneId);
  }

  handleAudioIsPlaying = (id) => {
    this.setState({
      audioIsPlaying: id // Change the player
    });
  }

  centerScene() {
    const sceneParams = this.context.params.scenes;
    const scene = sceneParams.find(scene => {
      return scene.sceneId === this.props.currentScene;
    });
    if (!scene) {
      return;
    }

    this.props.onSetCameraPos(scene.cameraStartPosition);
  }

  render() {
    const sceneParams = this.context.params.scenes;
    if (!sceneParams) {
      return <NoScene />;
    }

    const scene = sceneParams.find(scene => {
      return scene.sceneId === this.props.currentScene;
    });
    if (!scene) {
      return null;
    }

    const showInteractionDialog = (this.state.showingInteraction && this.state.currentInteraction !== null);
    const showTextDialog = (this.state.showingTextDialog && this.state.currentText);

    // Whenever a dialog is shown we need to hide all the elements behind the overlay
    const isHiddenBehindOverlay = (showInteractionDialog || showTextDialog);

    let dialogTitle;
    if (showInteractionDialog) {
      dialogTitle = scene.interactions[this.state.currentInteraction].action.metadata.title;
    }

    return (
      <div role="document" aria-label={ this.context.l10n.title }>
        { showInteractionDialog &&
          <Dialog
            title={ dialogTitle }
            onHideTextDialog={this.hideInteraction.bind(this)}
          >
            <InteractionContent
              currentScene={this.props.currentScene}
              currentInteraction={this.state.currentInteraction}
              audioIsPlaying={ this.state.audioIsPlaying }
              onAudioIsPlaying={ this.handleAudioIsPlaying }
            />
          </Dialog>
        }
        { showTextDialog &&
          <Dialog
            title={ this.context.l10n.sceneDescription }
            onHideTextDialog={  this.handleCloseTextDialog  }
          >
            <div dangerouslySetInnerHTML={{__html: this.state.currentText }} />
          </Dialog>
        }
        {
          this.context.params.scenes.map(sceneParams => {
            const imageSrc = H5P.getPath(
              sceneParams.scenesrc.path,
              this.context.contentId
            );

            return (
              <Scene
                key={sceneParams.sceneId}
                isActive={sceneParams.sceneId === this.props.currentScene}
                isHiddenBehindOverlay={ isHiddenBehindOverlay }
                sceneParams={sceneParams}
                addScene={this.addScene.bind(this)}
                imageSrc={imageSrc}
                navigateToScene={this.navigateToScene.bind(this)}
                forceStartCamera={this.props.forceStartCamera}
                showInteraction={this.showInteraction.bind(this)}
                sceneHistory={this.state.sceneHistory}
                audioIsPlaying={ this.state.audioIsPlaying }
                sceneId={sceneParams.sceneId}
                onSetCameraPos={ this.props.onSetCameraPos }
              />
            );
          })
        }
        <HUD
          scene={ scene }
          audioIsPlaying={ this.state.audioIsPlaying }
          isHiddenBehindOverlay={ isHiddenBehindOverlay }
          onAudioIsPlaying={ this.handleAudioIsPlaying }
          onSceneDescription={ this.handleSceneDescription }
          onSubmitDialog={ () => console.error('Please implement SubmitDialog') }
          onCenterScene={ this.centerScene.bind(this) }
        />
      </div>
    );
  }
}

Main.contextType = H5PContext;
