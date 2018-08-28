H5P.ThreeImage = H5P.ThreeImage || {};

H5P.ThreeImage.Scene = (function (EventDispatcher) {

  function Scene(params, imageButtonIcon, navButtonIcon) {
    var self = this;
    self.isActive = false;
    self.scene = null;
    self.params = params;
    self.imageButtonIcon = imageButtonIcon;
    self.navButtonIcon = navButtonIcon;
    EventDispatcher.call(self);

    if (!params || !params.scenesrc || !params.scenesrc.path) {
      return;
    }

    self.addImageButtonToScene = function (yaw, pitch, image) {
      var navButtonWrapper = document.createElement('div');
      navButtonWrapper.classList.add('nav-button-wrapper');

      var outerNavButton = document.createElement('div');
      outerNavButton.classList.add('outer-nav-button');
      navButtonWrapper.appendChild(outerNavButton);

      var navButton = document.createElement('div');
      navButton.classList.add('nav-button');
      navButtonWrapper.appendChild(navButton);

      var navButtonIcon = document.createElement('img');
      navButtonIcon.src = self.imageButtonIcon;
      navButtonIcon.classList.add('nav-button-icon');
      navButton.appendChild(navButtonIcon);

      var navButtonPulsar = document.createElement('div');
      navButtonPulsar.classList.add('nav-button-pulsar');
      navButtonPulsar.addEventListener('click', function () {
        self.trigger('showImage', image);
      });
      navButtonWrapper.appendChild(navButtonPulsar);

      self.scene.add(navButtonWrapper, {yaw: yaw, pitch: pitch}, false);
    };

    self.addNavButtonToScene = function (yaw, pitch, sceneName) {
      var navButtonWrapper = document.createElement('div');
      navButtonWrapper.classList.add('nav-button-wrapper');

      var outerNavButton = document.createElement('div');
      outerNavButton.classList.add('outer-nav-button');
      navButtonWrapper.appendChild(outerNavButton);

      var navButton = document.createElement('div');
      navButton.classList.add('nav-button');
      navButtonWrapper.appendChild(navButton);

      var navButtonIcon = document.createElement('img');
      navButtonIcon.src = self.navButtonIcon;
      navButtonIcon.classList.add('nav-button-icon');
      navButton.appendChild(navButtonIcon);

      var navButtonPulsar = document.createElement('div');
      navButtonPulsar.classList.add('nav-button-pulsar');
      navButtonPulsar.addEventListener('click', function () {
        self.trigger('navigate', sceneName)
      });
      navButtonWrapper.appendChild(navButtonPulsar);

      self.scene.add(navButtonWrapper, {yaw: yaw, pitch: pitch}, false);
    };

    self.getElement = function () {
      return self.scene.element;
    };

    self.resize = function () {
      if (self.isActive && self.scene) {
        self.scene.resize();
      }
    };

    self.activate = function () {
      self.isActive = true;
      self.scene.resize();
      self.scene.startRendering();
    };

    self.stop = function () {
      self.isActive = false;
      self.scene.stopRendering();
    };

    self.getName = function () {
      return params.scenename;
    };

    self.init = function (imageSrc, callback) {
      var imageElement = document.createElement('img');
      imageElement.addEventListener('load', function () {
        self.scene = new H5P.ThreeSixty(this, 16 / 9);

        // Add buttons to scene
        self.addNavigationHotspots(params.navigationhotspots);
        self.addImageHotspots(params.sceneimages);

        if (callback) {
          callback();
        }
      });
      imageElement.src = imageSrc;
    };

    self.addNavigationHotspots = function (hotspots) {
      if (!hotspots) {
        return;
      }

      hotspots.forEach(function (hotspot) {
        var pos = hotspot.hotspotpos.split(',');
        var yaw = pos[0];
        var pitch = pos[1];

        self.addNavButtonToScene(yaw, pitch, hotspot.toscene);
      });
    };

    self.addImageHotspots = function (images) {
      if (!images) {
        return;
      }

      images.forEach(function (image) {
        var pos = image.imagepos.split(',');
        var yaw = pos[0];
        var pitch = pos[1];
        self.addImageButtonToScene(yaw, pitch, image);
      });
    };

    self.getText = function () {
      return self.params.scenedescription;
    }
  }


  return Scene;
})(H5P.EventDispatcher);