import React from 'react';
import './StaticScene.scss';
import NavigationButton, {getIconFromInteraction, getLabelFromInteraction, Icons} from "../../Interactions/NavigationButton";
import {H5PContext} from "../../../context/H5PContext";
import {SceneTypes} from "../Scene";
import ContextMenu from "../../Shared/ContextMenu";

export default class StaticScene extends React.Component {
  constructor(props) {
    super(props);

    this.sceneWrapperRef = React.createRef();
    this.imageElementRef = React.createRef();
    this.overLayRef = React.createRef();

    this.state = {
      x: null,
      y: null,
      draggingInteractionIndex: null,
      isDragDelayed: true,
      draggingElement: null,
      isVerticalImage: false,
    };

    /**
     *  Note: Need to bind function reference once in the constructor
     *        otherwise EventListener will not be removed, since it will
     *        think it is a new function reference if we bind it when creating
     *        the listener.
     *        @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind}
     */
    this.onMove = this.onMove.bind(this);
    this.stoppedDragging = this.stoppedDragging.bind(this);
  }

  componentDidMount() {
    // Initialize resize logic
    this.context.on('resize', () => {
      this.resizeScene();
    });
    this.resizeScene();

    if (this.props.isActive && this.props.sceneWaitingForLoad !== null) {
      // Let main know that scene is finished loading
      this.props.doneLoadingNextScene();
    }
  }

  componentDidUpdate() {
    if (this.props.isActive && this.props.sceneWaitingForLoad !== null) {
      // Let main know that scene is finished loading
      this.props.doneLoadingNextScene();
    }

    // Specific to Firefox - Interaction buttons are moving out of scope when image is potrait
    if (this.sceneWrapperRef.current !== null
      && this.sceneWrapperRef.current.clientWidth !== this.imageElementRef.current.clientWidth
      && this.imageElementRef.current.clientWidth > 0) {
      this.sceneWrapperRef.current.style.width = `${this.imageElementRef.current.clientWidth}px`;
    }
  }

  resizeScene() {
    if (!this.sceneWrapperRef || !this.sceneWrapperRef.current) {
      return;
    }

    const wrapper = this.sceneWrapperRef.current;
    const wrapperSize = wrapper.getBoundingClientRect();
    const defaultSize = 938;
    const defaultFontSize = 16;
    this.sceneWrapperRef.current.style.width = `100%`;
    
    // Specific to Firefox - Interaction buttons are moving out of scope when image is potrait
    if (this.imageElementRef.current.clientWidth > 0) {
      this.sceneWrapperRef.current.style.width = `${this.imageElementRef.current.clientWidth}px`;
    }

    // Only make icons smaller if necessary
    if (wrapperSize.width > defaultSize) {
      const currentFontSize = wrapper.style.fontSize;
      if (parseFloat(currentFontSize) !== defaultFontSize) {
        this.sceneWrapperRef.current.style.fontSize = `${defaultFontSize}px`;
        this.forceUpdate();
      }
      return;
    }

    const minFontSize = 14;
    const fontIncrementThreshold = 55;
    const widthDiff = defaultSize - wrapperSize.width;
    let newFontSize = defaultFontSize - (widthDiff / fontIncrementThreshold);
    if (newFontSize < minFontSize) {
      newFontSize = minFontSize;
    }

    this.sceneWrapperRef.current.style.fontSize = `${newFontSize}px`;
    this.forceUpdate();
  }

  getWrapperSize(isVertical = false) {
    let wrapper = this.sceneWrapperRef.current;
    if (wrapper) {
      return isVertical ? wrapper.clientHeight : wrapper.clientWidth;
    }
    return undefined;
  }

  getDraggingInteraction() {
    if (this.state.draggingInteractionIndex === null) {
      return false;
    }

    const interactions = this.props.sceneParams.interactions;
    return interactions[this.state.draggingInteractionIndex];
  }

  getMouseMovedPercentages(mouseEvent, isVertical = false) {
    let startPos = this.startX;
    let wrapperSize = this.getWrapperSize(isVertical);
    let mousePos = mouseEvent.clientX;

    if (isVertical) {
      startPos = this.startY;
      mousePos = mouseEvent.clientY;
    }

    return ((startPos - mousePos) / wrapperSize) * 100;
  }

  removePercentageDenotationFromPosition(position) {
    const lastChar = position.charAt(position.length - 1);
    if (lastChar !== '%') {
      return false;
    }

    return position.substr(0, position.length - 1);
  }

  getPositions(positions) {
    const pos = positions.split(',');
    return {
      x: pos[0],
      y: pos[1],
    };
  }

