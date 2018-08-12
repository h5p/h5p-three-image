H5P.ThreeImage.SceneDescription = (function () {
  function SceneDescription() {
    var popup = document.createElement('div');
    popup.classList.add('h5p-text-popup');

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
  }

  return SceneDescription;
})();