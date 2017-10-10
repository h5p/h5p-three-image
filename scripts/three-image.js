H5P.ThreeImage = (function (EventDispatcher, ThreeSixty) {

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

    // Initialize event inheritance
    EventDispatcher.call(self);

    var wrapper, threeSixty;

    /**
     * Create the needed DOM elements
     *
     * @private
     */
    var createElements = function () {
      // Create wrapper
      wrapper = document.createElement('div');

      // Create source image
      var image = document.createElement('img');
      image.addEventListener('load', imageLoaded);
      image.src = H5P.getPath(parameters.file.path, contentId);
    };

    /**
     * Callback for handling the image loaded event.
     *
     * @private
     */
    var imageLoaded = function () {
      threeSixty = new H5P.ThreeSixty(this, 16 / 9);
      wrapper.appendChild(threeSixty.element);
      threeSixty.resize();
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

  }

  return ThreeImage;
})(H5P.EventDispatcher, H5P.ThreeSixty);
