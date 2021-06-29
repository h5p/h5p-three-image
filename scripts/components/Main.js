import React from 'react';
import Scene, {SceneTypes} from "./Scene/Scene";
import Dialog from "./Dialog/Dialog";
import InteractionContent from "./Dialog/InteractionContent";
import {H5PContext} from "../context/H5PContext";
import './Main.scss';
import HUD from './HUD/HUD';
import NoScene from "./Scene/NoScene";
import PasswordContent from "./Dialog/PasswordContent";
import ScoreSummary from './Dialog/ScoreSummary';
import { 
  createAudioPlayer, 
  isInteractionAudio, 
  fadeAudioInAndOut, 
  isSceneAudio,
  isPlaylistAudio
} from "../utils/audio-utils";

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.audioPlayers = {};
    this.sceneAudioPlayers = {};

    this.state = {
      threeSixty: null,
      showingTextDialog: false,
      currentText: null,
      showingInteraction: false,
      showingPassword: false,
      showingScoreSummary: false,
      currentInteraction: null,
      sceneHistory: [],
      audioIsPlaying: null,
      sceneAudioWasPlaying: null,
      focusedInteraction: null,
      isEditingInteraction: false,
      nextFocus: null,
      sceneWaitingForLoad: null,
      scenesOpened: [],
      updateThreeSixty: false,
      startBtnClicked: false,
      /** @type {ScoreCard} */ scoreCard: {},
      labelBehavior: {
        showLabel: true,
        labelPosition: "right"
      }
    };
  }

  componentDidMount() {
    // Listen for focus to interaction
    this.context.on('focusInteraction', (e) => {
      this.setState({
        focusedInteraction: e.data[0],
        isEditingInteraction: e.data[1]
      });
    });

    // Update edit state to false after done editing event
    this.context.on('updateEditStateInteraction', () => {
      this.setState({
        isEditingInteraction: false
      });
    });
    // Show scene description when scene starts for the first time, if specified
	  if (!this.context.extras.isEditor && this.props.currentScene) {
      this.handleSceneDescriptionInitially(this.props.currentScene);
    }
    this.setState({scoreCard: this.initialScoreCard()});
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.updateThreeSixty) {
      this.setState({
        updateThreeSixty: false
      });
    }
    if (this.state.labelBehavior && this.context.behavior.label) {
      if ( this.state.labelBehavior.showLabel !== this.context.behavior.label.showLabel ||
        this.state.labelBehavior.labelPosition !== this.context.behavior.label.labelPosition
      ) {
        this.setState({
          labelBehavior: {
            showLabel: this.context.behavior.label.showLabel,
            labelPosition: this.context.behavior.label.labelPosition,
          },
          updateThreeSixty: true
        });
      }
    }
    if (this.state.startBtnClicked && this.props.currentScene !== this.context.params.startSceneId) {
      this.setState({
        startBtnClicked: false
      });
    }
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

      if (isInteractionAudio(prevState.audioIsPlaying)) {
        // Thas last player was us, we need to stop it

        const lastPlayer = this.getAudioPlayer(prevState.audioIsPlaying);
        fadeAudioInAndOut(lastPlayer, null, true);
      }
    }

    //Makes sure the user is warned before closing the window
    window.addEventListener('beforeunload', (e) => {
      if(e.target.body.firstChild.classList.contains("h5p-threeimage-editor")
        || (this.state.scoreCard.totalQuestionsCompleted === 0
            && this.state.scoreCard.totalCodesEntered === 0))
      {
        return;
      }
      e.preventDefault();
      e.returnValue = '';
    });
  }

  setFocusedInteraction(focusedInteraction) {
    this.setState({
      focusedInteraction: focusedInteraction,
    });
  }

  blurInteraction() {
    this.setState({
      focusedInteraction: null,
    });
  }

  /**
   * @returns {ScoreCard}
   */
  initialScoreCard() {
    /** @type {ScoreCard} */
    const scoreCard = {
      numQuestionsInTour: 0,
      totalQuestionsCompleted: 0,
      totalCodesEntered: 0,
      totalCodesUnlocked: 0,
      sceneScoreCards: {}
    };
    for(const sceneId in this.context.params.scenes){
      const scene = this.context.params.scenes[sceneId];
      scoreCard.sceneScoreCards[sceneId] = this.initialSceneScoreCard(scene);
      scoreCard.numQuestionsInTour += scoreCard.sceneScoreCards[sceneId].numQuestionsInScene
    }
    return scoreCard;
  }

  /**
   * @param {SceneParams} scene 
   * @returns {SceneScoreCard}
   */
  initialSceneScoreCard(scene) {
    /** @type {SceneScoreCard} */
    const sceneScoreCard = {
      title: scene.scenename,
      numQuestionsInScene: 0,
      scores: {}
    };

    if (scene.interactions) {
      for(let i = 0; i < scene.interactions.length; i++){
        const interaction = scene.interactions[i];
        const libraryName = H5P.libraryFromString(interaction.action.library).machineName;
        switch(libraryName) {
          case "H5P.Summary":
            sceneScoreCard.scores[i]={title: this.getScoreLabelFromInteraction(interaction), raw: 0, max: this.getQuestionMaxScore(interaction), scaled: 0};
            sceneScoreCard.numQuestionsInScene += 1;
            break;
          case "H5P.SingleChoiceSet":
            sceneScoreCard.scores[i]={title: this.getScoreLabelFromInteraction(interaction), raw: 0, max: this.getQuestionMaxScore(interaction), scaled: 0};
            sceneScoreCard.numQuestionsInScene += 1;
            break;
          case "H5P.Blanks":
            sceneScoreCard.scores[i]={title: this.getScoreLabelFromInteraction(interaction), raw: 0, max: this.getQuestionMaxScore(interaction), scaled: 0};
            sceneScoreCard.numQuestionsInScene += 1;
            break;
          case "H5P.MultiChoice":
            sceneScoreCard.scores[i]={title: this.getScoreLabelFromInteraction(interaction), raw: 0, max: this.getQuestionMaxScore(interaction), scaled: 0};
            sceneScoreCard.numQuestionsInScene += 1;
            break;
          default:
            // Noop
        }
      }
    }

    return sceneScoreCard;
  }

  getScoreLabelFromInteraction(interaction){
    return interaction.labelText ? interaction.labelText : interaction.action?.metadata?.title;
  }

  /**
   * @param {Interaction} interaction 
   * @returns {number} 
   */
  getQuestionMaxScore(interaction) {
    if(this.context.extras.isEditor){
      return 1;
    }

    const question = H5P.newRunnable(
      interaction.action,
      this.context.contentId
    );

    const libraryName = H5P.libraryFromString(interaction.action.library).machineName;
    if(libraryName === "H5P.Blanks"){
      question.createQuestions("");
    }

    return question.getMaxScore();
  }

  /**
   * @returns {boolean}
   */
  hasOneQuestion() {
    if(this.context.extras.isEditor || !this.context.params.scenes) {
      return false;
    }

    for(const sceneId in this.context.params.scenes){
      const scene = this.context.params.scenes[sceneId];
      for(let i = 0; i < scene?.interactions?.length; i++){
        const interaction = scene.interactions[i];
        const libraryName = H5P.libraryFromString(interaction.action.library).machineName;
        switch(libraryName) {
          case "H5P.Summary":
            return true;
          case "H5P.SingleChoiceSet":
            return true;
          case "H5P.Blanks":
            return true;
          case "H5P.MultiChoice":
            return true;
          default:
            // Noop
        }
      }
    }
    return false;
  }

  /**
   * @param {number} sceneId 
   */
  navigateToScene(sceneId) {
    this.setState({
      sceneWaitingForLoad: this.props.currentScene,
      focusedInteraction: null,
    });
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

    // Pause any playing interaction audio on navigation
    const isInteractionAudioPlaying = this.state.audioIsPlaying
      && isInteractionAudio(this.state.audioIsPlaying);
    if (isInteractionAudioPlaying) {
      const lastPlayer = this.getAudioPlayer(this.state.audioIsPlaying);
      fadeAudioInAndOut(lastPlayer, null, true);
    }

    // Show scene description when scene starts for the first time, if specified
    this.handleSceneDescriptionInitially(nextSceneId);

    this.props.setCurrentSceneId(nextSceneId);
  }

  /**
   * The user wants the scene description to display when the
   * scene starts for the first time, handling it.
   *
   * @param {number} sceneId
   */
   handleSceneDescriptionInitially = (sceneId) => {
    const prevOpened = this.state.scenesOpened.includes(sceneId);
    if (!prevOpened) {
      // Scene has not been opened before, find scene information
      const scene = this.context.params.scenes.find((/** @type {SceneParams} */ scene) => {
        return scene.sceneId === sceneId;
      });
      if (scene.showSceneDescriptionInitially) {
        // Show scene description, since specified
        this.handleSceneDescription(scene.scenedescription);
      }
      // Add scene to list of opened scenes
      const newSceneOpened = this.state.scenesOpened;
      newSceneOpened.push(sceneId);
      this.setState({
        scenesOpened: newSceneOpened
      });
    }
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
      nextFocus: null
    });
  }

  /**
   * The user wants to see the score summary, handling it.
   */
   handleScoreSummary = () => {
    this.setState({
      showingScoreSummary: true,
      nextFocus: null
    });
  }

  /**
   * The user wants to close the text dialog, handling it.
   */
  handleCloseTextDialog = () => {
    this.setState({
      showingTextDialog: false,
      showingScoreSummary: false,
      currentText: null,
      nextFocus: 'scene-description' // Should probably come in as an arg when opening the dialog
    });
  }

  /**
   * Get the audio player for the current track.
   *
   * @param {string} id
   * @param {Interaction} [interaction] Parameters (Only needed initially)
   * @return {HTMLAudioElement} or 'null' if track isn't playable.
   */
  getAudioPlayer = (id, interaction) => {
    // Create player if none exist
    if (this.audioPlayers[id] === undefined) {
      const noTrackToPlay = !interaction?.action?.params?.files?.length;
      if (noTrackToPlay) {
        return; // No track to play
      }
      this.audioPlayers[id] = createAudioPlayer(
        this.context.contentId,
        interaction.action.params.files,
        () => {
          this.setState({
            audioIsPlaying: id // Set state on starting to play
          });
        },
        () => {
          // Track ended, stop playing
          if (this.state.audioIsPlaying === id) {
            this.setState({
              audioIsPlaying: null  // Clear state on track ended
            });
          }
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

  /**
   * @param {number} interactionIndex 
   * @returns {Interaction}
   */
  getInteractionFromCurrentScene(interactionIndex) {
    const scene = this.context.params.scenes.find(
      scene => scene.sceneId === this.props.currentScene,
    );

    return scene.interactions[interactionIndex];
  }

  showInteraction(interactionIndex) {
    const interaction = this.getInteractionFromCurrentScene(interactionIndex);
    const library = H5P.libraryFromString(interaction.action.library);
    const machineName = library.machineName;

    //Check if it has password and is unlocked
    if (interaction.label && interaction.label.interactionPassword && !interaction.unlocked){
      this.setState({
        showingInteraction: true,
        currentInteraction: interactionIndex,
        showingPassword: true,
        nextFocus: null
      });
    }
    else if (machineName === 'H5P.GoToScene') {
      this.setState({
        currentInteraction: null,
      });

      const nextSceneId = parseInt(interaction.action.params.nextSceneId);
      this.navigateToScene(nextSceneId);
    }
    else if (machineName === 'H5P.Audio') {
      const playerId = 'interaction-' + this.props.currentScene + '-' + interactionIndex;
      if (this.state.audioIsPlaying === playerId) {
        // Pause and reset player
        const lastPlayer = this.getAudioPlayer(playerId);
        fadeAudioInAndOut(lastPlayer, null, true);
      }
      else {
        // Start current audio playback
        if (this.state.audioIsPlaying && (isSceneAudio(this.state.audioIsPlaying) || isPlaylistAudio(this.state.audioIsPlaying)) ) {
          this.setState({
            sceneAudioWasPlaying: this.state.audioIsPlaying
          });
        }
        const player = this.getAudioPlayer(playerId, interaction);
        const lastPlayer = 
          this.state.audioIsPlaying && isInteractionAudio(this.state.audioIsPlaying) 
            ? this.getAudioPlayer(this.state.audioIsPlaying) 
            : this.sceneAudioPlayers[this.state.audioIsPlaying];
        fadeAudioInAndOut(lastPlayer, player, false);
      }
    }
    else {
      // Show interaction in dialog by default
      this.setState({
        showingInteraction: true,
        currentInteraction: interactionIndex,
        showingPassword: false,
        nextFocus: null
      });

      // Save the last scene player if any
      if (this.state.audioIsPlaying && (isSceneAudio(this.state.audioIsPlaying) || isPlaylistAudio(this.state.audioIsPlaying)) ) {
        this.setState({
          sceneAudioWasPlaying: this.state.audioIsPlaying
        });
      }
    }
  }

  hideInteraction() {
    this.setState(prevState => ({
      showingInteraction: false,
      currentInteraction: null,
      nextFocus: 'interaction-' + prevState.currentInteraction
    }));

    // Play scene audio again if it was played before this interaction
    if (!this.state.audioIsPlaying && this.state.sceneAudioWasPlaying) {
      const lastplayer = this.sceneAudioPlayers[this.state.sceneAudioWasPlaying];
      fadeAudioInAndOut(null, lastplayer, false);
    }
  }

  hidePasswordDialog() {
    this.setState(prevState => ({
      showingPassword: false,
      currentInteraction: null,
      nextFocus: 'interaction-' + prevState.currentInteraction
    }));
  }

  addThreeSixty = (threeSixty) => {
    this.props.addThreeSixty(threeSixty);
    this.setState({
      threeSixty: threeSixty
    });
  }

  handleAudioIsPlaying = (id) => {
    this.setState({
      audioIsPlaying: id // Change the player
    });
  }

  handleSceneAudioWasPlaying = (id) => {
    this.setState({
      sceneAudioWasPlaying: id // Set the prev player
    });
  }

  getSceneAudioPlayers = (players) => {
    this.sceneAudioPlayers = players;
  }

  centerScene() {
    const sceneParams = this.context.params.scenes;
    const scene = sceneParams.find(scene => {
      return scene.sceneId === this.props.currentScene;
    });
    if (!scene) {
      return;
    }
    this.props.onSetCameraPos(scene.cameraStartPosition, true);
  }

  goToStartScene() {
    this.navigateToScene(this.context.params.startSceneId);
    this.setState({
      startBtnClicked: true
    });
  }

  doneLoadingNextScene() {
    this.setState({
      sceneWaitingForLoad: null,
    });
  }

  /**
   * @param {string} inputPassword 
   * @returns {boolean}
   */
  handlePassword(inputPassword) {
    const interaction = this.getInteractionFromCurrentScene(this.state.currentInteraction);
    const isCorrectPassword = interaction.label.interactionPassword.toLowerCase() === inputPassword.toLowerCase();
    interaction.unlocked = interaction.unlocked || isCorrectPassword;

    return isCorrectPassword;
  }

  /**
   * @param {number} sceneId 
   * @param {number} interactionId 
   * @param {SceneScoreCardScore} score 
   */
  updateScoreCard(sceneId, interactionId, score){
    this.state.scoreCard.totalQuestionsCompleted += 1;
    if(!this.state.scoreCard.sceneScoreCards[sceneId]){
      this.state.scoreCard[sceneId] = {};
    }
    this.state.scoreCard.sceneScoreCards[sceneId].scores[interactionId] = score;

    /** @type {SceneParams} */
    const scene = this.context.params.scenes.find(scene => {
      return scene.sceneId === sceneId;
    });
 
    scene.interactions[interactionId].isAnswered = true;
  }

  updateEscapeScoreCard(isUnlocked){
    const totalCodesEntered = this.state.scoreCard.totalCodesEntered + 1;
	const totalCodesUnlocked = this.state.scoreCard.totalCodesUnlocked + (isUnlocked ? 1 : 0);

    this.setState({ 
      scoreCard: {
        ...this.state.scoreCard,
        totalCodesEntered,
        totalCodesUnlocked,
      }
    });
  }


  render() {
    const sceneParams = this.context.params.scenes;
    if (!sceneParams) {
      return <NoScene label={this.context.l10n.noContent} />;
    }

    const scene = sceneParams.find(scene => {
      return scene.sceneId === this.props.currentScene;
    });
    if (!scene) {
      return null;
    }
    const isStartScene = this.props.currentScene === this.context.params.startSceneId;

    const isShowingInteraction = this.state.showingInteraction &&
      this.state.currentInteraction !== null;

    const currentInteraction = scene.interactions?.[this.state.currentInteraction];

    let dialogClasses = [];
    if (currentInteraction && isShowingInteraction) {
      const library = H5P.libraryFromString(currentInteraction.action.library);
      const interactionClass = library.machineName
        .replace('.', '-')
        .toLowerCase();

      dialogClasses.push(interactionClass);
    }
    const showInteractionDialog = this.state.showingInteraction && this.state.currentInteraction !== null;
    const showPasswordDialog = this.state.showingPassword && this.state.currentInteraction !== null;
    const showTextDialog = this.state.showingTextDialog && this.state.currentText;
    const showingScoreSummary = this.state.showingScoreSummary;
    // Whenever a dialog is shown we need to hide all the elements behind the overlay
    const isHiddenBehindOverlay = (showInteractionDialog || showTextDialog);

    let dialogTitle;

    if (showInteractionDialog) {
      dialogTitle = currentInteraction.action.metadata.title;
    }

    const sceneIcons = this.context.params.scenes.map(sceneParams => {
      return {
        id: sceneParams.sceneId,
        iconType: sceneParams.iconType,
      };
    });

    return (
      <div role="document" aria-label={ this.context.l10n.title }>
        { showInteractionDialog &&
        <Dialog
          title={ dialogTitle }
          onHideTextDialog={this.hideInteraction.bind(this)}
          dialogClasses={dialogClasses}
          focusOnTitle={!showPasswordDialog}
        >
          {showPasswordDialog ? <PasswordContent
              handlePassword={this.handlePassword.bind(this)}
              showInteraction={this.showInteraction.bind(this)}
              currentInteractionIndex={this.state.currentInteraction}
              currentInteraction={currentInteraction}
              isInteractionUnlocked={currentInteraction.unlocked}
              hint={currentInteraction.label.interactionPasswordHint}
              updateEscapeScoreCard={this.updateEscapeScoreCard.bind(this)}
            /> :
            <InteractionContent
              currentScene={this.props.currentScene}
              currentInteraction={this.state.currentInteraction}
              audioIsPlaying={this.state.audioIsPlaying}
              onAudioIsPlaying={this.handleAudioIsPlaying}
              updateScoreCard={this.updateScoreCard.bind(this)}
            />}
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
        { showingScoreSummary &&
              <ScoreSummary 
                title={this.context.l10n.scoreSummary}
                onHideTextDialog={  this.handleCloseTextDialog  }
                scores={this.state.scoreCard}></ScoreSummary>

        }
        {
          this.context.params.scenes.map(sceneParams => {
            return (
              <Scene
                key={sceneParams.sceneId}
                threeSixty={this.state.threeSixty}
                updateThreeSixty={this.state.updateThreeSixty}
                isActive={sceneParams.sceneId === this.props.currentScene}
                isHiddenBehindOverlay={ isHiddenBehindOverlay }
                sceneIcons={sceneIcons}
                sceneParams={sceneParams}
                nextFocus={ this.state.nextFocus }
                addThreeSixty={ this.addThreeSixty }
                imageSrc={sceneParams.scenesrc}
                navigateToScene={this.navigateToScene.bind(this)}
                forceStartCamera={this.props.forceStartCamera}
                showInteraction={this.showInteraction.bind(this)}
                sceneHistory={this.state.sceneHistory}
                audioIsPlaying={ this.state.audioIsPlaying }
                sceneId={sceneParams.sceneId}
                onSetCameraPos={ this.props.onSetCameraPos }
                onBlurInteraction={this.blurInteraction.bind(this)}
                onFocusedInteraction={this.setFocusedInteraction.bind(this)}
                focusedInteraction={this.state.focusedInteraction}
                isEditingInteraction={this.state.isEditingInteraction}
                sceneWaitingForLoad={this.state.sceneWaitingForLoad}
                doneLoadingNextScene={this.doneLoadingNextScene.bind(this)}
                startBtnClicked={this.state.startBtnClicked}
              />
            );
          })
        }
        <HUD
          scene={ scene }
          audioIsPlaying={ this.state.audioIsPlaying }
          sceneAudioWasPlaying={ this.state.sceneAudioWasPlaying }
          isHiddenBehindOverlay={ isHiddenBehindOverlay }
          nextFocus={ this.state.nextFocus }
          onAudioIsPlaying={ this.handleAudioIsPlaying }
          onSceneAudioWasPlaying={ this.handleSceneAudioWasPlaying }
          onSceneDescription={ this.handleSceneDescription }
          onSubmitDialog={ () => console.error('Please implement SubmitDialog') }
          onCenterScene={ this.centerScene.bind(this) }
          isStartScene = {isStartScene}
          onGoToStartScene={ this.goToStartScene.bind(this) }
          onShowingScoreSummary={this.handleScoreSummary}
          showScoresButton={this.context.behavior.showScoresButton && this.hasOneQuestion()}
          updateSceneAudioPlayers={ this.getSceneAudioPlayers }
          interactionAudioPlayers={ this.audioPlayers }
        />
      </div>
    );
  }
}

Main.contextType = H5PContext;
