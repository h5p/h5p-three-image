import React from 'react';
import './NavigationButton.scss';
import {H5PContext} from "../../context/H5PContext";

export const getLabelFromInteraction = (interaction) => {
  return interaction.label
};

export default class NavigationButtonLabel extends React.Component {
  constructor(props) {
    super(props);

    this.navButtonLabel = React.createRef();
    this.state = {
      isFocused: this.props.isFocused,
    };
  }


  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  componentWillUnmount() {
  }


  onClick() {
    const hasClickHandler = this.props.forceClickHandler
      || !this.context.extras.isEditor;

    if (hasClickHandler) {
      this.props.clickHandler();
    }
  }

  onDoubleClick() {
    if (this.props.doubleClickHandler) {
      this.props.doubleClickHandler();
    }
    this.setState({
      isFocused: false,
    });
  }

  onMouseDown(e) {
    const hasMouseDownHandler = this.context.extras.isEditor
      && this.props.mouseDownHandler;

    if (hasMouseDownHandler) {
      this.props.mouseDownHandler(e);
    }
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
      if(this.props.icon === 'h5p-go-back-button') return ""; // prevents rendering on the back button
      if(!this.props.label || !this.props.label.showLabel) return ""; // necessary as the variable doesn't get loaded in straight away.
      let labelText = this.props.label.labelText ? this.props.label.labelText : this.props.title;
      let labelPos = this.props.label.labelPosition === 'inherit' ? this.props.globalLabel.labelPosition : this.props.label.labelPosition;

    return (
        <div className={`nav-label ${labelPos}`}>
          <div className='nav-label-inner'>{labelText}</div>
        </div>
    );
  }
}
NavigationButtonLabel.contextType = H5PContext;
