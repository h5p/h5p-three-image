import React from 'react';
import ReactDOM from 'react-dom';
import NavigationButton, {getIconFromInteraction, getLabelFromInteraction} from "../../Shared/NavigationButton";
import {H5PContext} from '../../../context/H5PContext';
import ContextMenu from "../../Shared/ContextMenu";
import loading from '../../../assets/images/loading.svg';
import './ThreeSixtyScene.scss';

export const sceneRenderingQualityMapping = {
  high: 128,
  medium: 64,
  low: 16,
};

export default class ThreeSixtyScene extends React.Component {
  constructor(props) {
    super(props);

    this.sceneRef = React.createRef();
    this.renderedInteractions = 0;

    this.state = {
      imagePath: null, // Path of current loaded image
      isLoaded: false, // Has the image been loaded
      isUpdated: false, // Has the scene been updated
      isRendered: false, // Has the scene been drawn
      cameraPosition: null, // Store current camera position between scene changes
      pointerLockElement: null,
      willPointerLock: false,
      hasPointerLock: false,
    };
  }


  /**
   * Locks the dragged Navigation Button to the pointer
   * @param  {Object} element
   */
  initializePointerLock(element) {
    // Not supported
    element.requestPointerLock = element.requestPointerLock
      || element.mozRequestPointerLock;
    if (!element.requestPointerLock) {
      return;
    }

    // Already queued
    if (this.pointerLockTimeout && this.pointerLockTimeout.current) {
      return;
    }

    this.setState({
      willPointerLock: true,
      pointerLockElement: element,
    });

    this.pointerLockTimeout = setTimeout(() => {
      this.setState({
        hasPointerLock: true,
      });
    }, 100);
  }

 
  /**
   * Unlocks the Navigation Button from the pointer.
   */
  cancelPointerLock() {
    this.setState({
      willPointerLock: false,
      hasPointerLock: false,
    });
  }

 
  /**
   * Called when the scene is moved, caused by a drag event.
   * @param  {H5P.Event} e
   */
  handleSceneMoveStart = (e) => {
    
    if (!this.context.extras.isEditor || e.data.isCamera) {
      return;
    }

    const target = e.data.target;
    if (target) {
      // Don't move when dragging context menu
      if (target.classList.contains('context-menu')) {
        e.defaultPrevented = true;
        return false;
      }

      // Don't move when dragging context menu children
      if (target.parentNode) {
        const parent = target.parentNode;
        if (parent.classList.contains('context-menu')) {
          e.defaultPrevented = true;
          return false;
        }
      }
    }

    // Make sure we don't start movement on contextmenu actions
    if (target && (
      target.classList.contains('nav-button')
      || target.classList.contains('nav-label-container')
      || target.classList.contains('nav-label')
      || target.classList.contains('nav-label-inner'))) {
      const element = e.data.element;
      this.initializePointerLock(element);
    }

    return;
  }

  // Since some interactions don't have titles this seeks to use the closest thing to a title to prevent "Untitled Text"
  getInteractionTitle(action) {
    const currentTitle = action.metadata.title;    
    switch (currentTitle) {
      case 'Untitled Text':
        return action.params.text;
      case "Untitled Image":
        return action.params.alt;
      default:
        return currentTitle;
    }
  }

  /**
   * Called when a scene move is stopped after dragging ends.
   */
  handleSceneMoveStop = (e) => {
    if (this.context.extras.isEditor) {
      this.cancelPointerLock();
    }
    this.context.trigger('movestop', e.data);
  }

  /**
   * Creates a ThreeSixty object. If one exists uses that one.
   * Apply all listeners
   */
  initializeThreeSixty = () => {
    // Determine camera position
    let cameraPosition = this.state.cameraPosition;
    if (!cameraPosition) {
      const startPosition = this.props.sceneParams.cameraStartPosition
        .split(',')
        .map(parseFloat);

      cameraPosition = {
        yaw: startPosition[0],
        pitch: startPosition[1],
      };
    }

    let threeSixty;
    if (!this.props.threeSixty) {
      // ThreeSixty has not been used, yet. Create a new instance
      threeSixty = new H5P.ThreeSixty(this.imageElement, {
        ratio: 16/9,
        cameraStartPosition: cameraPosition,
        segments: sceneRenderingQualityMapping[this.context.sceneRenderingQuality],
      });
      this.props.addThreeSixty(threeSixty);
    }
    else {
      // Set texture + camera pos
      threeSixty = this.props.threeSixty;
      threeSixty.setSourceElement(this.imageElement);
      threeSixty.setCameraPosition(cameraPosition.yaw, cameraPosition.pitch);
    }

    threeSixty.setAriaLabel(this.props.sceneParams.scenename);
    this.sceneRef.current.appendChild(threeSixty.getElement());
    threeSixty.resize(this.context.getRatio());

    // Show loading screen until first render has been drawn
    threeSixty.on('firstrender', () => {
      this.setState({
        isRendered: true
      });
      threeSixty.focus();
    });

    threeSixty.startRendering();
    threeSixty.update();

    threeSixty.on('movestart', this.handleSceneMoveStart);
    threeSixty.on('movestop', this.handleSceneMoveStop);

    // Add buttons to scene
    this.addInteractionHotspots(threeSixty, this.props.sceneParams.interactions);
  }