  getNewInteractionPosition(initialPos, mouseEvent, element, isVertical = false) {
    let position = initialPos.x;
    let mouseMoved = this.getMouseMovedPercentages(mouseEvent, isVertical);
    let wrapperSize = this.getWrapperSize(isVertical);

    if (isVertical) {
      position = initialPos.y;
    }

    position = this.removePercentageDenotationFromPosition(position);
    const movedTo = position - mouseMoved;

    if (movedTo < 0) {
      return 0;
    }

    const elementBounds = element.getBoundingClientRect();
    const elementSize = isVertical ? elementBounds.height : elementBounds.width;
    const elementSizePercentage = (elementSize / wrapperSize) * 100;
    const positionThreshold = 100 - elementSizePercentage;

    if (movedTo >= positionThreshold) {
      return positionThreshold;
    }

    return movedTo;
  }

  getNewInteractionPositions(mouseEvent) {
    const interaction = this.getDraggingInteraction();
    const initialPos = this.getPositions(interaction.interactionpos);

    const xPos = this.getNewInteractionPosition(
      initialPos,
      mouseEvent,
      this.state.draggingElement,
    );

    const yPos = this.getNewInteractionPosition(
      initialPos,
      mouseEvent,
      this.state.draggingElement,
      true,
    );

    return {
      x: xPos,
      y: yPos,
    };
  }

  startDragging(interactionIndex, e) {
    if (e.button !== 0) {
      return;
    }

    this.startX = e.clientX;
    this.startY = e.clientY;

    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('mouseup', this.stoppedDragging);

    this.setState({
      draggingInteractionIndex: interactionIndex,
      draggingElement: e.target,
      isDragDelayed: true,
    });

    // Small delay to not accidentally drag interactions when double clicking
    setTimeout(() => {
      this.setState({
        isDragDelayed: false,
      });
    }, 50);
  }

  onMove(e) {
    const isDragging = this.state.draggingInteractionIndex !== null;
    const isDragDelayed = this.state.isDragDelayed;
    if (!isDragging || isDragDelayed) {
      return;
    }
    this.setState(this.getNewInteractionPositions(e));
  }

  stoppedDragging() {
    if (this.state.draggingInteractionIndex === null) {
      return;
    }

    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('mouseup', this.stoppedDragging);

    // State has not been updated, most likely a double-click
    if (this.state.x === null || this.state.y === null) {
      this.setState({
        x: null,
        y: null,
        draggingInteractionIndex: null,
        draggingElement: null,
        isDragDelayed: true,
      });
      return;
    }

    const interaction = this.getDraggingInteraction();
    interaction.interactionpos = [
      this.state.x + '%',
      this.state.y + '%',
    ].join(',');

    this.setState({
      x: null,
      y: null,
      draggingInteractionIndex: null,
      draggingElement: null,
      isDragDelayed: true,
    });
  }

  goToPreviousScene() {
    if (this.props.sceneHistory.length > 0) {
      this.props.navigateToScene(SceneTypes.PREVIOUS_SCENE);
    }
  }

  onSceneLoaded() {
    const imageElement = this.imageElementRef.current;
    const ratio = imageElement.naturalWidth / imageElement.naturalHeight;
    this.setState({
      isVerticalImage: ratio < this.context.getRatio(),
    });
    imageElement.focus();

    this.context.on('resize', () => {
      this.setState({
        isVerticalImage: ratio < this.context.getRatio(),
      });
    });
  }

  // Since some interactions don't have titles this seeks to use the closest thing to a title to prevent "Untitled Text"
  getInteractionTitle(action) {
    const currentTitle = action.metadata.title;

    switch (currentTitle) {
      case 'Untitled Text':
        return action.params.text;
      case 'Untitled Image':
        return action.params.alt;
      default:
        return currentTitle;
    }
  }

  getAdjustedInteractionPositions(posX, posY) {
    const interactionEm = 2.5;
    const wrapper = this.sceneWrapperRef.current;
    const wrapperSize = wrapper.getBoundingClientRect();
    if (!wrapperSize.width || !wrapperSize.height) {
      return false;
    }
    const fontSize = parseFloat(wrapper.style.fontSize);
    const interactionSize = interactionEm * fontSize;
    const height = interactionSize / wrapperSize.height * 100;
    if (posY + height > 100) {
      posY = 100 - height;
    }

    const width = interactionSize / wrapperSize.width * 100;
    if (posX + width > 100) {
      posX = 100 - width;
    }

    return {
      posX: posX,
      posY: posY,
    };
  }

