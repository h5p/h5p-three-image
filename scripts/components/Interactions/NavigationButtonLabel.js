import React from 'react';
import './NavigationButton.scss';
import './NavigationButtonLabel.scss';
import { H5PContext } from "../../context/H5PContext";
import { willOverflow } from '../Shared/OverflowHelpers';

export const getLabelPos = (globalLabel, label) => {
  const useLabelPosition = label && label.labelPosition && label.labelPosition !== 'inherit';
  return useLabelPosition ? label.labelPosition : globalLabel.labelPosition;
};

export const getLabelText = (label) => {
  return label && label.labelText ? label.labelText : '';
};

export const isHoverLabel = (globalLabel, label) => {
  if (label.showLabel === 'inherit') {
    return globalLabel.showLabel ? false : true;
  }
  return label.showLabel === 'show' ? false : true;
};

// Threshold for if the label should be multiline
const INNER_LABEL_HEIGHT_THRESHOLD_LOW = 22;

// Threshold for if the label should be expandeble
const INNER_LABEL_HEIGHT_THRESHOLD_HIGH = 44;

export default class NavigationButtonLabel extends React.Component {
  constructor(props) {
    super(props);

    this.onClick.bind(this);
    this.innerLabelDiv = React.createRef();
    this.navLabel = React.createRef();

    this.state = {
      expandable: false,
      isExpanded: false,
      divHeight: this.getDivHeight(),
      labelPos: this.props.labelPos,
      expandDirection: null,
      alignment: null,
      innerLabelHeight: ''
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
          divHeight: this.innerLabelDiv.current ? this.innerLabelDiv.current.scrollHeight: 0,
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
      this.setHeightProperties();
    }

    // Need to calculate if alignment and expanddirection should be changed
    // It is only in a static scene the label can be overflow, since camera can be moved in 360
    if ((this.props.topPosition !== prevProps.topPosition
      || this.props.leftPosition !== prevProps.leftPosition
      || this.props.labelText !== prevProps.labelText) && this.props.staticScene) {
      this.setExpandProperties();
    }
    if (!prevProps.rendered && this.props.rendered) {
      this.setHeightProperties();
      this.setExpandProperties();
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setHeightProperties();
      if (this.props.staticScene) {
        this.setExpandProperties();
      }
    }, 50);
    this.context.on('resize', () => {
      if (this.state.isExpanded && this.innerLabelDiv.current && this.state.divHeight !== this.innerLabelDiv.current.scrollHeight) {
        // Font size changes when the screen resizes so we need to make sure it has the correct height
        if (this.innerLabelDiv.current.scrollHeight !== 0 && this.props.staticScene) {
          this.setState({
            divHeight: this.innerLabelDiv.current ? this.innerLabelDiv.current.scrollHeight : 0
          });
        }
        // If the interaction doesn't have a scrollheight and is expanded it means that we have moved scene
        // The interactions in 360 scene is not proparaly remounted and this leads to
        // Labels being expanded and not proparly shown when going back
        else if (!this.props.staticScene && (this.state.isExpanded || this.state.divHeight !== '3em') ) {
          this.setState({
            isExpanded: false,
            divHeight: '3em'
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this.context.off('resize', () => {
      if (this.state.isExpanded && this.innerLabelDiv.current && this.state.divHeight !== this.innerLabelDiv.current.scrollHeight) {
        this.setState({
          divHeight: this.innerLabelDiv.current ? this.innerLabelDiv.current.scrollHeight : 0
        });
      }
    });
  }

  setHeightProperties() {
    const isExpandable = this.isExpandable();
    this.setState({
      expandable: isExpandable,
      divHeight: this.getDivHeight(),
      // Safari won't show ellipsis unless height is 100%
      // Ellipsis should only be shown if it is expandable
      // If not the calculated height will be incorrect
      innerLabelHeight: isExpandable ? '100%': ''
    });
  }

  setExpandProperties() {
    const labelProperties = this.getOverflowProperties();
    if (labelProperties.expandDirection !== this.state.expandDirection) {
      this.setState({ expandDirection: labelProperties.expandDirection });
    }
    if (labelProperties.alignment !== this.state.alignment) {
      this.setState({ alignment: labelProperties.alignment });
    }
  }

  /**
   * Return hight of div based on scrollHeight
   */
  getDivHeight() {
    if (this.innerLabelDiv.current) {
      // Scrollheight will be incorrect if height === 100%, therefore we reset
      this.innerLabelDiv.current.style.height = '';
      return this.innerLabelDiv.current.scrollWidth > this.innerLabelDiv.current.offsetWidth || this.innerLabelDiv.current.scrollHeight > INNER_LABEL_HEIGHT_THRESHOLD_LOW ? '3em' : '1.5em';
    }
    return null;
  }

  /**
   * Return if element can be expanded
   */
  isExpandable() {
    // If not fully loaded the scrollheight might be wrong, therefore we check if it is to wide and two lines
    if (this.innerLabelDiv.current.scrollHeight > INNER_LABEL_HEIGHT_THRESHOLD_HIGH 
      || (this.getDivHeight() === '3em' && this.innerLabelDiv.current.scrollWidth > this.innerLabelDiv.current.offsetWidth * 2)) {
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
    if (this.state.expandable && !this.props.hoverOnly) {
      height += parseInt(window.getComputedStyle(this.props.forwardRef.current).paddingTop);
    }
    const overflowChanges = willOverflow(this.props.labelPos,
      height,
      this.props.topPosition,
      this.props.leftPosition,
      this.props.wrapperHeight);

    return overflowChanges;
  }

  render() {
    const hoverOnly = this.props.hoverOnly ? 'hover-only' : '';
    const isExpanded = this.state.isExpanded ? 'is-expanded' : '';
    const canExpand = this.state.expandable ? 'can-expand' : '';
    const isMultline = (this.state.divHeight != '1.5em') ? 'is-multiline' : '';
    const expandDirection = this.state.expandDirection ? 'expand-' + this.state.expandDirection : '';
    const alignment = this.state.alignment || this.props.labelPos;
    const showLabel = this.props.navButtonFocused && !this.context.extras.isEditor ? 'show-label' : '';

    const expandButtonTabIndex = !this.context.extras.isEditor
      && this.props.isHiddenBehindOverlay ? '-1' : undefined;

    return (
      <div
        className={`nav-label-container
        ${alignment} 
        ${isExpanded} 
        ${canExpand} 
        ${hoverOnly} 
        ${expandDirection} 
        ${isMultline} 
        ${showLabel}
        `}
        onDoubleClick={this.props.onDoubleClick}
      >
        <div
          style={{ height: this.state.divHeight }}
          aria-hidden='true'
          className={`nav-label`}
          ref={this.navLabel}>
          <div
            ref={this.innerLabelDiv}
            // Safari won't show ellipsis unless height is 100%
            style={{height: this.state.innerLabelHeight}}
            className='nav-label-inner'
            dangerouslySetInnerHTML={{ __html: this.props.labelText }}>
          </div>
        </div>
        {canExpand && !hoverOnly &&
          <button
            onFocus={() => this.props.onFocus(true)}
            onBlur={() => this.props.onBlur(false)}
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
