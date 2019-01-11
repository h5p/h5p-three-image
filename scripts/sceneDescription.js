import React from 'react';

export default class SceneDescription extends React.Component {

  enterSceneDescription(text) {
    // Show text dialog with special message
    this.props.showTextDialog(text);
  }

  render() {
    if (!this.props.showing) {
      return null;
    }

    const navButtonWrapperClasses = [
      'nav-button-wrapper',
      'h5p-static-button',
      'h5p-info-button',
      'show'
    ];

    return (
      <div className={navButtonWrapperClasses.join(' ')}>
        <div className='outer-nav-button' />
        <div className='nav-button'>
          <img className='nav-button-icon' src={this.props.infoButtonIconSrc} />
        </div>
        <div
          className='nav-button-pulsar no-pulse'
          onClick={this.enterSceneDescription.bind(this, this.props.text)}
        />
      </div>
    );
  }
}