  /**
   * Loads the current ThreeSixty scene
   */
  loadScene() {
    if (!this.imageElement) {
      // Create image element used for loading on first load
      this.imageElement = document.createElement('img');
      this.imageElement.addEventListener('load', this.sceneLoaded);
    }

    this.setState({
      imagePath: this.props.imageSrc.path,
      isRendered: false
    });

    if (H5P.setSource !== undefined) {
      H5P.setSource(this.imageElement, this.props.imageSrc, this.context.contentId);
    }
    else {
      const path = H5P.getPath(this.props.imageSrc.path, this.context.contentId);
      if (H5P.getCrossOrigin !== undefined) {
        const crossorigin = H5P.getCrossOrigin(path);
        if (crossorigin) {
          this.imageElement.setAttribute('crossorigin', crossorigin);
        }
      }
      this.imageElement.src = path;
    }
  }

  /**
   * Triggeered when the scene is loaded.  Updates state.threeSixty in Main.js
   */
  sceneLoaded = () => {
    if (this.state.isLoaded && this.state.isUpdated && this.props.isActive) {
      // Has been loaded before, we only need to reload the texture
      this.props.threeSixty.update();
    }
    else {
      this.setState({
        isLoaded: true // Indicates that this.imageElement can now be used
      });
    }
  }

  /**
   * Create, add and render all interactions in the 3D world.
   *
   * @param {Array} interactions
   */
  addInteractionHotspots(threeSixty, interactions) {
    const list = interactions ? interactions.map(this.createInteraction) : [];
    this.renderedInteractions = list.length;

    ReactDOM.render(
      <H5PContext.Provider value={this.context}>
        { list }
      </H5PContext.Provider>,
      threeSixty.getCameraElement()
    );
  }

  /**
   * Creates a button for each interaction
   *
   * @param {Object} interaction
   * @param {number} index
   * @return {NavigationButton}
   */
  createInteraction = (interaction, index) => {

    const className = ['three-sixty'];
    if (this.props.audioIsPlaying === 'interaction-' + this.props.sceneId + '-' + index) {
      className.push('active');
    }

    let title;
    const isGoToSceneInteraction = interaction.action.library.split(' ')[0] === 'H5P.GoToScene';
    if (isGoToSceneInteraction) {
      const gotoScene = this.context.params.scenes.find(scene => {
        return scene.sceneId === interaction.action.params.nextSceneId;
      });
      title = gotoScene.scenename; // Use scenename as title.
    }
    else {
      title = this.getInteractionTitle(interaction.action);
    }

    return (
      <NavigationButton
        key={'interaction-' + this.props.sceneId + index}
        onMount={ el => this.props.threeSixty.add(
          el,
          ThreeSixtyScene.getPositionFromString(interaction.interactionpos),
          this.context.extras.isEditor
        )}
        onUnmount={ el => this.props.threeSixty.remove(this.props.threeSixty.find(el)) }
        onUpdate={ el => H5P.ThreeSixty.setElementPosition(
          this.props.threeSixty.find(el),
          ThreeSixtyScene.getPositionFromString(interaction.interactionpos)
        )}
        title={title}
        label={getLabelFromInteraction(interaction)}
        buttonClasses={ className }
        icon={getIconFromInteraction(interaction, this.context.params.scenes)}
        isHiddenBehindOverlay={ this.props.isHiddenBehindOverlay }
        nextFocus={ this.props.nextFocus }
        type={ 'interaction-' + index }
        clickHandler={this.props.showInteraction.bind(this, index)}
        doubleClickHandler={() => {
          this.context.trigger('doubleClickedInteraction', index);
        }}
        onFocus={ () => {
          this.handleInteractionFocus(interaction);
        }}
        onFocusedInteraction={this.props.onFocusedInteraction.bind(this, index)}
        onBlur={this.props.onBlurInteraction}
        isFocused={this.props.focusedInteraction === index}
        rendered={this.state.isUpdated}
      >
        {
          this.context.extras.isEditor &&
          <ContextMenu
            isGoToScene={isGoToSceneInteraction}
            interactionIndex={index}
          />
        }
      </NavigationButton>
    );
  }

  /**
   * Convert params position string.
   * TODO: Use object in params instead of convert all the time.
   *
   * @param {string} position
   * @return {Object} yaw, pitch
   */
  static getPositionFromString(position) {
    position = position.split(',');
    return {
      yaw: position[0],
      pitch: position[1]
    };
  }

  /**
   * Handle interaction focused.
   *
   * @param {Object} interaction
   */
  handleInteractionFocus = (interaction) => {
    this.props.onSetCameraPos(interaction.interactionpos);
  }

