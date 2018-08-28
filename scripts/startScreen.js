// TODO: Refactor this copy pasta...
H5P.ThreeImage = H5P.ThreeImage || {};

H5P.ThreeImage.StartScreen = (function (EventDispatcher, TextDialog) {
  function StartScreen(
    wrapper,
    params,
    contentId,
    navButtonIconSrc,
    imageButtonIcon,
    infoButtonIcon,
    closeButtonIcon
  ) {
    var self = this;
    EventDispatcher.call(this);

    // Show start image
    var popup = document.createElement('div');
    popup.classList.add('h5p-image-popup');

    self.startScreenTextDialog = new TextDialog(popup, closeButtonIcon);
    self.imageTextButtons = [];

    var img = document.createElement('img');
    img.classList.add('h5p-image');
    img.src = H5P.getPath(params.imagesrc.path, contentId);
    popup.appendChild(img);

    // Add exit button
    var navButtonWrapper = document.createElement('div');
    navButtonWrapper.classList.add('nav-button-wrapper');
    var exitPos = params.exitpos.split(',');
    var x = exitPos[0];
    var y = exitPos[1];
    navButtonWrapper.style.left = x + '%';
    navButtonWrapper.style.top = y + '%';

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
      self.trigger('exit');
      wrapper.removeChild(popup);
    });
    navButtonWrapper.appendChild(navButtonPulsar);

    navButtonWrapper.classList.add('start-screen');
    popup.appendChild(navButtonWrapper);

    // Image hotspots
    params.startimages.forEach(function (startImage) {
      var navButtonWrapper = document.createElement('div');
      navButtonWrapper.classList.add('nav-button-wrapper');

      var imagePos = startImage.imagepos.split(',');
      var x = imagePos[0];
      var y = imagePos[1];

      navButtonWrapper.style.left = x + '%';
      navButtonWrapper.style.top = y + '%';

      var outerNavButton = document.createElement('div');
      outerNavButton.classList.add('outer-nav-button');
      navButtonWrapper.appendChild(outerNavButton);

      var navButton = document.createElement('div');
      navButton.classList.add('nav-button');
      navButtonWrapper.appendChild(navButton);

      var navButtonIcon = document.createElement('img');
      navButtonIcon.src = imageButtonIcon;
      navButtonIcon.classList.add('nav-button-icon');
      navButton.appendChild(navButtonIcon);

      var navButtonPulsar = document.createElement('div');
      navButtonPulsar.classList.add('nav-button-pulsar');
      navButtonPulsar.addEventListener('click', function () {
        // Add image
        var imagePopup = document.createElement('div');
        imagePopup.classList.add('h5p-image-popup');
        imagePopup.classList.add('nested');

        var img = document.createElement('img');
        img.classList.add('h5p-image');
        img.src = H5P.getPath(startImage.imagesrc.path, contentId);
        imagePopup.appendChild(img);

        var textButtons = document.createElement('div');
        textButtons.classList.add('h5p-image-texts-container');
        imagePopup.appendChild(textButtons);

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
          console.log("closing image...");
          self.imageTextButtons.forEach(function (imageTextButton) {
            wrapper.removeChild(imageTextButton);
          });
          self.imageTextButtons = [];

          popup.removeChild(imagePopup);
        });
        navButtonWrapper.appendChild(navButtonPulsar);

        navButtonWrapper.classList.add('h5p-static-button');
        imagePopup.appendChild(navButtonWrapper);

        // Add image texts
        startImage.imagetexts.forEach(function (imageText) {
          var imageTextWrapper = document.createElement('div');
          imageTextWrapper.classList.add('nav-button-wrapper');
          var pos = imageText.textpos.split(',');
          var x = pos[0];
          var y = pos[1];
          imageTextWrapper.style.top = y + '%';
          imageTextWrapper.style.left = x + '%';

          var imageTextOuterButton = document.createElement('div');
          imageTextOuterButton.classList.add('outer-nav-button');
          imageTextWrapper.appendChild(imageTextOuterButton);

          var imageTextButton = document.createElement('div');
          imageTextButton.classList.add('nav-button');
          imageTextWrapper.appendChild(imageTextButton);

          var imageTextIcon = document.createElement('img');
          imageTextIcon.src = infoButtonIcon;
          imageTextIcon.classList.add('nav-button-icon');
          imageTextButton.appendChild(imageTextIcon);

          var imageTextPulsar = document.createElement('div');
          imageTextPulsar.classList.add('nav-button-pulsar');
          imageTextPulsar.classList.add('no-pulse');
          imageTextPulsar.addEventListener('click', function () {
            console.log("opening text dialog");
            self.startScreenTextDialog.setText(imageText.imagetext);
            self.startScreenTextDialog.show();
          });
          imageTextWrapper.appendChild(imageTextPulsar);

          imageTextWrapper.classList.add('h5p-static-button');
          imageTextWrapper.classList.add('h5p-info-button');
          wrapper.appendChild(imageTextWrapper);
          imageTextWrapper.classList.add('show');

          self.imageTextButtons.push(imageTextWrapper);
        });

        popup.appendChild(imagePopup);
      });

      navButtonWrapper.classList.add('start-screen');
      navButtonWrapper.appendChild(navButtonPulsar);

      popup.appendChild(navButtonWrapper);
    });


    wrapper.appendChild(popup);
  }

  return StartScreen;
})(H5P.EventDispatcher, H5P.ThreeImage.TextDialog);