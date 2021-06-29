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
      4: function (parameters, finished) {
        if (parameters && parameters.context.behaviour) {
          parameters.context.behaviour.label = {
            showLabel: false,
            labelPosition: 'right'
          };
        }

        if (parameters && parameters.context.scenes) {
          for (const scene of parameters.context.scenes) {
            if (scene.interactions) {
              for (const interaction of interactions) {
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
