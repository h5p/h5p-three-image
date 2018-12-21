// export default class ImageText {
//
//   constructor(params, wrapper, textDialog, infoButtonIconSrc) {
//     // Info button
//     var navButtonWrapper = document.createElement('div');
//     navButtonWrapper.classList.add('nav-button-wrapper');
//     var pos = params.textpos.split(',');
//     var x = pos[0];
//     var y = pos[1];
//     navButtonWrapper.style.top = y + '%';
//     navButtonWrapper.style.left = x + '%';
//
//
//
//     var outerNavButton = document.createElement('div');
//     outerNavButton.classList.add('outer-nav-button');
//     navButtonWrapper.appendChild(outerNavButton);
//
//     var navButton = document.createElement('div');
//     navButton.classList.add('nav-button');
//     navButtonWrapper.appendChild(navButton);
//
//     var navButtonIcon = document.createElement('img');
//     navButtonIcon.src = infoButtonIconSrc;
//     navButtonIcon.classList.add('nav-button-icon');
//     navButton.appendChild(navButtonIcon);
//
//     var navButtonPulsar = document.createElement('div');
//     navButtonPulsar.classList.add('nav-button-pulsar');
//     navButtonPulsar.classList.add('no-pulse');
//     navButtonPulsar.addEventListener('click', function () {
//       textDialog.setText(params.imagetext);
//       textDialog.show();
//     });
//     navButtonWrapper.appendChild(navButtonPulsar);
//
//     navButtonWrapper.classList.add('h5p-static-button');
//     navButtonWrapper.classList.add('h5p-info-button');
//     wrapper.appendChild(navButtonWrapper);
//     navButtonWrapper.classList.add('show');
//
//     this.detach = function () {
//       wrapper.removeChild(navButtonWrapper);
//     };
//   }
// }

import React from 'react';

export default class ImageText extends React.Component {
  constructor(props) {
    super(props);

    const pos = this.props.textpos.split(',');
    this.x = pos[0];
    this.y = pos[1];
  }

  render() {
    return (
      <div
        className='nav-button-wrapper h5p-static-button h5p-info-button show'
        style={{
          top: this.y + '%',
          left: this.x + '%',
        }}
      >
        <div className='outer-nav-button' />
        <div className='nav-button'>
          <img src={this.props.infoButtonIconSrc} />
        </div>
        <div
          className='nav-button-pulsar no-pulse'
          onClick={this.props.showTextDialog.bind(this, this.props.text)}
        />
      </div>
    );
  }
}