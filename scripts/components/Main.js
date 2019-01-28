import React from 'react';
import Audio from "./Scene/Audio";
import Scene, {SceneTypes} from "./Scene/Scene";
import SceneDescription from "./Scene/SceneDescription";
import Dialog from "./Dialog/Dialog";
import InteractionContent from "./Dialog/InteractionContent";
import {H5PContext} from "../context/H5PContext";
import './Main.scss';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showingTextDialog: false,
      currentText: null,
      showingInteraction: false,
      currentInteraction: null,
      sceneHistory: [],
    };
  }

  componentDidUpdate(prevProps) {
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
  }

  navigateToScene(sceneId) {
    let nextScene = null;
    if (sceneId === SceneTypes.PREVIOUS_SCENE) {
      const history = [...this.state.sceneHistory];
      nextScene = history.pop();
      this.skipHistory = true;
      this.setState({
        sceneHistory: history,
      });
    }
    else {
      nextScene = this.context.params.scenes.findIndex(scene => {
        return scene.sceneId === sceneId;
      });
    }

    this.props.setCurrentSceneIndex(nextScene);
  }

  showTextDialog(text) {
    this.setState({
      showingTextDialog: true,
      currentText: text,
    });
  }

  hideTextDialog() {
    this.setState({
      showingTextDialog: false,
      currentText: null,
    });
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
      // TODO: Handle Audio logic
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

  render() {
    const sceneParams = this.context.params.scenes;
    const scene = sceneParams.find(scene => {
      return scene.sceneId === this.props.currentScene;
    });
    const description = scene.scenedescription;

    const isShowingSceneDescription = !this.state.showingTextDialog
      && description;

    const isShowingAudio = this.context.params.audio
      && this.context.params.audio[0]
      && this.context.params.audio[0].path;

    return (
      <div>
        {
          isShowingSceneDescription &&
          <SceneDescription
            text={description}
            showTextDialog={this.showTextDialog.bind(this)}
          />
        }
        {
          isShowingAudio &&
          <Audio
            audioSrc={H5P.getPath(
              this.context.params.audio[0].path,
              this.context.contentId
            )}
          />
        }
        {
          this.state.showingInteraction &&
          this.state.currentInteraction !== null &&
          <Dialog
            onHideTextDialog={this.hideInteraction.bind(this)}
          >
            <InteractionContent
              currentScene={this.props.currentScene}
              currentInteraction={this.state.currentInteraction}
            />
          </Dialog>
        }
        {
          this.state.showingTextDialog && this.state.currentText &&
          <Dialog onHideTextDialog={this.hideTextDialog.bind(this)}>
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
                sceneParams={sceneParams}
                addScene={this.addScene.bind(this)}
                imageSrc={imageSrc}
                navigateToScene={this.navigateToScene.bind(this)}
                forceStartCamera={this.props.forceStartCamera}
                showInteraction={this.showInteraction.bind(this)}
                sceneHistory={this.state.sceneHistory}
              />
            );
          })
        }
      </div>
    );
  }
}

Main.contextType = H5PContext;