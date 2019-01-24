import React from 'react';
import './Dialog.scss';

export default class Dialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='h5p-text-overlay'>
        <div className='h5p-text-dialog'>
          <div className='h5p-text-content'>
            {this.props.children}
          </div>
          <button
            className='close-button-wrapper'
            onClick={this.props.onHideTextDialog}
          />
        </div>
      </div>
    );
  }
}