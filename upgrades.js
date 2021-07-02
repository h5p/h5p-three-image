/// <reference path="./index.d.ts" />

var H5PUpgrades = H5PUpgrades || {};

H5PUpgrades['H5P.ThreeImage'] = (function () {
  return {
    0: {
      2: function (parameters, finished) {
        if (parameters && parameters.context &&
            parameters.context.behaviour && parameters.context.behaviour.length) {
          // Add wrapper for audio
          const audio = parameters.context.behaviour;
          parameters.context.behaviour = {
            audio: audio
          };
        }
        finished(null, parameters);
      },

      /**
       * @param {{ threeImage: {scenes: Array<SceneParams>}; behaviour?: any; }} parameters 
       * @param {(param0: any, parameters: any) => void} finished 
       */
      4: function (parameters, finished) {
        if (parameters && parameters.behaviour) {
          parameters.behaviour.label = {
            showLabel: false,
            labelPosition: 'right'
          };
        }

        if (parameters && parameters.threeImage && parameters.threeImage.scenes) {
          for (const scene of parameters.threeImage.scenes) {
            if (scene.interactions) {
              for (const interaction of scene.interactions) {
                if (!interaction.label) {
                  interaction.label = {
                    labelPosition: 'inherit',
                    showLabel: 'inherit',
                  }
                }
              }
            }
          }
        }

        finished(null, parameters);
      }
    }
  };
})();
