H5P.ThreeImage = H5P.ThreeImage || {};

H5P.ThreeImage.ImagePopup = (function () {
  function ImagePopup(wrapper, navButtonIconSrc) {
    var self = this;

    var popup = document.createElement('div');
    popup.classList.add('h5p-image-popup');

    var img = document.createElement('img');
    img.classList.add('h5p-image');
    popup.appendChild(img);

    // Close button
    var navButtonWrapper = document.createElement('div');
    navButtonWrapper.classList.add('nav-button-wrapper');

    var outerNavButton = document.createElement('div');
    outerNavButton.classList.add('outer-nav-button');
    navButtonWrapper.appendChild(outerNavButton);

    var navButton = document.createElement('div');
    navButton.classList.add('nav-button');
    navButtonWrapper.appendChild(navButton);

    var navButtonIcon = document.createElement('img');
    navButtonIcon.src = navButtonIconSrc;
    navButtonIcon.classList.add('nav-button-icon');
    navButton.appendChild(navButtonIcon);

    var navButtonPulsar = document.createElement('div');
    navButtonPulsar.classList.add('nav-button-pulsar');
    navButtonPulsar.addEventListener('click', function () {
      self.hide();
    });
    navButtonWrapper.appendChild(navButtonPulsar);

    navButtonWrapper.classList.add('h5p-close-button');
    popup.appendChild(navButtonWrapper);

    this.setImage = function (src) {
      img.src = src;
    };

    this.show = function () {
      wrapper.appendChild(popup);
    };

    this.hide = function () {
      wrapper.removeChild(popup);
    };
  }

  return ImagePopup;
})();