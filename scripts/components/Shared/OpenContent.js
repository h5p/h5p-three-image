import React, {useCallback, useEffect, useRef} from 'react';
import './OpenContent.scss';
import {H5PContext} from "../../context/H5PContext";

export const Icons = {
  INFO: 'h5p-info-button h5p-interaction-button',
  QUESTION: 'h5p-question-button h5p-interaction-button',
  GO_TO_SCENE: 'h5p-go-to-scene-button',
  GO_BACK: 'h5p-go-back-button',
  SCENE_DESCRIPTION: 'h5p-scene-description-button',
  AUDIO: 'h5p-audio-button',
  VIDEO: 'h5p-video-button',
  IMAGE: 'h5p-image-button h5p-interaction-button',
  INFO_MARK: 'h5p-info-mark-button h5p-interaction-button',
  LOCK: 'h5p-locked-button h5p-interaction-button',
  UNLOCK: 'h5p-unlocked-button h5p-interaction-button',
};

const infoInteractions = [
  "H5P.AdvancedText",
  "H5P.Image",
  "H5P.Video",
];

const isInfoInteraction = (machineName) => {
  return infoInteractions.includes(machineName);
};




export const getLabelFromInteraction = (interaction) => {
  return interaction.label;
};

export default class OpenContent extends React.Component {
  constructor(props) {
    super(props);

    this.openContentWrapper = React.createRef();
    this.navButton = React.createRef();
    this.expandButton = React.createRef();
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.state = {
      isFocused: this.props.isFocused,
      expandButtonFocused: false,
      innerButtonFocused: false,

      anchorDrag : false,
      canDrag : false,
      camPosYaw : 0,
      camPosPitch : 0,
      startMousePos : 0,
      startMidPoint : 0,
      sizeWidth : 0,
      sizeHeight : 0
    };
  }

  addFocusListener() {
    if (this.openContentWrapper) {
      this.openContentWrapper.current.addEventListener('focus', this.onFocus);
    }
  }

  onFocus() {
    // Already focused
    if (this.state.isFocused) {
      this.openContentWrapper.current.addEventListener('blur', this.onBlur);
      return;
    }

    this.setState({
      isFocused: true,
    });
    if (this.props.onFocusedInteraction) {
      this.props.onFocusedInteraction();
    }

    this.openContentWrapper.current.addEventListener('blur', this.onBlur);
  }

