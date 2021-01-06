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
  if (label.showLabel === 'inherit') {
    return globalLabel.showLabel ? false : true;
  }
  return label.showLabel === 'show' ? false : true;
};

export default class NavigationButtonLabel extends React.Component {
  constructor(props) {
    super(props);

    this.onClick.bind(this);
    this.innerinnerLabelDiv = React.createRef();
    this.navLabel = React.createRef();

    this.state = {
      expandable: false,
      isExpanded: false,
      divHeight: this.getDivHeight(),
      labelPos: this.props.labelPos,
      expandDirection: null,
      alignment: null
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
        this.setState({
          divHeight: this.innerinnerLabelDiv.current.scrollHeight,
          isExpanded: true
        });
      }, 0);
    }
    else {
      setTimeout(() => {
        this.setState({ divHeight: this.getDivHeight(), isExpanded: false });
      }, 0);
    }
  }

  componentDidUpdate(prevProps) {
    // Need to calculate if expand button should be shown and height
    if (this.props.labelText !== prevProps.labelText || this.props.hoverOnly !== prevProps.hoverOnly) {
      this.setState({
        expandable: this.isExpandable(),
        divHeight: this.getDivHeight()
      });
    }
    // Need to calculate if alignment and expanddirection should be changed
    // It is only in a static scene the label can be overflow, since camera can be moved in 360
    if (this.props.topPosition !== prevProps.topPosition
      || this.props.leftPosition !== prevProps.leftPosition && this.props.staticScene) {
      const expandDirection = this.getOverflowProperties();
      if (expandDirection.expandDirection !== this.state.expandDirection) {
        this.setState({ expandDirection: expandDirection.expandDirection });
      }
      if (expandDirection.alignment !== this.state.alignment) {
        this.setState({ alignment: expandDirection.alignment });
      }
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
    if (this.innerLabelDiv.current) {
      if (this.props.hoverOnly) {
        return 'unset';
      }
      return this.innerLabelDiv.current.scrollHeight > 22 ? '3em' : '1.5em';
    }
    return null;
  }

  /**
   * Return if element can be expanded
   */
  isExpandable() {
    if (this.innerLabelDiv.current.scrollHeight > 44) {
      return true;
    }
    return false;
  }

  /**
   * Calculate if element will overflow when expanded
   */
  getOverflowProperties() {
    let height = this.innerLabelDiv.current.scrollHeight;

    // Get the right height from the top of the navigation button for entire label

    if (this.props.labelPos === 'top') {
      height += parseInt(window.getComputedStyle(this.navLabel.current).paddingTop);
    }
    else if (this.props.labelPos === 'bottom') {
      height += parseInt(this.props.navButtonHeight) +
        parseInt(window.getComputedStyle(this.navLabel.current).paddingTop);
    }
    else {
      height += parseInt(window.getComputedStyle(this.navLabel.current).paddingTop)
        + parseInt(window.getComputedStyle(this.navLabel.current).paddingBottom);
    }
    if (this.state.expandable) {
      height += parseInt(window.getComputedStyle(this.props.forwardRef.current).paddingTop);
    }
    const overflowChanges = willOverflow(this.props.labelPos,
      height,
      this.innerLabelDiv.current.scrollWidth,
      this.props.topPosition,
      this.props.leftPosition,
      this.props.wrapperHeight,
      this.props.wrapperWidth);

    return overflowChanges;
  }

  render() {
    const hoverOnly = this.props.hoverOnly ? 'hover-only' : '';
    const isExpanded = this.state.isExpanded || hoverOnly ? 'is-expanded' : '';
    const canExpand = this.state.expandable || hoverOnly ? 'can-expand' : '';
    const isMultline = (this.state.divHeight != '1.5em') ? 'is-multiline' : '';
    const expandDirection = this.state.expandDirection ? 'expand-' + this.state.expandDirection : '';
    const alignment = this.state.alignment || this.props.labelPos;

    const expandButtonTabIndex = !this.context.extras.isEditor
      && this.props.isHiddenBehindOverlay ? '-1' : undefined;

    return (
      <div
        className={`nav-label-container ${alignment} ${isExpanded} ${canExpand} ${hoverOnly} ${expandDirection}`}>
        <div
          style={{ height: this.state.divHeight }}
          aria-hidden='true'
          className={`nav-label ${isMultline}`}
          ref={this.navLabel}>
          <div
            ref={this.innerLabelDiv}
            className='nav-label-inner'
            dangerouslySetInnerHTML={{ __html: this.props.labelText }}>
          </div>
        </div>
        {canExpand &&
          <button
            onFocus={() => this.props.setFocused(true)}
            onBlur ={() => this.props.setFocused(false)}
            ref={this.props.forwardRef}
            className="nav-label-expand-button"
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
