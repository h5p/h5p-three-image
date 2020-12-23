import React from 'react';
import './NavigationButton.scss';
import './NavigationButtonLabel.scss';
import { H5PContext } from "../../context/H5PContext";
import { willOverflow } from './OverflowHelpers';

export const getLabelFromInteraction = (interaction) => {
  return interaction.label;
};

export const getLabelPos = (label, globalLabel) => {
  return label.labelPosition === 'inherit' ? globalLabel.labelPosition : label.labelPosition;
};

export const getLabelText = (label, title) => {
  return label && label.labelText ? label.labelText : title;
};

export const isHoverLabel = (label, globalLabel) => {
  return !(label.showLabel === 'inherit' ? globalLabel.showLabel : label.showLabel);
};

export default class NavigationButtonLabel extends React.Component {
  constructor(props) {
    super(props);

    this.onClick.bind(this);
    this.labelDiv = React.createRef();

    this.state = {
      expandable: false,
      isExpanded: false,
      divHeight: this.getDivHeight(),
      labelPos: this.props.labelPos,
      expandDirection: null
    };

  }

  /**
   * Handle expand button being clicked
   * @param  {Event} e
   */
  onClick(e) {
    e.stopPropagation();
    if (!this.state.expandable) {
      return;
    }

    if (!this.state.isExpanded) {
      setTimeout(() => {
        this.setState({ divHeight: window.getComputedStyle(this.labelDiv.current).height });
      }, 0);
    }
    else {
      setTimeout(() => {
        this.setState({ divHeight: this.getDivHeight() });
      }, 0);
    }

    this.setState({ isExpanded: !this.state.isExpanded });
  }

  componentDidUpdate(prevProps) {
    if (this.props.labelText !== prevProps.labelText) {
      this.setState({ expandable: this.isExpandable() });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        expandable: this.isExpandable(),
        divHeight: this.getDivHeight()
      });
    }, 0);
  }

  /**
   * Return hight of div based on scrollHeight
   */
  getDivHeight() {
    if (this.labelDiv.current) {
      return this.labelDiv.current.scrollHeight > 22 ? '3em' : '1.5em';
    }
    return null;
  }

  isExpandable() {
    // If it is allready expanded the width will be the scrollwidth will be the same as offsetwidth
    let isExpanded = this.state.isExpanded ? 1 : 0;

    if (this.labelDiv.current && this.labelDiv.current.scrollWidth + isExpanded > this.labelDiv.current.offsetWidth) {
      return true;
    }
    return false;
  }

  getExpandDirection() {
    const expandDirection = willOverflow(this.props.labelPos,
      this.labelDiv.current.scrollHeight + 15 + (this.state.expandable ? 10 : 0), // TODO make more precise Add expandbutton
      this.labelDiv.current.scrollWidth,
      this.props.topPosition,
      this.props.leftPosition,
      this.props.wrapperHeight,
      this.props.wrapperWidth,
      this.props.navButtonHeight);

    return expandDirection;
  }

  render() {
    const isExpanded = this.state.isExpanded ? 'is-expanded' : '';
    const canExpand = this.state.expandable ? 'can-expand' : '';
    const hoverOnly = this.props.hoverOnly ? 'hover-only' : '';
    const expandDirection = this.state.expandDirection ? 'expand-' + this.state.expandDirection : '';

    const expandButtonTabIndex = !this.context.extras.isEditor
      && this.props.isHiddenBehindOverlay ? '-1' : undefined;

    return (
      <div
        className={`nav-label-container ${this.props.labelPos} ${isExpanded} ${canExpand} ${hoverOnly} ${expandDirection}`}>
        <div style={{ height: this.state.divHeight }} aria-hidden='true' className={`nav-label`} >
          <div ref={this.labelDiv}
            className='nav-label-inner' dangerouslySetInnerHTML={{ __html: this.props.labelText}}>
           
          </div>
        </div>
        {canExpand &&
          <button
            onFocus={() => this.props.setFocused(true)}
            onBlur ={() => this.props.setFocused(false)}
            ref={this.props.forwardRef}
            className="nav-label-expand"
            tabIndex={expandButtonTabIndex}
            aria-label={this.context.l10n.expandButtonAriaLabel}
            onClick={this.onClick.bind(this)}>
            <div className="nav-label-expand-arrow" />
          </button>}
      </div>
    );
  }
}
NavigationButtonLabel.contextType = H5PContext;
