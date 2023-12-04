import React from 'react';
import './Button.scss';

export default class AudioButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    if (!this.props.disabled) {
      this.props.onClick();
    }
  }

  /**
   * React - after render
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.nextFocus !== this.props.nextFocus && this.props.type === this.props.nextFocus) {
      this.element.focus();
    }
  }

  /**
   * React - create DOM elements
   */
  render() {
    return (
      <div className="btn-wrap">
        <button
          type="button"
          ref={ el => this.element = el }
          className={ 'hud-btn ' + this.props.type }
          onClick={ this.handleClick }
          aria-label={ this.props.label }
          disabled={ !!this.props.disabled }
          tabIndex={ this.props.isHiddenBehindOverlay ? '-1' : undefined }
        />
        <div className="tooltip" aria-hidden="true">
          <div className="text-wrap">{ this.props.label }</div>
        </div>
      </div>
    );
  }
}
