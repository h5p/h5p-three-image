import React from 'react';
import './NavigationButton.scss';
import {H5PContext} from "../../context/H5PContext";
import NavigationButtonLabel, {getLabelPos, getLabelText, isHoverLabel} from "./NavigationButtonLabel";

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

export const getIconFromInteraction = (interaction, scenes) => {
  const library = interaction.action.library;
  const machineName = H5P.libraryFromString(library).machineName;
  let icon = '';
  if (machineName === 'H5P.GoToScene') {
    icon = Icons.GO_TO_SCENE;

    const nextScene = scenes.find(scene => {
      return scene.sceneId === interaction.action.params.nextSceneId;
    });
    if (nextScene && nextScene.iconType === 'plus') {
      icon = Icons.INFO;
    }
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

export const getLabelFromInteraction = (interaction) => {
  return interaction.label;
};

export default class NavigationButton extends React.Component {
  constructor(props) {
    super(props);

    this.navButtonWrapper = React.createRef();
    this.navButton = React.createRef();
    this.expandButton = React.createRef();
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onLabelFocus = this.onLabelFocus.bind(this);
    this.onLabelBlur = this.onLabelBlur.bind(this);
    this.state = {
      isFocused: this.props.isFocused,
    };
  }

  addFocusListener() {
    if (this.navButtonWrapper) {
      this.navButtonWrapper.current.addEventListener('focus', this.onFocus);
    }
  }

  onLabelFocus() {
    this.setState({isFocused: true});
  }

  onLabelBlur() {
    this.setState({isFocused: false});
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
    if (this.props.onFocusedInteraction) {
      this.props.onFocusedInteraction();
    }

    this.navButton.current.addEventListener('blur', this.onBlur);
    this.forceUpdate();
  }

  onBlur(e) {
    const navButton = this.navButton
      && this.navButton.current;

    if (navButton && navButton.contains(e.relatedTarget) && (!this.expandButton || e.relatedTarget !== this.expandButton.current)) {
      // Clicked target is child of button wrapper and not the expandButton, don't blur
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

    if (this.navButton && this.navButton.current) {
      this.navButton.current.removeEventListener('blur', this.onBlur);
    }
  }

  componentDidMount() {
    if (this.props.onMount) {
      // Let parent know this element should be added to the THREE world.
      this.props.onMount(this.navButtonWrapper.current);
    }

    this.addFocusListener();
    if (this.state.isFocused) {
      setTimeout(() => {
        this.navButtonWrapper.current.focus({
          preventScroll: true
        });
      }, 0);
    }
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

    if (prevProps.isFocused !== this.props.isFocused) {
      if (!this.props.isFocused) {
        this.setState({
          isFocused: false,
        });
      }
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

  handleFocus = (e) => {
    if (this.context.extras.isEditor) {
      if (this.navButtonWrapper && this.navButtonWrapper.current && this.navButtonWrapper === e.target) {
        this.navButtonWrapper.current.focus({
          preventScroll: true
        });
      }
      return;
    }

    if (!this.context.extras.isEditor) {
      if (this.skipFocus) {
        this.skipFocus = false;
      }
      else {
        this.onFocus();
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

    if (this.props.buttonClasses) {
      wrapperClasses = wrapperClasses.concat(this.props.buttonClasses);
    }

    if (this.props.icon) {
      wrapperClasses.push(this.props.icon);
    }

    if (this.state.isMouseOver) {
      wrapperClasses.push('hover');
    }

    // only apply custom focus if we have children that are shown on focus
    if (this.state.isFocused) {
      wrapperClasses.push('focused');
    }

    const isWrapperTabbable = this.context.extras.isEditor;
    const isInnerButtonTabbable = !this.context.extras.isEditor
      && !this.props.isHiddenBehindOverlay;

    let title = '';
    if (this.props.title) {
      const titleText = document.createElement('div');
      titleText.innerHTML = this.props.title;
      title = titleText.textContent;
    }

    return (

      <div
        ref={this.navButtonWrapper}
        className={wrapperClasses.join(' ')}
        style={this.getStyle()}
        tabIndex={isWrapperTabbable ? '0' : undefined}
        onClick={this.onClick.bind(this)}
      >
        <button
          ref={this.navButton}
          title={getLabelText(this.props.label, title)}
          className='nav-button'
          tabIndex={ isInnerButtonTabbable ? undefined : '-1'}
          onClick={this.onClick.bind(this)}
          onDoubleClick={this.onDoubleClick.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.setFocus.bind(this)}
          onFocus={this.handleFocus}
        />
        {this.props.children}
        {this.props.icon !== 'h5p-go-back-button' && 
        <NavigationButtonLabel
          labelText={getLabelText(this.props.label, title)}
          labelPos={getLabelPos(this.props.label, this.context.behavior.label)}
          hoverOnly={isHoverLabel(this.props.label, this.context.behavior.label)}
          onMount={this.props.onMount}
          onLabelFocus={this.onLabelFocus}
          onLabelBlur={this.onLabelBlur}
        />}
      </div>
    );
  }
}
NavigationButton.contextType = H5PContext;
