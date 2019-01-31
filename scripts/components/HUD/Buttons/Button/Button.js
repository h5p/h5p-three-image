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

  handleKeyPress = (e) => {
    if (e.which === 32 || e.which === 13) {
      this.handleClick();
      e.preventDefault();
    }
  }

  render() {
    return (
      <div
        role="button"
        tabIndex={ this.props.disabled ? '-1' : '0' }
        className={ 'hud-button ' + this.props.type }
        onClick={ this.handleClick }
        onKeyPress={ this.handleKeyPress }
        aria-label={ this.props.label }
        aria-disabled={ !!this.props.disabled }
      >
        <div className="tooltip">
          <div className="text-wrap">{ this.props.label }</div>
        </div>
      </div>
    );
  }
}
