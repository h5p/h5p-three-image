import React from 'react';

export default class ImageButton extends React.Component {
  render() {
    return (
      <div>
        <div className='nav-button-wrapper'>
          <div className='outer-nav-button' />
          <div className='nav-button'>
            <img className='nav-button-icon' src={this.props.imageButtonIcon} />
          </div>
          <div
            className='nav-button-pulsar'
            onClick={this.props.showImage.bind(this)}
          />
        </div>
      </div>
    );
  }
}