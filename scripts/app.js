import React from 'react';
import ReactDOM from "react-dom";
import Main from "./components/Main";
import {H5PContext} from './context/H5PContext';
import {sceneRenderingQualityMapping} from "./components/Scene/SceneTypes/ThreeSixtyScene";

// Load library
H5P = H5P || {};
H5P.ThreeImage = (function () {

  function Wrapper(params, contentId, extras) {
    extras = extras || {};
    this.forceStartScreen = (extras.forceStartScreen !== undefined
      && extras.forceStartScreen >= 0)
      ? extras.forceStartScreen : null;

    this.forceStartCamera = extras.forceStartCamera !== undefined
      ? extras.forceStartCamera : null;

    // Initialize event inheritance
    H5P.EventDispatcher.call(self);

    let wrapper;
    this.behavior = {
      label: {
        showLabel: false,
        labelPosition: 'right',
        ...params.behaviour.label
      },
      ...params.behaviour
    };
    this.l10n = {
      // Text defaults
      title: 'Virtual Tour',
      playAudioTrack: 'Play Audio Track',
      pauseAudioTrack: 'Pause Audio Track',
      sceneDescription: 'Scene Description',
      resetCamera: 'Reset Camera',
      submitDialog: 'Submit Dialog',
      closeDialog: 'Close Dialog',
      expandButtonAriaLabel: 'Expand the visual label',
      backgroundLoading: 'Loading background image...',
      noContent: 'No content',
      ...params.l10n,
    };

    // Parameters has been wrapped in the threeImage widget group
    if (params.threeImage) {
      params = params.threeImage;
    }
    this.params = params;
    this.contentId = contentId;
    this.extras = extras;
    this.sceneRenderingQuality = this.behavior.sceneRenderingQuality || 'high';

    const setCurrentSceneId = (sceneId) => {
      this.currentScene = sceneId;

      this.trigger('changedScene', sceneId);

      ReactDOM.render(
        <H5PContext.Provider value={this}>
          <Main
            forceStartScreen={this.forceStartScreen}
            forceStartCamera={this.forceStartCamera}
            currentScene={this.currentScene}
            setCurrentSceneId={setCurrentSceneId}
            addThreeSixty={ tS => this.threeSixty = tS }
            onSetCameraPos={setCameraPosition}
          />
        </H5PContext.Provider>,
        wrapper
      );

      window.requestAnimationFrame(() => {
        this.trigger('resize');
      });
    };

    const createElements = () => {
      wrapper = document.createElement('div');
      wrapper.classList.add('h5p-three-sixty-wrapper');

      this.currentScene = this.params.startSceneId;
      if (this.forceStartScreen) {
        this.currentScene = this.forceStartScreen;
      }

      ReactDOM.render(
        <H5PContext.Provider value={this}>
          <Main
            forceStartScreen={this.forceStartScreen}
            forceStartCamera={this.forceStartCamera}
            currentScene={this.currentScene}
            setCurrentSceneId={setCurrentSceneId}
            addThreeSixty={ tS => this.threeSixty = tS }
            onSetCameraPos={setCameraPosition}
          />
        </H5PContext.Provider>,
        wrapper
      );
    };

    this.reDraw = (forceStartScreen = this.currentScene) => {
      const sceneRenderingQuality = this.behavior.sceneRenderingQuality;
      if (sceneRenderingQuality !== this.sceneRenderingQuality
        && this.threeSixty) {
        this.setSceneRenderingQuality(sceneRenderingQuality);
      }

      if (forceStartScreen !== this.currentScene) {
        setCurrentSceneId(forceStartScreen);
        return;
      }

      ReactDOM.render(
        <H5PContext.Provider value={this}>
          <Main
            forceStartScreen={this.forceStartScreen}
            forceStartCamera={this.forceStartCamera}
            currentScene={this.currentScene}
            setCurrentSceneId={setCurrentSceneId}
            addThreeSixty={ tS => this.threeSixty = tS }
            onSetCameraPos={setCameraPosition}
          />
        </H5PContext.Provider>,
        wrapper
      );
    };

    this.attach = ($container) => {
      if (!wrapper) {
        createElements();
      }

      // Append elements to DOM
      $container[0].appendChild(wrapper);
      $container[0].classList.add('h5p-three-image');
    };

    this.getRect = () => {
      return wrapper.getBoundingClientRect();
    };

    this.on('resize', () => {
      const isFullscreen = wrapper.parentElement.classList.contains('h5p-fullscreen') || wrapper.parentElement.classList.contains('h5p-semi-fullscreen');
      const rect = this.getRect();
      // Fullscreen should use all of the space
      const ratio = (isFullscreen ? (rect.height / rect.width) : (9 / 16));

      wrapper.style.height = (isFullscreen ? '100%' : ((rect.width * ratio) + 'px'));

      // Apply separate styles for mobile
      if (rect.width <= 480)  {
        wrapper.classList.add('h5p-phone-size');
      }
      else {
        wrapper.classList.remove('h5p-phone-size');
      }
      if (rect.width < 768)  {
        wrapper.classList.add('h5p-medium-tablet-size');
      }
      else {
        wrapper.classList.remove('h5p-medium-tablet-size');
      }

      // Resize scene
      if (this.currentScene === null || !this.threeSixty) {
        return;
      }

      const updatedRect = wrapper.getBoundingClientRect();
      this.threeSixty.resize(updatedRect.width / updatedRect.height);
    });

    this.getRatio = () => {
      const rect = wrapper.getBoundingClientRect();
      return (rect.width / rect.height);
    };

    const setCameraPosition = (cameraPosition, focus) => {
      if (this.currentScene === null || !this.threeSixty) {
        return;
      }

      const [yaw, pitch] = cameraPosition.split(',');
      this.threeSixty.setCameraPosition(parseFloat(yaw), parseFloat(pitch));
      if (focus) {
        this.threeSixty.focus();
      }
    };

    this.getCamera = () => {
      if (this.currentScene === null || !this.threeSixty) {
        return;
      }

      return {
        camera: this.threeSixty.getCurrentPosition(),
        fov: this.threeSixty.getCurrentFov(),
      };
    };

    this.setSceneRenderingQuality = (quality) => {
      const segments = sceneRenderingQualityMapping[quality];
      this.threeSixty.setSegmentNumber(segments);
      this.sceneRenderingQuality = quality;
    };

    /**
     * Update parameters from editor.
     * @param {object} params Parameters to update with. Passed by reference!
     */
    this.updateParams = (params) => {
      this.params = params;
    }
  }

  return Wrapper;
})();