  render() {
    if (!this.props.isActive) {
      return null;
    }

    const interactions = this.props.sceneParams.interactions || [];

    const hasPreviousScene = this.props.sceneHistory.length > 0;
    const isShowingBackButton = this.props.sceneParams.showBackButton
      && (hasPreviousScene || this.context.extras.isEditor);

    const backButtonClasses = this.context.extras.isEditor
      && !hasPreviousScene
      ? ['disabled']
      : [];

    const imageSceneClasses = ['image-scene-wrapper'];
    if (this.state.isVerticalImage) {
      imageSceneClasses.push('vertical');
    }

    return (
      <div
        ref={this.overLayRef}
        className='image-scene-overlay'
        aria-hidden={this.props.isHiddenBehindOverlay ? true : undefined}
      >
        <div
          className={imageSceneClasses.join(' ')}
          ref={this.sceneWrapperRef}
        >
          <img
            tabIndex='-1'
            alt={this.props.sceneParams.scenename}
            className='image-scene'
            src={H5P.getPath(this.props.imageSrc.path, this.context.contentId)}
            onLoad={this.onSceneLoaded.bind(this)}
            ref={this.imageElementRef}
          />
          {
            interactions.map((interaction, index) => {
              const pos = this.getPositions(interaction.interactionpos);
              let posX = this.removePercentageDenotationFromPosition(pos.x);
              let posY = this.removePercentageDenotationFromPosition(pos.y);
              const hasUpdatedPositions = this.state.x !== null
                && this.state.y !== null
                && this.state.draggingInteractionIndex === index;
              if (hasUpdatedPositions) {
                posX = this.state.x;
                posY = this.state.y;
              }

              const buttonClasses = [];
              if (this.props.audioIsPlaying === 'interaction-' + this.props.sceneId + '-' + index) {
                buttonClasses.push('active');
              }

              if (this.state.draggingInteractionIndex === index) {
                buttonClasses.push('dragging');
              }

              if (posX > 91.5) {
                buttonClasses.push('left-aligned');
              }

              if (this.sceneWrapperRef && this.sceneWrapperRef.current) {
                // Adjust interaction position if overflowing
                const pos = this.getAdjustedInteractionPositions(
                  parseFloat(posX),
                  parseFloat(posY)
                );
                if (pos) {
                  posX = pos.posX;
                  posY = pos.posY;
                }
              }

              let title;

              const library = H5P.libraryFromString(interaction.action.library);
              const machineName = library.machineName;
              const isGoToSceneInteraction = machineName === 'H5P.GoToScene';
              const scenes = this.context.params.scenes;
              if (isGoToSceneInteraction) {
                const nextScene = scenes.find(scene => {
                  return scene.sceneId === interaction.action.params.nextSceneId;
                });
                title = nextScene.scenename;
              }
              else {
                title = this.getInteractionTitle(interaction.action);
              }

              return (
                <NavigationButton
                  key={index}
                  title={title}
                  icon={getIconFromInteraction(interaction, scenes)}
                  label={getLabelFromInteraction(interaction)}
                  type={'interaction-' + index}
                  isHiddenBehindOverlay={this.props.isHiddenBehindOverlay}
                  nextFocus={this.props.nextFocus}
                  topPosition={posY}
                  leftPosition={posX}
                  mouseDownHandler={this.startDragging.bind(this, index)}
                  clickHandler={this.props.showInteraction.bind(this, index)}
                  doubleClickHandler={() => {
                    this.context.trigger('doubleClickedInteraction', index);
                  }}
                  buttonClasses={buttonClasses}
                  onBlur={this.props.onBlurInteraction}
                  isFocused={this.props.focusedInteraction === index}
                  // Use the overlay height instead of getWrapperSize because
                  // That is not correct when moving to a new scene without resizing
                  wrapperHeight={this.overLayRef.current ? this.overLayRef.current.clientHeight : 0}
                  staticScene={true}
                  showAsHotspot={interaction.label.showAsHotspot}
                  sceneId = {this.props.sceneId}
                  interactionIndex = {index}
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
            })
          }
        </div>
        {
          isShowingBackButton &&
          <NavigationButton
            title='Back'
            icon={Icons.GO_BACK}
            isHiddenBehindOverlay={this.props.isHiddenBehindOverlay}
            clickHandler={this.goToPreviousScene.bind(this)}
            forceClickHandler={true}
            buttonClasses={backButtonClasses}
          />
        }
      </div>
    );
  }
}

StaticScene.contextType = H5PContext;
