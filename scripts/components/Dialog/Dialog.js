import React from 'react';
import './Dialog.scss';
import { H5PContext } from "../../context/H5PContext";

export default class Dialog extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Focus must be set to the first focusable element
    this.title.focus();
  }

  handleDialogRef = (el) => {
    if (el) {
      el.style.height = el.getBoundingClientRect().height + 'px';
    }
  }

  render() {
    let dialogClasses = ['h5p-text-dialog'];
    if (this.props.dialogClasses) {
      dialogClasses = dialogClasses.concat(this.props.dialogClasses);
    }

    return (
      <div className='h5p-text-overlay' role="dialog" aria-label={ this.props.title }>
        <div
          ref={ el => this.title = el }
          className="h5p-dialog-focusstart"
          tabIndex="-1"
        ></div>
        <div className={dialogClasses.join(' ')} ref={ this.handleDialogRef }>
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
