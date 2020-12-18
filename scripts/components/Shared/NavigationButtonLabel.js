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
    this.labelDiv = React.createRef();
    this.labelButton = React.createRef();

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.state = {
      expandable: false,
      isExpanded: false,
      divHeight: this.props.hoverOnly === true ? 'unset' : '1.5em'
    };

  }

  onClick(e) {
    e.stopPropagation();
    if (!this.state.expandable) {
      return;
    }

    // This is done seperatly to ensure new height gets calculated
    this.setState({isExpanded: !this.state.isExpanded});

    if (!this.state.isExpanded) {
      setTimeout(() => {
        this.setState({divHeight: window.getComputedStyle(this.labelDiv.current).height});
      }, 0);
    }
    else {
      setTimeout(() => {
        this.setState({divHeight: '1.5em'});
      }, 0);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({expandable: this.isExpandable()}); 
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({expandable: this.isExpandable()});
    }, 0);
  }

  onBlur() {
    if (this.labelButton && this.labelButton.current) {
      this.labelButton.current.removeEventListener('blur', this.onBlur);
    }
    this.props.onLabelBlur();
  }

  onFocus() {
    this.labelButton.current.addEventListener('blur', this.onBlur);
    this.props.setFocus;
    this.props.onLabelFocus();
  }

  isExpandable() {
    let isExpanded = 0;
    if (this.state.isExpanded) {
      isExpanded = 1;
    }

    if (this.labelDiv.current && this.labelDiv.current.scrollWidth + isExpanded > this.labelDiv.current.offsetWidth) {
      return true;
    }
    return false;
  }

  render() {
    const isExpanded = this.state.isExpanded === true ? 'is-expanded' : '';
    const canExpand = this.state.expandable === true ? 'can-expand' : '';
    const hoverOnly = this.props.hoverOnly === true ? 'hover-only' : '';

    const expandButtonTabIndex = !this.context.extras.isEditor
      && this.props.isHiddenBehindOverlay ? '-1' : undefined;

    return (
      <div className={`nav-label-container ${this.props.labelPos} ${isExpanded} ${canExpand} ${hoverOnly}`}>
        <div style={{ height: this.state.divHeight }} aria-hidden='true' className={`nav-label`}>
          <div ref={this.labelDiv}
            className='nav-label-inner' dangerouslySetInnerHTML={{ __html: this.props.labelText}}>
           
          </div>
        </div>
        {canExpand &&
          <button
            ref={this.props.forwardRef}
            className="nav-label-expand"
            tabIndex={expandButtonTabIndex}
            aria-label={this.context.l10n.expandButtonAriaLabel}
            onClick={this.onClick.bind(this)}
            onFocus={this.onFocus}
            ref={this.labelButton}>
            <div className="nav-label-expand-arrow" />
          </button>}
      </div>
    );
  }
}
NavigationButtonLabel.contextType = H5PContext;
