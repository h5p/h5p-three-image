import React from 'react';
import './NavigationButton.scss';
import './NavigationButtonLabel.scss';
import {H5PContext} from "../../context/H5PContext";

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
    this.labelDivInner = React.createRef();
    this.state = {
      expandable: false,
      isExpanded: false,
      divHeight: this.props.hoverOnly ? 'unset' : '1.5em'
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
        this.setState({divHeight: window.getComputedStyle(this.labelDivInner.current).height});
      }, 0);
    }
    else {
      setTimeout(() => {
        this.setState({divHeight: '1.5em'});
      }, 0);
    }

    // This is done seperatly to ensure new height gets calculated
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  componentDidUpdate(prevProps) {
    if (this.props.labelText !== prevProps.labelText) {
      this.setState({ expandable: this.isExpandable() });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({expandable: this.isExpandable()});
    }, 0);
  }

  isExpandable() {
    // If it is allready expanded the width will be the scrollwidth will be the same as offsetwidth
    let isExpanded = this.state.isExpanded ? 1 : 0;

    if (this.labelDivInner.current && this.labelDivInner.current.scrollWidth + isExpanded > this.labelDivInner.current.offsetWidth) {
      return true;
    }
    return false;
  }

  render() {
    const isExpanded = this.state.isExpanded ? 'is-expanded' : '';
    const canExpand = this.state.expandable ? 'can-expand' : '';
    const hoverOnly = this.props.hoverOnly ? 'hover-only' : '';

    const expandButtonTabIndex = !this.context.extras.isEditor
      && this.props.isHiddenBehindOverlay ? '-1' : undefined;

    return (
      <div className={`nav-label-container ${this.props.labelPos} ${isExpanded} ${canExpand} ${hoverOnly}`}>
        <div style={{ height: this.state.divHeight }} aria-hidden='true' className={`nav-label`}>
          <div ref={this.labelDivInner}
            className='nav-label-inner' dangerouslySetInnerHTML={{ __html: this.props.labelText}}>
           
          </div>
        </div>
        {canExpand &&
          <button
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
