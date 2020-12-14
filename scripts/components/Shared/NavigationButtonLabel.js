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
  return label.labelText ? label.labelText : title;
};

export const isHoverLabel = (label) => {
  return !label.showLabel;
};

export default class NavigationButtonLabel extends React.Component {
  constructor(props) {
    super(props);

    this.onClick.bind(this);

    this.labelDiv = React.createRef();
    this.state = {
      expandable: false,
      isExpanded: false
    };
  }

  onClick(e) {
    e.stopPropagation();
    if (!this.state.expandable) {
      return;
    }
    this.setState({isExpanded: !this.state.isExpanded});
  }

  componentDidMount() {
    setTimeout(() => {
      this.isExpandable();
    }, 0);
  }

  isExpandable() {
    if (this.labelDiv.current.scrollWidth > this.labelDiv.current.offsetWidth) {
      this.setState({expandable: true});
    }
  }

  render() {
    const isExpanded = this.state.isExpanded === true ? 'is-expanded' : '';
    const canExpand = this.state.expandable === true ? 'can-expand' : '';
    const hoverOnly = this.props.hoverOnly === true ? 'hover-only' : '';
    const isEditor = this.context.extras.isEditor;

    return (
      <div className='nav-label-container'>
        <div className={`nav-label ${this.props.labelPos} ${isExpanded} ${canExpand} ${hoverOnly}`}>
          <div ref={this.labelDiv}
            className='nav-label-inner'>
            {this.props.labelText}
          </div>
          {canExpand && <button className="nav-label-expand" tabIndex={isEditor ? '-1' : undefined} aria-label="expand-label"  onClick={this.onClick.bind(this) }>
            <div className="nav-label-expand-arrow"/>
          </button>}
        </div>
        
      </div>
    );
  }
}
NavigationButtonLabel.contextType = H5PContext;
