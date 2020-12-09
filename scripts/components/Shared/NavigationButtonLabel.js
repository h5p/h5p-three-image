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
  return label.labelText ? label.labelText : title;
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

  onClick() {
    if (!this.state.expandable) {
      return;
    }
    this.setState({isExpanded: !this.state.isExpanded});
  }

  componentDidMount() {
    // if (this.props.onMount) {
    //   // Let parent know this element should be added to the THREE world.
    //   this.props.onMount(this.navButtonWrapper.current);
    // }

    setTimeout(() => { // Note: Don't think the timeout is needed after rendering was fixed
      this.isExpandable();
    }, 0);

    // this.addFocusListener();
    if (this.state.isFocused) {
      // TODO: Would love to not have to rely on setTimeout here
      //        but without it the element is not available.
      setTimeout(() => { // Note: Don't think the timeout is needed after rendering was fixed
        this.navButtonWrapper.current.focus({
          preventScroll: true
        });
      }, 0);
    }
  }

  isExpandable() {
    if (this.labelDiv.current.scrollWidth > this.labelDiv.current.offsetWidth) {
      this.setState({expandable: true});
    }
  }

  // onDoubleClick() {
  //   if (this.props.doubleClickHandler) {
  //     this.props.doubleClickHandler();
  //   }
  //   this.setState({
  //     isFocused: false,
  //   });
  // }

  // setFocus() {
  //   const isFocusable = this.context.extras.isEditor
  //     && this.navButtonWrapper
  //     && this.navButtonWrapper.current;
  //   if (isFocusable) {
  //     this.navButtonWrapper.current.focus({
  //       preventScroll: true
  //     });
  //   }
  // }

  // handleFocus = () => {
  //   if (this.context.extras.isEditor) {
  //     if (this.navButtonWrapper && this.navButtonWrapper.current) {
  //       this.navButtonWrapper.current.focus({
  //         preventScroll: true
  //       });
  //     }
  //     return;
  //   }

  //   if (!this.context.extras.isEditor && this.props.onFocus) {
  //     if (this.skipFocus) {
  //       this.skipFocus = false;
  //     }
  //     else {
  //       this.props.onFocus();
  //     }
  //   }
  // }

  render() {
    const isExpanded = this.state.isExpanded === true ? 'expanded' : '';
    const canExpand = this.state.expandable === true ? 'can-expand' : '';
    return (
      <div
        onClick={this.onClick.bind(this)}
        className={`nav-label ${this.props.labelPos} ${isExpanded} ${canExpand}`}
      >
        <div ref={this.labelDiv}
          className='nav-label-inner'>
          {this.props.labelText}
        </div>
      </div>
    );
  }
}
NavigationButtonLabel.contextType = H5PContext;
