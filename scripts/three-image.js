import React from 'react';
import ReactDOM from 'react-dom';
import Scene from './components/Scene/Scene';
import ImagePopup from './components/ImageScene/ImagePopup';
import SceneDescription from './components/Scene/SceneDescription';
import TextDialog from './components/Shared/TextDialog';
import Audio from './components/Scene/Audio';

export default class ThreeImage {

  /**
   * 360 image view.
   *
   * @class H5P.ThreeSixty
   * @extends H5P.EventDispatcher
   * @param {DOMElement} sourceElement video or image source
   * @param {number} ratio Display ratio of the viewport
   * @param {Object} extras Extra properties
   * @param {Function} [sourceNeedsUpdate] Determines if the source texture needs to be rerendered.
   */
  constructor(h5pWrapper, parameters, contentId, extras) {
    /** @alias H5P.ThreeImage# */
    var self = this;
    self.scenes = [];
    extras = extras || {};
    self.forceStartScreen = (extras.forceStartScreen !== undefined
      && extras.forceStartScreen >= 0)
      ? extras.forceStartScreen : null;

    // Initialize event inheritance
    H5P.EventDispatcher.call(self);

    var wrapper;
    let textDialogText = '';

    // Parameters has been wrapped in the threeImage widget group
    if (parameters.threeImage) {
      parameters = parameters.threeImage;
    }

    /**
     * Create the needed DOM elements
     *
     * @private
     */
    var createElements = function () {
      // Create wrapper
      wrapper = document.createElement('div');
      wrapper.classList.add('h5p-three-sixty-wrapper');

      const reactWrapper = document.createElement('div');
      self.reactWrapper = reactWrapper;
      wrapper.appendChild(reactWrapper);

      self.audioWrapper = document.createElement('div');
      wrapper.appendChild(self.audioWrapper);

      self.imagePopupWrapper = document.createElement('div');
      wrapper.appendChild(self.imagePopupWrapper);

      ReactDOM.render(
        <ImagePopup showing={false}/>,
        self.imagePopupWrapper
      );

      self.sceneDescriptionWrapper = document.createElement('div');
      wrapper.appendChild(self.sceneDescriptionWrapper);


      self.sceneWrapper = document.createElement('div');
      wrapper.appendChild(self.sceneWrapper);


      const isShowingAudio = parameters.audio
        && parameters.audio[0]
        && parameters.audio[0].path;

      if (parameters.audio && parameters.audio[0] && parameters.audio[0].path) {
        const audioSrc = H5P.getPath(parameters.audio[0].path, contentId);

        ReactDOM.render(
          <Audio
            audioSrc={H5P.getPath(parameters.audio[0].path, contentId)}
          />,
          self.audioWrapper
        );
      }

      if (!parameters.scenes) {
        return;
      }

      let startScene = 0;
      if (self.forceStartScreen) {
        startScene = self.forceStartScreen;
      }
      self.currentScene = startScene;

      ReactDOM.render(
        <div>
          {
            parameters.scenes.map((sceneParams, sceneIndex) => {


              return (
                <Scene
                  key={sceneIndex}
                  isActive={sceneIndex === startScene}
                  sceneParams={sceneParams}
                  imageSrc={H5P.getPath(sceneParams.scenesrc.path, contentId)}
                  navigateToScene={self.navigateToScene}
                  showImage={self.showImage}
                />
              );
            })
          }
        </div>,
        self.sceneWrapper
      );

      const description = parameters.scenes[self.currentScene].scenedescription;

      ReactDOM.render(
        <SceneDescription
          showing={true}
          text={description}
          showTextDialog={self.showTextDialog.bind(self)}
        />,
        self.sceneDescriptionWrapper
      );

    };

    self.showImage = (image) => {
      const src = image.imagesrc.path;
      ReactDOM.render(
        <ImagePopup
          showing={true}
          onHidePopup={self.onHidePopup}
          imageSrc={H5P.getPath(src, contentId)}
          imageTexts={image.imagetexts}
          showTextDialog={self.showTextDialog}
        />,
        self.imagePopupWrapper
      );

      ReactDOM.render(
        null,
        self.reactWrapper
      );

      ReactDOM.render(
        null,
        self.sceneDescriptionWrapper
      );
    };

    self.navigateToScene = (sceneName) => {
      ReactDOM.render(
        <div>
          {
            parameters.scenes.map((sceneParams, sceneIndex) => {
              let isActive = false;
              if (sceneParams.scenename === sceneName) {
                isActive = true;
                self.currentScene = sceneIndex;
              }

              return (
                <Scene
                  key={sceneIndex}
                  isActive={isActive}
                  sceneParams={sceneParams}
                  imageSrc={H5P.getPath(sceneParams.scenesrc.path, contentId)}
                  navigateToScene={self.navigateToScene}
                  showImage={self.showImage}
                />
              );
            })
          }
        </div>,
        self.sceneWrapper
      );
    };

    self.showTextDialog = function (text) {
      textDialogText = text;
      ReactDOM.render(
        <TextDialog
          showing={true}
          onHideTextDialog={self.onHideTextDialog}
          text={textDialogText}
        />, self.reactWrapper);
    };

    self.onHidePopup = function () {
      ReactDOM.render(
        <ImagePopup showing={false}/>,
        self.imagePopupWrapper
      );

      ReactDOM.render(
        <TextDialog
          showing={false}
          onHideTextDialog={self.onHideTextDialog}
          text={textDialogText}
        />, self.reactWrapper);

      const description = parameters.scenes[self.currentScene].scenedescription;

      ReactDOM.render(
        <SceneDescription
          showing={true}
          text={description}
          showTextDialog={self.showTextDialog.bind(self)}
        />,
        self.sceneDescriptionWrapper
      );
    };

    self.onHideTextDialog = function () {
      ReactDOM.render(
        <TextDialog showing={false}/>,
        self.reactWrapper
      );
    };

    /**
     * Attach the image viewer to the H5P container.
     *
     * @param {H5P.jQuery} $container
     */
    self.attach = function ($container) {
      if (!wrapper) {
        createElements();
      }

      // Append elements to DOM
      $container[0].appendChild(wrapper);
      $container[0].classList.add('h5p-three-image');
    };

    // Handle resize
    self.on('resize', function () {
      wrapper.style.height = (wrapper.getBoundingClientRect().width * (9 / 16)) + 'px';
      self.scenes.forEach(function (scene) {
        scene.resize();
      });
    });
  }
}