  /**
   * React -
   */
  componentDidMount() {
    this.loadScene();

    this.context.on('doubleClickedInteraction', () => {
      this.cancelPointerLock();
    });
  }

  /**
   * React -
   */
  componentDidUpdate(prevProps) {
    if ((this.props.isActive && this.state.isLoaded && !this.state.isUpdated) || 
    (this.props.isActive && this.props.updateThreeSixty)) {
      // Active and loaded, prepare the scene
      setTimeout(() => {
        this.initializeThreeSixty();
      }, 40); // Using timeout to allow loading screen to render before we load WebGL
      this.setState({
        isUpdated: true
      });
    }

    if (this.state.imagePath !== this.props.imageSrc.path) {
      this.loadScene();
    }

    if (prevProps.isActive && !this.props.isActive) {
      // No longer active, indicate that scene must be updated
      this.props.threeSixty.stopRendering();
      this.props.threeSixty.off('movestart', this.handleSceneMoveStart);
      this.props.threeSixty.off('movestop', this.handleSceneMoveStop);
      this.props.threeSixty.off('firstrender');
      this.setState({
        cameraPosition: this.props.threeSixty.getCurrentPosition(),
        isUpdated: false,
        isRendered: false
      });
    }

    if (this.state.hasPointerLock) {
      if (!this.state.willPointerLock) {
        // canceled
        this.setState({
          willPointerLock: false,
          hasPointerLock: false,
        });
      }
      else {
        this.state.pointerLockElement.requestPointerLock();
        this.state.pointerLockElement.classList.add('dragging');
      }
    }
    else {
      document.exitPointerLock = document.exitPointerLock
        || document.mozExitPointerLock;
      if (document.exitPointerLock) {
        if (this.state.pointerLockElement) {
          this.state.pointerLockElement.classList.remove('dragging');
        }
        document.exitPointerLock();
      }
    }

    // Need to respond to dialog toggling in order to hide the buttons under the overlay
    const isHiddenBehindOverlayHasChanged = (this.props.isHiddenBehindOverlay !== prevProps.isHiddenBehindOverlay);
    if (isHiddenBehindOverlayHasChanged && this.state.isUpdated) {
      // TODO: Update scene element
      this.props.threeSixty.setTabIndex(false);
    }

    if (this.props.threeSixty && this.props.isActive) {
      // Need to respond to audio in order to update the icon of the interaction
      const audioHasChanged = (prevProps.audioIsPlaying !== this.props.audioIsPlaying);
      const hasChangedFocus = prevProps.focusedInteraction
        !== this.props.focusedInteraction;

      const hasChangedInteractions = this.props.sceneParams.interactions
        && (this.renderedInteractions
          !== this.props.sceneParams.interactions.length);

      let shouldUpdateInteractionHotspots = hasChangedInteractions
          || audioHasChanged
          || hasChangedFocus
          || isHiddenBehindOverlayHasChanged
          || this.props.isEditingInteraction;

      // Check if the scene that interactions point to has changed icon type
      // This is only relevant when changing the icon using the H5P editor
      if (window.H5PEditor && !shouldUpdateInteractionHotspots && this.props.sceneParams.interactions) {
        shouldUpdateInteractionHotspots = this.props.sceneParams.interactions.some((interaction) => {
          const library = H5P.libraryFromString(interaction.action.library);
          const machineName = library.machineName;
          if (machineName === 'H5P.GoToScene') {
            const nextSceneId = interaction.action.params.nextSceneId;
            const nextSceneIcon = this.props.sceneIcons.find(scene => {
              return scene.id === nextSceneId;
            });
            const oldNextSceneIcon = prevProps.sceneIcons.find(scene => {
              return scene.id === nextSceneId;
            });

            const hasChangedIcon = nextSceneIcon
              && oldNextSceneIcon
              && nextSceneIcon.iconType !== oldNextSceneIcon.iconType;
            if (hasChangedIcon) {
              return true;
            }
          }
          return false;
        });
      }

      if (shouldUpdateInteractionHotspots) {
        this.addInteractionHotspots(this.props.threeSixty, this.props.sceneParams.interactions);
      }
    }
  }

  /**
   * React -
   */
  render() {
    if (!this.props.isActive) {
      return null;
    }

    return (
      <div className='three-sixty-scene-wrapper'>
        <div
          ref={this.sceneRef}
          aria-hidden={ this.props.isHiddenBehindOverlay ? true : undefined }
        />
        {
          (!this.state.isRendered) &&
          <div className='loading-overlay'>
            <div className='loading-wrapper'>
              <div className='loading-image-wrapper'>
                <img src={loading} alt='loading' />
              </div>
              <div className='loader' dangerouslySetInnerHTML={{ __html: this.context.l10n.backgroundLoading }}></div>
            </div>
          </div>
        }
      </div>
    );
  }
}

ThreeSixtyScene.contextType = H5PContext;
