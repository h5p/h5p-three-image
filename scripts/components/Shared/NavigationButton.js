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
  return {...interaction.label, labelText: interaction.labelText};
};

export default class NavigationButton extends React.Component {
  constructor(props) {
    super(props);

    this.navButtonWrapper = React.createRef();
    this.navButton = React.createRef();
    this.expandButton = React.createRef();
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.state = {
      isFocused: this.props.isFocused,
      expandButtonFocused: false,
      innerButtonFocused: false
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
      return;
    }

    this.setState({
      isFocused: true,
    });
    if (this.props.onFocusedInteraction) {
      this.props.onFocusedInteraction();
    }

  }

  onBlur(e) {
    const navButtonWrapper = this.navButtonWrapper
      && this.navButtonWrapper.current;

    if (navButtonWrapper && navButtonWrapper.contains(e.relatedTarget) && (!this.expandButton || e.relatedTarget !== this.expandButton.current)) {
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
      this[this.context.extras.isEditor ? 'navButtonWrapper' : 'navButton'].current.focus({
        preventScroll: true
      });
    }

    if (this.props.isFocused && !prevProps.isFocused) {
      setTimeout(() => { // Note: Don't think the timeout is needed after rendering was fixed
        if (this.navButtonWrapper.current) {
          this.navButtonWrapper.current.focus({
            preventScroll: true
          });
        }
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

      // Reset button focus state when changing scenes or opening content
      this.setState({
        innerButtonFocused: false
      });
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

    if (!this.context.extras.isEditor  && this.props.onFocus) {
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

  handleExpandButtonFocus = () => {
    this.setState({
      expandButtonFocused: true
    });
    if (this.props.onFocusedInteraction) {
      this.props.onFocus();
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

    if (this.state.isMouseOver) {
      wrapperClasses.push('hover');
    }

    // only apply custom focus if we have children that are shown on focus
    if (this.state.isFocused && this.props.children) {
      wrapperClasses.push('focused');
    }

    // Add classname to current active element (wrapper, button or expand label button) so it can be shown on top
    if (this.state.isFocused && this.props.children
      || this.state.expandButtonFocused
      || this.state.innerButtonFocused) {
      wrapperClasses.push('active-element');
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

    let label = this.props.label ? this.props.label : {
      labelPosition: "inherit",
      showLabel: "inherit"
    };
    
    let labelPos = getLabelPos(this.context.behavior.label, label);
    let hoverLabel = isHoverLabel(this.context.behavior.label, label);

    const labelText = getLabelText(label);
    return (

      <div
        ref={this.navButtonWrapper}
        className={wrapperClasses.join(' ')}
        style={this.getStyle()}
        tabIndex={isWrapperTabbable ? '0' : undefined}
        onFocus={this.handleFocus}
        onClick={this.onClick.bind(this)}
        onBlur={this.onBlur.bind(this)}
      >
        <button
          type="button"
          ref={this.navButton}
          aria-label={labelText ? labelText : title}
          className='nav-button'
          tabIndex={ isInnerButtonTabbable ? undefined : '-1'}
          onClick={this.onClick.bind(this)}
          onDoubleClick={this.onDoubleClick.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.setFocus.bind(this)}
          onFocus={() => this.setState({ innerButtonFocused: true })}
          onBlur={() => this.setState({ innerButtonFocused: false })} />
        {this.props.children}
        {this.props.icon !== 'h5p-go-back-button' && labelText !== '' &&
          <NavigationButtonLabel
            labelText={labelText}
            labelPos={labelPos}
            hoverOnly={hoverLabel}
            onMount={this.props.onMount}
            forwardRef={this.expandButton}
            onFocus={this.handleExpandButtonFocus.bind(this)}
            onBlur={() => this.setState({ expandButtonFocused: false })}
            topPosition={this.props.topPosition*this.props.wrapperHeight/100}
            wrapperHeight={this.props.wrapperHeight}
            leftPosition={this.props.leftPosition}
            navButtonHeight={this.navButton.current ? this.navButton.current.offsetHeight : null}
            staticScene={this.props.staticScene}
            navButtonFocused={this.state.innerButtonFocused}
            rendered={this.props.rendered}
            onDoubleClick={this.onDoubleClick.bind(this)}
          />
        }
      </div>
    );
  }
}
NavigationButton.contextType = H5PContext;
