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
      this.el = el;
    }
  };

  handleResize = () => {
    if (this.el) {
      this.el.style.width = '';
      this.el.style.height = this.el.getBoundingClientRect().height + 'px';
    }
  }

  render() {
    let dialogClasses = ['h5p-text-dialog'];
    if (this.props.dialogClasses) {
      dialogClasses = dialogClasses.concat(this.props.dialogClasses);
    }

    const children = (this.props.children.type === 'div' ? this.props.children : React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onResize: this.handleResize
      })
    ));

    return (
      <div className='h5p-text-overlay' role="dialog" aria-label={ this.props.title }>
        <div
          ref={ el => this.title = el }
          className="h5p-dialog-focusstart"
          tabIndex="-1"
        ></div>
        <div className={dialogClasses.join(' ')} ref={ this.handleDialogRef }>
          <div className='h5p-text-content'>
            { children }
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
