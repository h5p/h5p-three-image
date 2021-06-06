// @ts-check

import React, { useCallback, useEffect, useRef } from "react";
import "./OpenContent.scss";
import { H5PContext } from "../../context/H5PContext";

/**
 * @typedef {{
 *  sceneId: number;
 *  interactionIndex: number;
 *  topPosition: number;
 *  leftPosition: number;
 *  staticScene: boolean;
 *  ariaLabel: string;
 *  doubleClickHandler: () => void;
 *  mouseDownHandler: (event: MouseEvent) => void;
 *  onFocus: () => void;
 *  onMount: (openContentWrapper: HTMLElement) => void;
 *  onUnmount: (openContentWrapper: HTMLElement) => void;
 *  onUpdate: (openContentWrapper: HTMLElement) => void;
 *  isFocused: boolean;
 *  onBlur: () => void;
 * }} Props
 */

export default class OpenContent extends React.Component {
  /**
   * @param {Props} props
   */
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.state = {
      anchorDrag: false,
      canDrag: false,
      camPosYaw: 0,
      camPosPitch: 0,
      startMousePos: 0,
      startMidPoint: 0,
      sizeWidth: 0,
      sizeHeight: 0,
      isFocused: this.props.isFocused,
    };

    this.openContent = React.createRef();
    this.openContentWrapper = React.createRef();
  }

  addFocusListener() {
    if (this.openContentWrapper) {
      this.openContentWrapper.current.addEventListener('focus', this.onFocus);
    }
  }

  /**
   * @param {FocusEvent} event 
   */
   onFocus(event) {
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

  /**
   * @param {FocusEvent} event 
   */
   onBlur(event) {
    const openContentWrapper = this.openContentWrapper
      && this.openContentWrapper.current;

    if (openContentWrapper && openContentWrapper.contains(event.relatedTarget)) {
      // Clicked target is child of button wrapper and not the expandButton, don't blur
      this.setFocus();
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
    const [sizeWidth, sizeHeight] = this.getHotspotValues();
    this.setState({
      sizeWidth,
      sizeHeight,
    });

    if (this.props.onMount) {
      // Let parent know this element should be added to the THREE world.
      this.props.onMount(this.openContentWrapper.current);
    }

    this.addFocusListener();
    if (this.state.isFocused) {
      setTimeout(() => {
        this.setFocus();
      }, 0);
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      const el = this.openContentWrapper.current;
      // We want this to run after the component is removed
      setTimeout(() => {
        // Let parent know this element should be remove from the THREE world.
        this.props.onUnmount(el);
      }, 0);
    }
  }

  componentDidUpdate() {
    if (this.props.onUpdate) {
      // Let parent know this element is updated. (Position might have changed.)
      this.props.onUpdate(this.openContentWrapper.current);
    }
  }

  getHotspotValues() {
    const scene = this.context.params.scenes.find((scene) => {
      return scene.sceneId === this.props.sceneId;
    });
    const interaction = scene.interactions[this.props.interactionIndex];

    return interaction.label.hotSpotSizeValues
      ? interaction.label.hotSpotSizeValues.split(",")
      : [256, 128];
  }

  /**
   * @param {number} widthX
   * @param {number} heightY
   */
  setHotspotValues(widthX, heightY) {
    const scene = this.context.params.scenes.find(
      (/** @type {Scene} */ scene) => scene.sceneId === this.props.sceneId
    );
    const interaction = scene.interactions[this.props.interactionIndex];
    interaction.label.hotSpotSizeValues = widthX + "," + heightY;
  }
  toggleDrag = (e) => {
    const dragBool = !this.state.canDrag;
    this.setState({
      canDrag: dragBool,
    });
    if (!this.props.staticScene) {
      //If we cant drag anymore, we start the rendering of the threesixty scene,
      // we also set the camera position that is stored wen we start the hotspot scaling
      if (!this.state.canDrag) {
        this.context.threeSixty.startRendering();
        this.context.threeSixty.setCameraPosition(
          this.state.camPosYaw,
          this.state.camPosPitch
        );
      } else {
        //We store the current position, because we are technically still dragging the background around here
        this.setState({
          camPosYaw: this.context.threeSixty.getCurrentPosition().yaw,
          camPosPitch: this.context.threeSixty.getCurrentPosition().pitch,
        });
        //We stop rendering the threesixty scene so it doesnt look like we are moving around
        this.context.threeSixty.stopRendering();
      }
    }
  };

  onAnchorDragMouseDown = (e, horizontalDrag) => {
    /*Based on the direction, we store the X or Y start position of the mouse,
     and finds the center of the div, startMidPoint, which is needed for scaling from*/
    this.setState({
      anchorDrag: true,
      startMousePos: horizontalDrag ? e.clientX : e.clientY,
      startMidPoint: horizontalDrag
        ? this.state.sizeWidth / 2
        : this.state.sizeHeight / 2,
    });
  };
  onMouseMove = (event, horizontalDrag) => {
    //We record the currentMouseposition for everytime the mouse moves
    const currentPosMouse = horizontalDrag ? event.clientX : event.clientY;

    /*divStartWidth is the start mouse position subtracted by the midpoint, technically this
    half the size of the actual div, this is used for keeping the original widtrh of the div
    everytime we drag */
    const divStartWidth = this.state.startMousePos - this.state.startMidPoint;

    /* The final width is calculated by subtracting the position of the
    mouse with the the divStartWidth, this is technically the offset between the
    divStartWidth and the current mouse position. Since the div scales from the center,
    we have to multiply the result by two*/

    let finalValue = (currentPosMouse - divStartWidth) * 2;
    if (finalValue > 64 && finalValue < 512) {
      /*These values are used for inline styling in the div in the render loop,
        updating the div dimensions when the mousemove event fires*/
      horizontalDrag
        ? this.setState({
            sizeWidth: finalValue,
          })
        : this.setState({
            sizeHeight: finalValue,
          });
    }
  };

  onAnchorDragMouseUp = (e, horizontalDrag) => {
    let newSizeWidth = this.state.sizeWidth;
    let newSizeHeight = this.state.sizeHeight;

    this.setState({
      anchorDrag: false,
    });
    //Used for writing the data into to editor, for them to persist into the viewer
    this.setHotspotValues(newSizeWidth, newSizeHeight);
  };

  getStyle() {
    const style = {};
    if (this.props.topPosition !== undefined) {
      style.top = this.props.topPosition + "%";
    }

    if (this.props.leftPosition !== undefined) {
      style.left = this.props.leftPosition + "%";
    }
    return style;
  }

  getContentFromInteraction() {
    const scene = this.context.params.scenes.find((scene) => {
      return scene.sceneId === this.props.sceneId;
    });
    const interaction = scene.interactions[this.props.interactionIndex];
    const library = interaction.action.library;
    const machineName = H5P.libraryFromString(library).machineName;
    if (machineName === "H5P.AdvancedText") {
      return interaction.action.params.text;
    } else if (machineName === "H5P.Image") {
      const imgSrc = H5P.getPath(
        interaction.action.params.file.path,
        this.context.contentId
      );
      const image = `<img src=${imgSrc} alt=${interaction.action.params.alt}/>`;
      return image;
    } else {
      return "";
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

  render() {
    let wrapperClasses = ["open-content-wrapper"];

    if (this.state.isMouseOver) {
      wrapperClasses.push("hover");
    }

    // only apply custom focus if we have children that are shown on focus
    if (this.state.isFocused && this.props.children) {
      wrapperClasses.push("focused");
    }

    // Add classname to current active element (wrapper, button or expand label button) so it can be shown on top
    if (this.state.isFocused && this.props.children)
    {
      wrapperClasses.push("active-element");
    }

    const DragButton = (innerProps) => {
      const hotspotBtnRef = useRef(null);

      const mouseMoveHandler = (e) => {
        this.onMouseMove(e, innerProps.horizontalDrag);
      };
      //Here we add a mouseup listener on the document so the user can release the mouse on anything on the document
      const handleMouseDown = useCallback((e) => {
        this.onAnchorDragMouseDown(e, innerProps.horizontalDrag);
        this.toggleDrag();
        document.addEventListener("mousemove", mouseMoveHandler);

        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            this.toggleDrag();
            this.onAnchorDragMouseUp(e, innerProps.horizontalDrag);
          },
          { once: true }
        );
      }, []);

      useEffect(() => {
        /*In order to take control of the mousedown listener, we have to it when the component mount,
       the reason for this is that we have to stop the propagation early on, since mousedown is already listened to by threesixty */
        hotspotBtnRef.current.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          handleMouseDown(e);
        });
      }, []);

      return (
        <button
          className={
            innerProps.horizontalDrag
              ? "drag drag--horizontal"
              : "drag drag--vertical"
          }
          tabIndex={innerProps.tabIndex}
          ref={hotspotBtnRef}
          aria-label={
            innerProps.horizontalDrag
              ? this.context.l10n.hotspotDragHorizAlt
              : this.context.l10n.hotspotDragVertiAlt
          }
        />
      );
    };

    return (
      <div
        ref={this.openContentWrapper}
        className={wrapperClasses.join(" ")}
        style={this.getStyle()}
        tabIndex={0}
        onFocus={this.handleFocus}
        onBlur={this.onBlur.bind(this)}
      >
        <div 
          className={`open-content ${
            this.context.extras.isEditor ? "open-content--editor" : ""
          }`}
          ref={this.openContent}
          aria-label={this.props.ariaLabel}
          style={{
            width: this.state.sizeWidth + "px",
            height: this.state.sizeHeight + "px",
          }}
          onDoubleClick={this.onDoubleClick.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.setFocus.bind(this)}
        >
          <div
            className={"inner-content"}
            dangerouslySetInnerHTML={{
              __html: this.getContentFromInteraction(),
            }}
          />
          {this.context.extras.isEditor ? (
            <>
              <DragButton 
                horizontalDrag={true}
                tabIndex={-1}
              />
              <DragButton 
                horizontalDrag={false} 
                tabIndex={-1} 
              />
            </>
          ) : (
            ""
          )}
        </div>

        {this.props.children}
      </div>
    );
  }
}
OpenContent.contextType = H5PContext;
