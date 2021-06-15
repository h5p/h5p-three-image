import 'core-js/stable';
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

    params.threeImage.scenes = Wrapper.addUniqueIdsToInteractions(params.threeImage.scenes);
    
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
      goToStartScene: 'Go to start scene',
      userIsAtStartScene: 'You are at the start scene',
      unlocked: 'Unlocked',
      locked: 'Locked',
      searchRoomForCode: 'Search the room until you find the code',
      wrongCode: 'The code was wrong, try again.',
      contentUnlocked: 'The content has been unlocked!',
      code: 'Code',
      showCode: 'Show code',
      hideCode: 'Hide code',
      unlockedStateAction: 'Continue',
      lockedStateAction: 'Unlock',
      hotspotDragHorizAlt: 'Drag horizontally to scale hotspot',
      hotspotDragVertiAlt: 'Drag vertically to scale hotspot',
      backgroundLoading: 'Loading background image...',
      noContent: 'No content',
      hint: 'Hint',
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
    
    
  }

  /**
  * Add unique ids to interactions.
  * The ids are used as key for mapping React components.
  * TODO: Create the ids in editor-time and store them in semantics
  *
  * @param {Array<Scene>} scenes 
  * @returns {Array<Scene>}
  */
  Wrapper.addUniqueIdsToInteractions = scenes =>
   scenes.map(scene => scene.interactions 
     ? ({
         ...scene,
         interactions: scene.interactions.map(
           interaction => ({...interaction, id: H5P.createUUID()}),
         ),
       }) 
     : scene
   );
 

  return Wrapper;
})();
