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
    if (this.navButtonWrapper) {
      this.navButtonWrapper.current.addEventListener('focus', this.onFocus);
    }
  }

  onFocus() {
    // Already focused
    if (this.state.isFocused) {
      this.navButtonWrapper.current.addEventListener('blur', this.onBlur);
      return;
    }

    this.setState({
      isFocused: true,
    });

    this.navButtonWrapper.current.addEventListener('blur', this.onBlur);
  }

  onBlur(e) {
    const navButtonWrapper = this.navButtonWrapper
      && this.navButtonWrapper.current;

    if (navButtonWrapper && navButtonWrapper.contains(e.relatedTarget)) {
      // Clicked target is child of button wrapper, don't blur
      this.navButtonWrapper.current.focus({
        preventScroll: true
      });
      return;
    }

    this.setState({
      isFocused: false,
    });
    if (this.props.onBlur) {
      this.props.onBlur();
    }

    if (this.navButtonWrapper && this.navButtonWrapper.current) {
      this.navButtonWrapper.current.removeEventListener('blur', this.onBlur);
    }
  }

  componentDidMount() {
    if (this.props.onMount) {
      // Let parent know this element should be added to the THREE world.
      this.props.onMount(this.navButtonWrapper.current);
    }

    this.addFocusListener();
    if (this.state.isFocused) {
      // TODO: Would love to not have to rely on setTimeout here
      //        but without it the element is not available.
      setTimeout(() => { // Note: Don't think the timeout is needed after rendering was fixed
        this.navButtonWrapper.current.focus({
          preventScroll: true
        });
      }, 0);
    }

    this.context.on('goToScene', this.handleGoToScene);
  }

  componentDidUpdate(prevProps) {
    if (this.props.type && this.props.type === this.props.nextFocus && prevProps.nextFocus !== this.props.nextFocus) {
      this.skipFocus = true; // Prevent moving camera on next focus (makes for a better UX when using the mouse)
      this.navButtonWrapper.current.focus({
        preventScroll: true
      });
    }

    if (this.props.isFocused && !prevProps.isFocused) {
      setTimeout(() => { // Note: Don't think the timeout is needed after rendering was fixed
        this.navButtonWrapper.current.focus({
          preventScroll: true
        });
      }, 0);
    }

    if (this.props.onUpdate) {
      // Let parent know this element is updated. (Position might have changed.)
      this.props.onUpdate(this.navButtonWrapper.current);
    }
  }

  componentWillUnmount() {
    if (this.navButtonWrapper) {
      this.navButtonWrapper.current.addEventListener('blur', this.onBlur);
      this.navButtonWrapper.current.removeEventListener('focus', this.onFocus);
    }

    if (this.props.onUnmount) {
      const el = this.navButtonWrapper.current;
      // We want this to run after the component is removed
      setTimeout(() => {
          // Let parent know this element should be remove from the THREE world.
          this.props.onUnmount(el);
      }, 0);
    }

    this.context.off('goToScene', this.handleGoToScene);
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

  /**
   * Handle changing scenes
   */
  handleGoToScene = () => {
    // Make sure focus is dropped when changing scenes (Edge)
    this.setState({
      isFocused: false,
    });
  }

  render() {
    let wrapperClasses = [
      'nav-button-wrapper',
    ];

    if (this.navButtonWrapper && this.navButtonWrapper.current) {
      const wrapper = this.navButtonWrapper.current;
      if (wrapper.classList.contains('dragging')) {
        wrapperClasses.push('dragging');
      }
    }

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

    const isWrapperTabbable = this.context.extras.isEditor;
    const isInnerButtonTabbable = !this.context.extras.isEditor
      && !this.props.isHiddenBehindOverlay;

    return (
      <div
        ref={this.navButtonWrapper}
        className={wrapperClasses.join(' ')}
        style={this.getStyle()}
        tabIndex={isWrapperTabbable ? '0' : undefined}
        onFocus={ this.handleFocus }
        onClick={this.onClick.bind(this)}
      >
        <button
          ref={this.navButton}
          title={this.props.title ? this.props.title : ''}
          className='nav-button'
          tabIndex={ isInnerButtonTabbable ? undefined : '-1'}
          onClick={this.onClick.bind(this)}
          onDoubleClick={this.onDoubleClick.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.setFocus.bind(this)}
        />
        {this.props.children}
      </div>
    );
  }
}
NavigationButton.contextType = H5PContext;
