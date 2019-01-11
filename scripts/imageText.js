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