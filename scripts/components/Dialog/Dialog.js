import React from 'react';
import NavigationButton from "../Shared/NavigationButton";
import './Dialog.scss';
import closeButtonIcon from '../../../assets/close.svg';

export default class Dialog extends React.Component {
  // TODO: Refactor all the dialogs
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
          <NavigationButton
            clickHandler={this.props.onHideTextDialog}
            buttonIcon={closeButtonIcon}
            isStatic={true}
          />
        </div>
      </div>
    );
  }
}