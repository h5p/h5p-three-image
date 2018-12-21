export default class SceneDescription {

  constructor(wrapper, textDialog, infoButtonIconSrc) {
    // Info button
    var navButtonWrapper = document.createElement('div');
    navButtonWrapper.classList.add('nav-button-wrapper');

    var outerNavButton = document.createElement('div');
    outerNavButton.classList.add('outer-nav-button');
    navButtonWrapper.appendChild(outerNavButton);

    var navButton = document.createElement('div');
    navButton.classList.add('nav-button');
    navButtonWrapper.appendChild(navButton);

    var navButtonIcon = document.createElement('img');
    navButtonIcon.src = infoButtonIconSrc;
    navButtonIcon.classList.add('nav-button-icon');
    navButton.appendChild(navButtonIcon);

    var navButtonPulsar = document.createElement('div');
    navButtonPulsar.classList.add('nav-button-pulsar');
    navButtonPulsar.classList.add('no-pulse');
    navButtonPulsar.addEventListener('click', function () {
      // textDialog.show();
    });
    navButtonWrapper.appendChild(navButtonPulsar);

    navButtonWrapper.classList.add('h5p-static-button');
    navButtonWrapper.classList.add('h5p-info-button');
    wrapper.appendChild(navButtonWrapper);

    this.setText = function (text) {
      self.text = text;
      if (text) {
        // textDialog.setText(text);
      }
    };

    this.show = function () {
      if (self.text) {
        navButtonWrapper.classList.add('show');
      }
    };

    this.hide = function () {
      navButtonWrapper.classList.remove('show');
    };
  }
}