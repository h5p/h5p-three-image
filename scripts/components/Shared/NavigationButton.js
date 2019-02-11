import React from 'react';
import './NavigationButton.scss';
import {H5PContext} from "../../context/H5PContext";

export const Icons = {
  INFO: 'h5p-info-button h5p-interaction-button',
  QUESTION: 'h5p-question-button h5p-interaction-button',
  GO_TO_SCENE: 'h5p-go-to-scene-button',
  GO_BACK: 'h5p-go-back-button',
  SCENE_DESCRIPTION: 'h5p-scene-description-button',
  AUDIO: 'h5p-audio-button h5p-interaction-button',
};

const infoInteractions = [
  "H5P.AdvancedText",
  "H5P.Image",
  "H5P.Video",
];

const isInfoInteraction = (machineName) => {
  return infoInteractions.includes(machineName);
};

export const getIconFromInteraction = (interaction) => {
  const library = interaction.action.library;
  const machineName = H5P.libraryFromString(library).machineName;
  let icon = '';
  if (machineName === 'H5P.GoToScene') {
    icon = Icons.GO_TO_SCENE;
  }
  else if (machineName === 'H5P.Audio') {
    icon = Icons.AUDIO;
  }
  else if (isInfoInteraction(machineName)) {
    icon = Icons.INFO;
  }
  else {
    icon = Icons.QUESTION;
  }
  return icon;
};

export default class NavigationButton extends React.Component {
  constructor(props) {
    super(props);

    this.navButtonWrapper = React.createRef();
    this.navButton = React.createRef();
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);

    this.state = {
      isFocused: this.props.isFocused,
    };
  }

  addFocusListener() {
    if (this.navButton) {
      this.navButton.current.addEventListener('focus', this.onFocus);
    }
  }

  onFocus() {
    // Already focused
    if (this.state.isFocused) {
      this.navButton.current.addEventListener('blur', this.onBlur);
      return;
    }

    this.setState({
      isFocused: true,
    });

    this.navButton.current.addEventListener('blur', this.onBlur);
  }

  onBlur(e) {
    const navButtonWrapper = this.navButtonWrapper
      && this.navButtonWrapper.current;

    if (navButtonWrapper && navButtonWrapper.contains(e.relatedTarget)) {
      // Clicked target is child of button wrapper, don't blur
      this.navButton.current.focus();
      return;
    }

    this.setState({
      isFocused: false,
    });
    if (this.props.onBlur) {
      this.props.onBlur();
    }

    if (this.navButton && this.navButton.current) {
      this.navButton.current.removeEventListener('blur', this.onBlur);
    }
  }

  componentDidMount() {
    this.addFocusListener();
    if (this.state.isFocused) {
      // TODO: Would love to not have to rely on setTimeout here
      //        but without it the element is not available.
      setTimeout(() => {
        this.navButton.current.focus();
      }, 0);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.type && this.props.type === this.props.nextFocus) {
      this.skipFocus = true; // Prevent moving camera on next focus (makes for a better UX when using the mouse)
      this.navButton.current.focus();
    }

    if (this.props.isFocused && !prevProps.isFocused) {
      setTimeout(() => {
        this.navButton.current.focus();
      }, 0);
    }
  }

  componentWillUnmount() {
    if (this.navButton) {
      this.navButton.current.addEventListener('blur', this.onBlur);
      this.navButton.current.removeEventListener('focus', this.onFocus);
    }
  }

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
  }

  onMouseDown(e) {
    const hasMouseDownHandler = this.context.extras.isEditor
      && this.props.mouseDownHandler;

    if (hasMouseDownHandler) {
      this.props.mouseDownHandler(e);
    }
  }

  handleFocus = () => {
    if (this.props.onFocus) {
      if (this.skipFocus) {
        this.skipFocus = false;
      }
      else {
        this.props.onFocus();
      }
    }
  }

  render() {
    let wrapperClasses = [
      'nav-button-wrapper',
    ];

    if (this.props.buttonClasses) {
      wrapperClasses = wrapperClasses.concat(this.props.buttonClasses);
    }

    if (this.props.icon) {
      wrapperClasses.push(this.props.icon);
    }

    // only apply custom focus if we have children that are shown on focus
    if (this.state.isFocused && this.props.children) {
      wrapperClasses.push('focused');
    }

    return (
      <div
        ref={this.navButtonWrapper}
        className={wrapperClasses.join(' ')}
        style={this.getStyle()}
      >
        <button
          ref={this.navButton}
          title={this.props.title ? this.props.title : ''}
          className='nav-button'
          tabIndex={ this.props.isHiddenBehindOverlay ? '-1' : undefined }
          onClick={this.onClick.bind(this)}
          onDoubleClick={this.onDoubleClick.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onFocus={ this.handleFocus }
        />
        {this.props.children}
      </div>
    );
  }
}
NavigationButton.contextType = H5PContext;
