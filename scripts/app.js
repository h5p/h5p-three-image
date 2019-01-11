import React from 'react';
import ReactDOM from "react-dom";
import Main from "./components/Main";

// Load library
H5P = H5P || {};
H5P.ThreeImage = (function () {

  function Wrapper(params, contentId, extras) {
    extras = extras || {};
    this.forceStartScreen = (extras.forceStartScreen !== undefined
      && extras.forceStartScreen >= 0)
      ? extras.forceStartScreen : null;

    // Initialize event inheritance
    H5P.EventDispatcher.call(self);

    let wrapper;
    // Parameters has been wrapped in the threeImage widget group
    if (params.threeImage) {
      params = params.threeImage;
    }


    const createElements = () => {
      wrapper = document.createElement('div');
      wrapper.classList.add('h5p-three-sixty-wrapper');


      ReactDOM.render(
        <Main
          forceStartScreen={this.forceStartScreen}
          parameters={params}
          contentId={contentId}
        />,
        wrapper
      );
    };

    this.attach = ($container) => {
      if (!wrapper) {
        createElements();
      }

      // Append elements to DOM
      $container[0].appendChild(wrapper);
      $container[0].classList.add('h5p-three-image');
    };

    this.on('resize', () => {
      wrapper.style.height = (wrapper.getBoundingClientRect().width * (9 / 16)) + 'px';
    });
  }

  return Wrapper;
})();
