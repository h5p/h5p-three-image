import React from 'react';
import './Dialog.scss';
import { H5PContext } from "../../context/H5PContext";

export default class Dialog extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Focus must be set to the first focusable element
    this.closeButton.focus();
  }

  render() {
    let dialogClasses = ['h5p-text-dialog'];
    if (this.props.dialogClasses) {
      dialogClasses = dialogClasses.concat(this.props.dialogClasses);
    }

    return (
      <div className='h5p-text-overlay' role="dialog" aria-label={ this.props.title }>
        <div className={dialogClasses.join(' ')}>
          <div className='h5p-text-content'>
            {this.props.children}
          </div>
          <button
            ref={ el => this.closeButton = el }
            aria-label={ this.context.l10n.closeDialog }
            className='close-button-wrapper'
            onClick={this.props.onHideTextDialog}
          />
        </div>
      </div>
    );
  }
}

Dialog.contextType = H5PContext;
