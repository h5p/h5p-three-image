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

  render() {
    return (
      <div className="btn-wrap">
        <button
          className={ 'hud-btn ' + this.props.type }
          onClick={ this.handleClick }
          aria-label={ this.props.label }
          disabled={ !!this.props.disabled }
        />
        <div className="tooltip" aria-hidden="true">
          <div className="text-wrap">{ this.props.label }</div>
        </div>
      </div>
    );
  }
}
