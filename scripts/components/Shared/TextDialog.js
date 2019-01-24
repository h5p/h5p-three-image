import React from 'react';
import NavigationButton from "./NavigationButton";
import './TextDialog.scss';
import closeButtonIcon from '../../../assets/close.svg';

export default class TextDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='h5p-text-overlay'>
        <div className='h5p-text-dialog'>
          <div className='h5p-text-content'>
            <div
              className='h5p-text-body'
              dangerouslySetInnerHTML={{__html: this.props.text }}/>
          </div>
          <NavigationButton
            title='Close'
            clickHandler={this.props.onHideTextDialog}
            buttonIcon={closeButtonIcon}
            isStatic={true}
          />
        </div>
      </div>
    );
  }
}