import React from 'react';
import Audio from "./Scene/Audio";
import Scene from "./Scene/Scene";
import ImagePopup from "./ImageScene/ImagePopup";
import TextDialog from "./Shared/TextDialog";
import SceneDescription from "./Scene/SceneDescription";
import Dialog from "./Dialog/Dialog";
import InteractionContent from "./Dialog/InteractionContent";
import {H5PContext} from "../context/H5PContext";

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentImage: null,
      showingImagePopup: false,
      showingTextDialog: false,
      currentText: null,
      showingInteraction: false,
      currentInteraction: null,
    };
  }

  navigateToScene(sceneId) {
    const nextScene = this.context.params.scenes.findIndex(scene => {
      return scene.sceneId === sceneId;
    });

    this.props.setCurrentSceneIndex(nextScene);
  }

  hidePopup() {
    this.setState({
      currentImage: null,
      showingImagePopup: false,
    });
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

    // TODO:  Special libraries such as GoToScene and Audio needs special
    //        handling and should not open up into posters.

    const scenes = this.context.params.scenes[this.props.currentScene];
    const interaction = scenes.interactions[interactionIndex];

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
    const description = sceneParams[this.props.currentScene].scenedescription;

    const isShowingSceneDescription = !this.state.showingTextDialog
      && !this.state.showingImagePopup
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
          <TextDialog
            onHideTextDialog={this.hideTextDialog.bind(this)}
            text={this.state.currentText}
          />
        }
        {
          this.state.showingImagePopup && this.state.currentImage &&
          <ImagePopup
            onHidePopup={this.hidePopup.bind(this)}
            imageSrc={H5P.getPath(
              this.state.currentImage.imagesrc.path,
              this.context.contentId
            )}
            imageTexts={this.state.currentImage.imagetexts}
            showTextDialog={this.showTextDialog.bind(this)}
          />
        }
        {
          this.context.params.scenes.map((sceneParams, sceneIndex) => {
            const imageSrc = H5P.getPath(
              sceneParams.scenesrc.path,
              this.context.contentId
            );

            return (
              <Scene
                key={sceneIndex}
                id={sceneIndex}
                isActive={sceneIndex === this.props.currentScene}
                sceneParams={sceneParams}
                addScene={this.addScene.bind(this)}
                imageSrc={imageSrc}
                navigateToScene={this.navigateToScene.bind(this)}
                forceStartCamera={this.props.forceStartCamera}
                showInteraction={this.showInteraction.bind(this)}
              />
            );
          })
        }
      </div>
    );
  }
}

Main.contextType = H5PContext;