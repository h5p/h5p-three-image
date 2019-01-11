import React from 'react';
import ImageText from "./ImageText";
import NavigationButton from "../Shared/NavigationButton";
import './ImagePopup.scss';
import navButtonIcon from '../../../assets/navigation.svg';

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
                showTextDialog={this.props.showTextDialog}
              />
            );
          })}
        </div>
        <NavigationButton
          isStatic={true}
          buttonClasses={['back-button']}
          buttonIcon={navButtonIcon}
          clickHandler={this.props.onHidePopup}
        />
      </div>
    );
  }
}
