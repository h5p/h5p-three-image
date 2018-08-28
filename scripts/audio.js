H5P.ThreeImage = H5P.ThreeImage || {};

H5P.ThreeImage.Audio = (function () {
  function Audio(audioSrc, wrapper, audioOnIcon, audioOffIcon) {
    var self = this;
    self.isPlaying = false;

    // Image button
    var navButtonWrapper = document.createElement('div');
    navButtonWrapper.classList.add('nav-button-wrapper');

    var audio = document.createElement('audio');
    audio.src = audioSrc;
    audio.loop = true;
    audio.classList.add('hidden-audio');
    wrapper.appendChild(audio);

    var outerNavButton = document.createElement('div');
    outerNavButton.classList.add('outer-nav-button');
    navButtonWrapper.appendChild(outerNavButton);

    var navButton = document.createElement('div');
    navButton.classList.add('nav-button');
    navButtonWrapper.appendChild(navButton);

    var navButtonIcon = document.createElement('img');
    navButtonIcon.src = audioOnIcon;
    navButtonIcon.classList.add('nav-button-icon');
    navButton.appendChild(navButtonIcon);

    var navButtonPulsar = document.createElement('div');
    navButtonPulsar.classList.add('nav-button-pulsar');
    navButtonPulsar.classList.add('no-pulse');
    navButtonPulsar.addEventListener('click', function () {
      if (self.isPlaying) {
        navButtonWrapper.classList.remove('mute');
        navButtonIcon.src = audioOnIcon;
        self.isPlaying = false;
        audio.pause();
      }
      else {
        navButtonWrapper.classList.add('mute');
        navButtonIcon.src = audioOffIcon;
        self.isPlaying = true;
        audio.play();
      }
    });
    navButtonWrapper.appendChild(navButtonPulsar);

    navButtonWrapper.classList.add('h5p-static-button');
    navButtonWrapper.classList.add('h5p-info-button');
    navButtonWrapper.classList.add('h5p-audio-button');
    wrapper.appendChild(navButtonWrapper);
    navButtonWrapper.classList.add('show');
  }

  return Audio;
})();