H5P.ThreeImage = H5P.ThreeImage || {};

H5P.ThreeImage.TextDialog = (function () {

  function TextDialog(wrapper, closeButtonIconSrc) {
    var self = this;

    var overlay = document.createElement('div');
    overlay.classList.add('h5p-text-overlay');

    var popup = document.createElement('div');
    popup.classList.add('h5p-text-dialog');

    var content = document.createElement('div');
    content.classList.add('h5p-text-content');
    popup.appendChild(content);

    var textArea = document.createElement('div');
    textArea.classList.add('h5p-text-body');
    content.appendChild(textArea);

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
    navButtonIcon.src = closeButtonIconSrc;
    navButtonIcon.classList.add('nav-button-icon');
    navButton.appendChild(navButtonIcon);

    var navButtonPulsar = document.createElement('div');
    navButtonPulsar.classList.add('nav-button-pulsar');
    navButtonPulsar.addEventListener('click', function () {
      self.hide();
    });
    navButtonWrapper.appendChild(navButtonPulsar);

    navButtonWrapper.classList.add('h5p-static-button');
    overlay.appendChild(popup);
    popup.appendChild(navButtonWrapper);

    this.setText = function (text) {
      textArea.innerHTML = text;
    };

    this.show = function () {
      wrapper.appendChild(overlay);
    };

    this.hide = function () {
      wrapper.removeChild(overlay);
    };
  }

  return TextDialog;
})();