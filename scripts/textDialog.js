import React from 'react';

export default class TextDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.showing) {
      return null;
    }

    return (
      <div className='h5p-text-overlay'>
        <div className='h5p-text-dialog'>
          <div className='h5p-text-content'>
            <div
              className='h5p-text-body'
              dangerouslySetInnerHTML={{__html: this.props.text }}/>
          </div>
          <div className='nav-button-wrapper h5p-static-button'>
            <div className='outer-nav-button' />
            <div className='nav-button'>
              <img
                className='nav-button-icon'
                src={this.props.closeButtonIconSrc}
              />
            </div>
            <div
              className='nav-button-pulsar'
              onClick={this.props.onHideTextDialog}
            />
          </div>
        </div>
      </div>
    );
  }
}