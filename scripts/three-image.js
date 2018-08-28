H5P.ThreeImage = (function (
  EventDispatcher,
  Scene,
  ImagePopup,
  SceneDescription,
  TextDialog,
  Audio,
  StartScreen
) {

  /**
   * The 360 degree panorama viewer with support for virtual reality.
   *
   * @class H5P.ThreeSixty
   * @extends H5P.EventDispatcher
   * @param {DOMElement} sourceElement video or image source
   * @param {number} ratio Display ratio of the viewport
   * @param {Function} [sourceNeedsUpdate] Determines if the source texture needs to be rerendered.
   */
  function ThreeImage(parameters, contentId) {
    /** @alias H5P.ThreeImage# */
    var self = this;
    self.scenes = [];

    // Initialize event inheritance
    EventDispatcher.call(self);

    var wrapper;

    /**
     * Create the needed DOM elements
     *
     * @private
     */
    var createElements = function () {
      self.imageButtonIcon = self.getLibraryFilePath('assets/image.svg');
      self.navButtonIcon = self.getLibraryFilePath('assets/navigation.svg');
      self.infoButtonIcon = self.getLibraryFilePath('assets/info.svg');
      self.closeButtonIcon = self.getLibraryFilePath('assets/close.svg');
      self.audioOnButtonIcon = self.getLibraryFilePath('assets/soundon.svg');
      self.audioOffButtonIcon = self.getLibraryFilePath('assets/soundoff.svg');

      // Create wrapper
      wrapper = document.createElement('div');
      wrapper.classList.add('h5p-three-sixty-wrapper');

      self.imagePopup = new ImagePopup(wrapper, self.navButtonIcon);
      self.textDialog = new TextDialog(wrapper, self.closeButtonIcon);
      self.imageTextDialog = new TextDialog(wrapper, self.closeButtonIcon);
      self.sceneDescription = new SceneDescription(
        wrapper,
        self.textDialog,
        self.infoButtonIcon
      );
      if (parameters.audio && parameters.audio[0] && parameters.audio[0].path) {
        self.audio = new Audio(
          H5P.getPath(parameters.audio[0].path, contentId),
          wrapper,
          self.audioOnButtonIcon,
          self.audioOffButtonIcon
        );
      }
      console.log("what are my parameters today ?", parameters);

      if (parameters.startimage && parameters.startimage.enablestartimage) {
        self.startScreen = new StartScreen(
          wrapper,
          parameters.startimage,
          contentId,
          self.navButtonIcon,
          self.imageButtonIcon,
          self.infoButtonIcon,
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
        var src = image.imagesrc.path;
        self.imagePopup.setImage(H5P.getPath(src, contentId));
        self.imagePopup.setImageTexts(
          image.imagetexts,
          self.imageTextDialog,
          self.infoButtonIcon,
          self.closeButtonIcon
        );
        self.imagePopup.show();
      });

      self.imagePopup.on('hideImage', function () {
        self.sceneDescription.show();
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

  return ThreeImage;
})(H5P.EventDispatcher, H5P.ThreeImage.Scene, H5P.ThreeImage.ImagePopup,
  H5P.ThreeImage.SceneDescription, H5P.ThreeImage.TextDialog,
  H5P.ThreeImage.Audio, H5P.ThreeImage.StartScreen
);
