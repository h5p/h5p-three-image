import ThreeImage from "./three-image";

// Load library
H5P = H5P || {};
H5P.ThreeImage = (function () {

  function Wrapper(params, contentId, extras) {
    const threeImage = new ThreeImage(this, params, contentId, extras);


    this.attach = function ($container) {
      threeImage.attach($container);
    };

    this.on('resize', () => {
      threeImage.trigger('resize');
    });
  }

  return Wrapper;
})();