  onBlur(e) {
    const navButtonWrapper = this.openContentWrapper
      && this.openContentWrapper.current;

    if (navButtonWrapper && navButtonWrapper.contains(e.relatedTarget) && (!this.expandButton || e.relatedTarget !== this.expandButton.current)) {
      // Clicked target is child of button wrapper and not the expandButton, don't blur
      this.openContentWrapper.current.focus({
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

    if (this.openContentWrapper && this.openContentWrapper.current) {
      this.openContentWrapper.current.removeEventListener('blur', this.onBlur);
    }
  }

  componentDidMount() {
    if (this.props.onMount) {
      // Let parent know this element should be added to the THREE world.
      this.props.onMount(this.openContentWrapper.current);
    }

    this.addFocusListener();
    if (this.state.isFocused) {
      setTimeout(() => {
        this.openContentWrapper.current.focus({
          preventScroll: true
        });
      }, 0);
    }

    const hotspotValues = this.getHotspotValues();
    this.setState({
      sizeWidth : hotspotValues[0],
      sizeHeight : hotspotValues[1]
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.type && this.props.type === this.props.nextFocus && prevProps.nextFocus !== this.props.nextFocus) {
      this.skipFocus = true; // Prevent moving camera on next focus (makes for a better UX when using the mouse)
      this.openContentWrapper.current.focus({
        preventScroll: true
      });
    }

    if (this.props.isFocused && !prevProps.isFocused) {
      setTimeout(() => { // Note: Don't think the timeout is needed after rendering was fixed
        this.openContentWrapper.current.focus({
          preventScroll: true
        });
      }, 0);
    }

    if (this.props.onUpdate) {
      // Let parent know this element is updated. (Position might have changed.)
      this.props.onUpdate(this.openContentWrapper.current);
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
    if (this.openContentWrapper) {
      this.openContentWrapper.current.addEventListener('blur', this.onBlur);
      this.openContentWrapper.current.removeEventListener('focus', this.onFocus);
    }

    if (this.props.onUnmount) {
      const el = this.openContentWrapper.current;
      // We want this to run after the component is removed
      setTimeout(() => {
        // Let parent know this element should be remove from the THREE world.
        this.props.onUnmount(el);
      }, 0);
    }
  }

  toggleDrag = (e) => {


    const dragBool = !this.state.canDrag
    this.setState({
      canDrag: dragBool
    })
    if (!this.props.staticScene){
      //If we cant drag anymore, we start the rendering of the threesixty scene,
      // we also set the camera position that is stored wen we start the hotspot scaling
      if(!this.state.canDrag) {
        this.context.threeSixty.startRendering()
        this.context.threeSixty.setCameraPosition(this.state.camPosYaw, this.state.camPosPitch)
      } else {

        //We store the current position, because we are technically still dragging the background around here
        this.setState({
          camPosYaw : this.context.threeSixty.getCurrentPosition().yaw,
          camPosPitch : this.context.threeSixty.getCurrentPosition().pitch
        })
        //We stop rendering the threesixty scene so it doesnt look like we are moving around
        this.context.threeSixty.stopRendering()
      }
    }
  }

  onAnchorDragMouseDown = (e, horizontalDrag) => {

    /*Based on the direction, we store the X or Y start position of the mouse,
     and finds the center of the div, startMidPoint, which is needed for scaling from*/
    this.setState({
      anchorDrag: true,
      startMousePos : horizontalDrag ? e.clientX : e.clientY,
      startMidPoint : horizontalDrag ? this.state.sizeWidth / 2 : this.state.sizeHeight / 2
    })

  }
  onMouseMove = (event, horizontalDrag) => {

    //We record the currentMouseposition for everytime the mouse moves
    const currentPosMouse = horizontalDrag ? event.clientX : event.clientY

    /*divStartWidth is the start mouse position subtracted by the midpoint, technically this
    half the size of the actual div, this is used for keeping the original widtrh of the div
    everytime we drag */
    const divStartWidth = this.state.startMousePos - (this.state.startMidPoint)

    /* The final width is calculated by subtracting the position of the
    mouse with the the divStartWidth, this is technically the offset between the
    divStartWidth and the current mouse position. Since the div scales from the center,
    we have to multiply the result by two*/

    let finalValue = ((currentPosMouse - divStartWidth) * 2);
    if(finalValue > 64 && finalValue < 512) {
      /*These values are used for inline styling in the div in the render loop,
        updating the div dimensions when the mousemove event fires*/
      horizontalDrag ?
        this.setState({
          sizeWidth: finalValue
        })
        :
        this.setState({
          sizeHeight: finalValue
        })
    }
  }

  onAnchorDragMouseUp = (e, horizontalDrag) => {
    let newSizeWidth = this.state.sizeWidth
    let newSizeHeight = this.state.sizeHeight

    this.setState({
      anchorDrag: false,
    })
//Used for writing the data into to editor, for them to persist into the viewer
    this.setHotspotValues(newSizeWidth, newSizeHeight)
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
      && this.openContentWrapper
      && this.openContentWrapper.current;
    if (isFocusable) {
      this.openContentWrapper.current.focus({
        preventScroll: true
      });
    }
  }

  handleFocus = (e) => {
    if (this.context.extras.isEditor) {
      if (this.openContentWrapper && this.openContentWrapper.current && this.openContentWrapper === e.target) {
        this.openContentWrapper.current.focus({
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
  setHotspotValues(widthX, heightY) {
    const scene = this.context.params.scenes.find(scene => {
      return scene.sceneId === this.props.sceneId;
    });
    const interaction = scene.interactions[this.props.interactionIndex];
    interaction.label.hotSpotSizeValues = widthX + "," + heightY;
  }

  getHotspotValues() {
    const scene = this.context.params.scenes.find(scene => {
      return scene.sceneId === this.props.sceneId;
    });
    const interaction = scene.interactions[this.props.interactionIndex];

    return interaction.label.hotSpotSizeValues ?
      interaction.label.hotSpotSizeValues.split(",") : [128,128]
  }

  getContentFromInteraction() {
    const scene = this.context.params.scenes.find(scene => {
      return scene.sceneId === this.props.sceneId;
    });
    const interaction = scene.interactions[this.props.interactionIndex];
    const library = interaction.action.library;
    const machineName = H5P.libraryFromString(library).machineName;
    if (machineName === 'H5P.AdvancedText') {
      return interaction.action.params.text
    } else if (machineName === 'H5P.Image') {
      const imgSrc = H5P.getPath(interaction.action.params.file.path, this.context.contentId);
      const image = `<img src=${imgSrc} alt=${interaction.action.params.alt}/>`
      return image;
    }

    else {
      return "";

    }
  };


  render() {
    let wrapperClasses = [
      'open-content-wrapper',
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

    let label = {};

    if (this.props.label) {
      label = this.props.label;
    }
    else {
      label = {
        "labelPosition": "inherit",
        "showLabel": "inherit"
      };
    }

    const DragButton = (innerProps) => {
      const hotspotBtnRef = useRef(null);

      const mouseMoveHandler = (e) => {
        this.onMouseMove(e, innerProps.horizontalDrag)
      }
      //Here we add a mouseup listener on the document so the user can release the mouse on anything on the document
      const handleMouseDown = useCallback(e => {
        this.onAnchorDragMouseDown(e, innerProps.horizontalDrag)
        this.toggleDrag()
        document.addEventListener("mousemove", mouseMoveHandler)

        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove",  mouseMoveHandler)
            this.toggleDrag()
            this.onAnchorDragMouseUp(e, innerProps.horizontalDrag)
          },
          { once: true }
        );
      }, []);

      useEffect(() => {
        /*In order to take control of the mousedown listener, we have to it when the component mount,
       the reason for this is that we have to stop the propagation early on, since mousedown is already listened to by threesixty */
        hotspotBtnRef.current.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          handleMouseDown(e)
        })

      }, []);


      return(
        <button className={innerProps.horizontalDrag ? "drag drag--horizontal" : "drag drag--vertical"}
                ref={hotspotBtnRef}
                tabIndex={this.props.tabIndexValue}
                aria-label={innerProps.horizontalDrag ? this.context.l10n.hotspotDragHorizAlt : this.context.l10n.hotspotDragVertiAlt}
        />
      )}

    return (

      <div
        ref={this.openContentWrapper}
        className={wrapperClasses.join(' ')}
        style={this.getStyle()}
        tabIndex={isWrapperTabbable ? '0' : undefined}
        onFocus={this.handleFocus}
      >

        <div
          className={
            `open-content ${this.context.extras.isEditor ? "open-content--editor" : ''}
             
             `}
          ref={this.props.reference}
          aria-label={this.props.ariaLabel}
          style={{width: this.state.sizeWidth + 'px', height : this.state.sizeHeight + 'px'}}
          tabIndex={this.props.tabIndexValue}
          onDoubleClick={this.onDoubleClick.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.setFocus.bind(this)}
          onFocus={() => this.setState({innerButtonFocused: true})}
          onBlur={() => this.setState({innerButtonFocused: false})}>
          <div className={"inner-content"} dangerouslySetInnerHTML={{__html: this.getContentFromInteraction()}}/>
          {
            this.context.extras.isEditor ? <>
                <DragButton horizontalDrag = {true}/>
                <DragButton horizontalDrag = {false}/>
              </>
              : ""
          }

        </div>


        {this.props.children}

      </div>
    );
  }
}
OpenContent.contextType = H5PContext;
