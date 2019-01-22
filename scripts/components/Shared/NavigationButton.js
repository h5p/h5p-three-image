import React from 'react';
import './NavigationButton.scss';
import {H5PContext} from "../../context/H5PContext";

export default class NavigationButton extends React.Component {
  getStyle() {
    const style = {};
    if (this.props.topPosition !== undefined) {
      style.top = this.props.topPosition + '%';
    }

    if (this.props.leftPosition !== undefined) {
      style.left = this.props.leftPosition + '%';
    }
    return style;
  }

  render() {
    let navButtonClasses = [
      'nav-button-wrapper',
    ];

    if (this.props.isStatic) {
      navButtonClasses.push('h5p-static-button');
    }

    if (this.props.buttonClasses) {
      navButtonClasses = navButtonClasses.concat(this.props.buttonClasses);
    }

    const pulseButtonClasses = [
      'nav-button-pulsar',
    ];

    if (this.props.hasNoPulse) {
      pulseButtonClasses.push('no-pulse');
    }

    return (
      <div>
        <div className={navButtonClasses.join(' ')} style={this.getStyle()}>
          <div className='outer-nav-button' />
          <div className='nav-button'>
            {
              this.props.buttonIcon
                ? <img className='nav-button-icon' src={this.props.buttonIcon} />
                : <div className='nav-button-icon' />
            }

          </div>
          <div
            className={pulseButtonClasses.join(' ')}
            onClick={() => {
              const hasClickHandler = this.props.forceClickHandler
                || !this.context.extras.isEditor;

              if (hasClickHandler) {
                this.props.clickHandler();
              }
            }}
            onDoubleClick={() => {
              if (this.props.doubleClickHandler) {
                this.props.doubleClickHandler();
              }
            }}
            onMouseDown={e => {
              const hasMouseDownHandler = this.context.extras.isEditor
                && this.props.mouseDownHandler;

              if (hasMouseDownHandler) {
                this.props.mouseDownHandler(e);
              }
            }}
          />
        </div>
      </div>
    );
  }
}
NavigationButton.contextType = H5PContext;
