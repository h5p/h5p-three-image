import React from 'react';
import ImageText from "./imageText";

export default class ImagePopup extends React.Component {

  constructor(props) {
    super(props);
    H5P.EventDispatcher.call(this);
  }

  render() {
    if (!this.props.showing) {
      return null;
    }

    return (
      <div className='h5p-image-popup'>
        {
          this.props.imageSrc &&
          <img className='h5p-image' src={this.props.imageSrc} />
        }
        <div className='h5p-image-texts-container'>
          {this.props.imageTexts.map((imageText, i) => {
            return (
              <ImageText
                key={i}
                textpos={imageText.textpos}
                text={imageText.imagetext}
                infoButtonIconSrc={this.props.infoButtonIconSrc}
                showTextDialog={this.props.showTextDialog}
              />
            );
          })}
        </div>
        <div className='nav-button-wrapper h5p-static-button' >
          <div className='outer-nav-button' />
          <div className='nav-button'>
            <img className='nav-button-icon' src={this.props.navButtonIcon} />
            <div className='nav-button-pulsar' onClick={this.props.onHidePopup} />
          </div>
        </div>
      </div>
    );
  }
}
