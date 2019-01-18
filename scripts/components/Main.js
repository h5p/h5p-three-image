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

    let startScene = 0;
    if (this.props.forceStartScreen) {
      startScene = this.props.forceStartScreen;
    }

    const isShowingAudio = this.props.parameters.audio
      && this.props.parameters.audio[0]
      && this.props.parameters.audio[0].path;

    this.threeJsScenes = [];

    this.state = {
      currentScene: startScene,
      currentImage: null,
      showingImagePopup: false,
      showingTextDialog: false,
      currentText: null,
      isShowingAudio: isShowingAudio,
      showingInteraction: false,
      currentInteraction: null,
    };
  }

  navigateToScene(sceneName) {
    const newScene = this.props.parameters.scenes.findIndex(scene => {
      return scene.scenename === sceneName;
    });

    this.setState({
      currentScene: newScene,
    });
    this.props.setCurrentScene(this.threeJsScenes[newScene]);
  }

  showImage(image) {
    this.setState({
      currentImage: image,
      showingImagePopup: true,
    });
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

    const scenes = this.context.params.scenes[this.state.currentScene];
    const interaction = scenes.interactions[interactionIndex];

    const library = H5P.libraryFromString(interaction.action.library);
    const machineName = library.machineName;

    if (machineName === 'H5P.GoToScene') {
      const nextSceneId = interaction.action.params.nextSceneId;
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

  addScene(scene) {
    this.threeJsScenes.push(scene);

    // Set current scene when it is first added
    if (this.threeJsScenes.length - 1 === this.state.currentScene) {
      this.props.setCurrentScene(this.threeJsScenes[this.state.currentScene]);
    }
  }

  render() {
    const sceneParams = this.props.parameters.scenes;
    const description = sceneParams[this.state.currentScene].scenedescription;

    const isShowingSceneDescription = !this.state.showingTextDialog
      && !this.state.showingImagePopup
      && description;

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
          this.state.isShowingAudio &&
          <Audio
            audioSrc={H5P.getPath(
              this.props.parameters.audio[0].path,
              this.props.contentId
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
              currentScene={this.state.currentScene}
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
              this.props.contentId
            )}
            imageTexts={this.state.currentImage.imagetexts}
            showTextDialog={this.showTextDialog.bind(this)}
          />
        }
        {
          this.props.parameters.scenes.map((sceneParams, sceneIndex) => {
            return (
              <Scene
                key={sceneIndex}
                isActive={sceneIndex === this.state.currentScene}
                sceneParams={sceneParams}
                addScene={this.addScene.bind(this)}
                imageSrc={H5P.getPath(sceneParams.scenesrc.path, this.props.contentId)}
                navigateToScene={this.navigateToScene.bind(this)}
                showImage={this.showImage.bind(this)}
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