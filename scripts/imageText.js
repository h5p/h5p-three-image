H5P.ThreeImage = H5P.ThreeImage || {};

H5P.ThreeImage.ImageText = (function () {

  function ImageText(params, wrapper, textDialog, infoButtonIconSrc) {
    // Info button
    var navButtonWrapper = document.createElement('div');
    navButtonWrapper.classList.add('nav-button-wrapper');
    var pos = params.textpos.split(',');
    var x = pos[0];
    var y = pos[1];
    navButtonWrapper.style.top = y + '%';
    navButtonWrapper.style.left = x + '%';

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
      textDialog.setText(params.imagetext);
      textDialog.show();
    });
    navButtonWrapper.appendChild(navButtonPulsar);

    navButtonWrapper.classList.add('h5p-static-button');
    navButtonWrapper.classList.add('h5p-info-button');
    wrapper.appendChild(navButtonWrapper);
    navButtonWrapper.classList.add('show');

    this.detach = function () {
      wrapper.removeChild(navButtonWrapper);
    }
  }

  return ImageText;
})();