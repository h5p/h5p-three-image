import React from 'react';
import ReactDOM from 'react-dom';
import Scene from './scene';
import ImagePopup from './imagePopup';
import SceneDescription from './sceneDescription';
import TextDialog from './textDialog';
import Audio from './audio';
import StartScreen from './startScreen';

export default class ThreeImage {

  /**
   * 360 image view.
   *
   * @class H5P.ThreeSixty
   * @extends H5P.EventDispatcher
   * @param {DOMElement} sourceElement video or image source
   * @param {number} ratio Display ratio of the viewport
   * @param {Function} [sourceNeedsUpdate] Determines if the source texture needs to be rerendered.
   */
  constructor(h5pWrapper, parameters, contentId) {
    /** @alias H5P.ThreeImage# */
    var self = this;
    self.scenes = [];

    // Initialize event inheritance
    H5P.EventDispatcher.call(self);

    var wrapper;
    let src;
    let textDialogText = '';

    /**
     * Create the needed DOM elements
     *
     * @private
     */
    var createElements = function () {
      self.imageButtonIcon = h5pWrapper.getLibraryFilePath('assets/image.svg');
      self.navButtonIcon = h5pWrapper.getLibraryFilePath('assets/navigation.svg');
      self.infoButtonIconSrc = h5pWrapper.getLibraryFilePath('assets/info.svg');
      self.closeButtonIcon = h5pWrapper.getLibraryFilePath('assets/close.svg');
      self.audioOnButtonIcon = h5pWrapper.getLibraryFilePath('assets/soundon.svg');
      self.audioOffButtonIcon = h5pWrapper.getLibraryFilePath('assets/soundoff.svg');

      // Create wrapper
      wrapper = document.createElement('div');
      wrapper.classList.add('h5p-three-sixty-wrapper');

      const reactWrapper = document.createElement('div');
      self.reactWrapper = reactWrapper;
      wrapper.appendChild(reactWrapper);

      // self.imagePopup = new ImagePopup(wrapper, self.navButtonIcon);
      // self.textDialog = new TextDialog(wrapper, self.closeButtonIcon);
      // self.imageTextDialog = new TextDialog(wrapper, self.closeButtonIcon);
      self.sceneDescription = new SceneDescription(
        wrapper,
        // self.textDialog,
        null,
        self.infoButtonIconSrc
      );
      if (parameters.audio && parameters.audio[0] && parameters.audio[0].path) {
        self.audio = new Audio(
          H5P.getPath(parameters.audio[0].path, contentId),
          wrapper,
          self.audioOnButtonIcon,
          self.audioOffButtonIcon
        );
      }

      if (parameters.startimage && parameters.startimage.enablestartimage) {
        self.startScreen = new StartScreen(
          wrapper,
          parameters.startimage,
          contentId,
          self.navButtonIcon,
          self.imageButtonIcon,
          self.infoButtonIconSrc,
          self.closeButtonIcon
        );

        self.startScreen.on('exit', function () {
          if (!parameters.scenes) {
            return;
          }

          parameters.scenes.forEach(function (sceneParams, sceneIndex) {
            self.initScene(sceneParams, sceneIndex);
          });
        })

      }
      else {
        if (!parameters.scenes) {
          return;
        }

        parameters.scenes.forEach(function (sceneParams, sceneIndex) {
          self.initScene(sceneParams, sceneIndex);
        });
      }
    };

    self.showTextDialog = function (text) {
      textDialogText = text;
      ReactDOM.render(
        <div>
          <ImagePopup
            showing={true}
            navButtonIcon={self.navButtonIcon}
            infoButtonIconSrc={self.infoButtonIconSrc}
            onHidePopup={self.onHidePopup}
            imageSrc={H5P.getPath(src, contentId)}
            imageTexts={self.image.imagetexts}
            showTextDialog={self.showTextDialog}
          />
          <TextDialog
            showing={true}
            onHideTextDialog={self.onHideTextDialog}
            closeButtonIconSrc={self.closeButtonIcon}
            text={textDialogText}
          />
        </div>, self.reactWrapper);
    };

    self.onHidePopup = function () {
      ReactDOM.render(
        <div>
          <ImagePopup
            showing={false}
            navButtonIcon={self.navButtonIcon}
            infoButtonIconSrc={self.infoButtonIconSrc}
            onHidePopup={self.onHidePopup}
            imageSrc={H5P.getPath(src, contentId)}
            imageTexts={self.image.imagetexts}
            showTextDialog={self.showTextDialog}
          />
          <TextDialog
            showing={false}
            onHideTextDialog={self.onHideTextDialog}
            closeButtonIconSrc={self.closeButtonIcon}
            text={textDialogText}
          />
        </div>, self.reactWrapper);
      self.sceneDescription.show();
    };

    self.onHideTextDialog = function () {
      console.log("hiding text dialog...");
      ReactDOM.render(
        <div>
          <ImagePopup
            showing={true}
            navButtonIcon={self.navButtonIcon}
            infoButtonIconSrc={self.infoButtonIconSrc}
            onHidePopup={self.onHidePopup}
            imageSrc={H5P.getPath(src, contentId)}
            imageTexts={self.image.imagetexts}
            showTextDialog={self.showTextDialog}
          />
          <TextDialog
            showing={false}
            onHideTextDialog={self.onHideTextDialog}
            closeButtonIconSrc={self.closeButtonIcon}
            text={textDialogText}
          />
        </div>,
        self.reactWrapper
      )
    };

    self.initScene = function (sceneParams, sceneIndex) {
      var scene = new Scene(
        sceneParams,
        self.imageButtonIcon,
        self.navButtonIcon,
      );

      // Invalid scene
      if (!scene) {
        return;
      }

      self.scenes.push(scene);

      // Set up scene
      scene.init(H5P.getPath(sceneParams.scenesrc.path, contentId),
        function () {
          if (sceneIndex === 0) {
            wrapper.appendChild(scene.getElement());
            scene.activate();
            self.setSceneText(scene);
          }
        });

      // Listen for scene change
      scene.on('navigate', function (e) {
        self.navigateToScene(e.data);
      });

      // Listen for images
      scene.on('showImage', function (e) {
        self.sceneDescription.hide();
        var image = e.data;
        src = image.imagesrc.path;
        self.image = image;
        console.log("show image...");
        console.log("what is image texts", image.imagetexts);
        ReactDOM.render(
          <div>
            <ImagePopup
              showing={true}
              navButtonIcon={self.navButtonIcon}
              infoButtonIconSrc={self.infoButtonIconSrc}
              onHidePopup={self.onHidePopup}
              imageSrc={H5P.getPath(src, contentId)}
              imageTexts={self.image.imagetexts}
              showTextDialog={self.showTextDialog}
            />
            <TextDialog
              showing={false}
              closeButtonIconSrc={self.closeButtonIcon}
              onHideTextDialog={self.onHideTextDialog}
              text={textDialogText}
            />
          </div>,
          self.reactWrapper
        );
        // console.log("image text dialog", self.imageTextDialog);

        // self.imagePopup.setImageTexts(
        //   image.imagetexts,
        //   self.imageTextDialog,
        //   self.infoButtonIcon,
        //   self.closeButtonIcon
        // );
        // self.imagePopup.show();
      });
    };

    self.navigateToScene = function (sceneName) {
      // Make sure all other scenes have stopped rendering and been removed
      self.scenes.forEach(function (scene) {
        if (scene.isActive) {
          var activeScene = scene.getElement();
          if (activeScene) {
            wrapper.removeChild(scene.getElement());
          }
        }

        scene.stop();
      });

      var goToScene = self.scenes.find(function (scene) {
        return scene.getName() === sceneName;
      });

      if (goToScene) {
        wrapper.appendChild(goToScene.scene.element);
        goToScene.activate();
        self.setSceneText(goToScene);
      }
    };

    self.setSceneText = function (scene) {
      var text = scene.getText();
      self.sceneDescription.setText(text);

      if (text) {
        // Set text and display text icon
        self.sceneDescription.show();
      }
      else {
        // Remove text
        self.sceneDescription.hide();
      }
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
