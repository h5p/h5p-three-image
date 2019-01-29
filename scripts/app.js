import React from 'react';
import ReactDOM from "react-dom";
import Main from "./components/Main";
import {H5PContext} from './context/H5PContext';

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
    // Parameters has been wrapped in the threeImage widget group
    if (params.threeImage) {
      params = params.threeImage;
    }
    this.params = params;
    this.contentId = contentId;
    this.extras = extras;
    this.threeJsScenes = [];

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
            addScene={addScene}
          />
        </H5PContext.Provider>,
        wrapper
      );
    };

    const addScene = (scene, sceneId) => {
      this.threeJsScenes.push({
        scene: scene,
        sceneId: sceneId,
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
            addScene={addScene}
          />
        </H5PContext.Provider>,
        wrapper
      );
    };

    this.reDraw = (forceStartScreen = this.currentScene) => {
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
            addScene={addScene}
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

    this.on('resize', () => {
      wrapper.style.height = (wrapper.getBoundingClientRect().width * (9 / 16)) + 'px';

      // Resize scene
      if (this.currentScene === null) {
        return;
      }

      const scene = this.threeJsScenes.find(scene => {
        return scene.sceneId === this.currentScene;
      });

      if (!scene) {
        return;
      }

      scene.scene.resize();
    });

    this.getCamera = () => {
      if (this.currentScene === null) {
        return;
      }

      const scene = this.threeJsScenes.find(scene => {
        return scene.sceneId === this.currentScene;
      }).scene;

      return {
        camera: scene.getCurrentPosition(),
        fov: scene.getCurrentFov(),
      };
    };
  }

  return Wrapper;
})();
