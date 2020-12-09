import React from 'react';
import './NavigationButton.scss';
import {H5PContext} from "../../context/H5PContext";

export const getLabelFromInteraction = (interaction) => {
  return interaction.label;
};

export const getLabelPos = (label, globalLabel) => {
  return label.labelPosition === 'inherit' ? globalLabel.labelPosition : label.labelPosition;
};

export const getLabelText = (label, title) => {
  console.log(label, title)
  return label.labelText ? label.labelText : title;
};

export default class NavigationButtonLabel extends React.Component {
  constructor(props) {
    super(props);

    this.onClick.bind(this);

    this.navButtonLabel = React.createRef();
    this.state = {
      expandable: this.isExpandable(),
      isExpanded: false
    };
  }

  onClick() {
    if(!this.state.expandable) {
      return;
    }
    this.setState({isExpanded: !this.state.isExpanded});
  }

  onDoubleClick() {
    if (this.props.doubleClickHandler) {
      this.props.doubleClickHandler();
    }
    this.setState({
      isFocused: false,
    });
  }

  isExpandable() {
    return true;
  }


  setFocus() {
    const isFocusable = this.context.extras.isEditor
      && this.navButtonWrapper
      && this.navButtonWrapper.current;
    if (isFocusable) {
      this.navButtonWrapper.current.focus({
        preventScroll: true
      });
    }
  }

  handleFocus = () => {
    if (this.context.extras.isEditor) {
      if (this.navButtonWrapper && this.navButtonWrapper.current) {
        this.navButtonWrapper.current.focus({
          preventScroll: true
        });
      }
      return;
    }

    if (!this.context.extras.isEditor && this.props.onFocus) {
      if (this.skipFocus) {
        this.skipFocus = false;
      }
      else {
        this.props.onFocus();
      }
    }
  }

  render(props) {
      const isExpanded = this.state.isExpanded === true ? 'expanded' : '';
      const canExpand = this.state.expandable === true ? 'canExpand' : '';
      console.log(this.props)
    return (
      <div onClick={this.onClick.bind(this)} className={`nav-label ${this.props.labelPos} ${isExpanded} ${canExpand}`}>
        <div className='nav-label-inner'>{this.props.labelText}</div>
      </div>
    );
  }
}
NavigationButtonLabel.contextType = H5PContext;
