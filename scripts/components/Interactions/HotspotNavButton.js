// @ts-check

import React, {useCallback, useEffect, useRef} from 'react';
import './NavigationButton.scss';
import { H5PContext } from "../../context/H5PContext";
import { scaleOpenContentElement } from '../../utils/open-content-utils';

/**
 * @typedef {{
 *   isHotspotTabbable: boolean;
 *   setHotspotValues: (newWidth: number, newHeight: number) => void;
 *   tabIndexValue: number;
 *   reference: React.RefObject;
 *   staticScene: boolean;
 *   ariaLabel: string;
 *   showHotspotOnHover: boolean;
 *   onClickEvent: React.MouseEventHandler;
 *   onDoubleClickEvent: React.MouseEventHandler;
 *   onMouseDownEvent: React.MouseEventHandler;
 *   onMouseUpEvent: React.MouseEventHandler;
 *   onFocusEvent: React.FocusEventHandler;
 *   onBlurEvent: React.FocusEventHandler;
 *   getHotspotValues: () => [number, number];
 * }} Props
 */

/**
 * @typedef {{
 *   anchorDrag: boolean;
 *   canDrag: boolean;
 *   camPosYaw: number;
 *   camPosPitch: number;
 *   startMousePos: number;
 *   startMidPoint: number;
 *   sizeWidth: number;
 *   sizeHeight: number;
 *   elementRect: DOMRect | null;
 * }} State
 */

/**
 * @extends {React.Component<Props, State>}
 */
export default class HotspotNavButton extends React.Component {
  /** @param {Props} props */
  constructor(props) {
    super(props);

    /** @type {State} */
    this.state = {
      anchorDrag : false,
      canDrag : false,
      camPosYaw : 0,
      camPosPitch : 0,
      startMousePos : 0,
      startMidPoint : 0,
      sizeWidth : 0,
      sizeHeight : 0,
      elementRect: null,
    }
  }

  componentDidMount() {
    const [sizeWidth, sizeHeight] = this.props.getHotspotValues();

    this.setState({
      sizeWidth,
      sizeHeight,
    })
  }

  toggleDrag = () => {
    const canDrag = this.state.canDrag
    this.setState({
      canDrag: !canDrag
    })

    if (!this.props.staticScene) {
      //If we cant drag anymore, we start the rendering of the threesixty scene,
      // we also set the camera position that is stored wen we start the hotspot scaling
      if (canDrag) { 
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
      startMidPoint : horizontalDrag ? this.state.sizeWidth / 2 : this.state.sizeHeight / 2,
      elementRect: this.props.reference.current?.getBoundingClientRect() ?? null,
    });
  }

  /**
   * 
   * @param {React.MouseEvent} event 
   * @param {boolean} isHorizontalDrag 
   */
   onMouseMove = (event, isHorizontalDrag) => {    
    const { clientX, clientY } = event;
    const newSize = scaleOpenContentElement(
      clientX,
      clientY,
      !this.props.staticScene,
      isHorizontalDrag,
      this.state.elementRect,
      this.state.startMousePos,
      this.state.startMidPoint
    );

    const minimumSize = 20;
    const maximumSize = 2000;

    const newSizeIsValid = newSize > minimumSize && newSize < maximumSize;
    if (newSizeIsValid) {
      /*These values are used for inline styling in the div in the render loop,
        updating the div dimensions when the mousemove event fires*/
      isHorizontalDrag
        ? this.setState({
            sizeWidth: newSize,
          })
        : this.setState({
            sizeHeight: newSize,
          });
    }
  };

  onAnchorDragMouseUp = () => {
    let newSizeWidth = this.state.sizeWidth
    let newSizeHeight = this.state.sizeHeight

    this.setState({
      anchorDrag: false,
    })
//Used for writing the data into to editor, for them to persist into the viewer
    this.props.setHotspotValues(newSizeWidth, newSizeHeight)
  }

  determineTabIndex = () => {
    return this.context.extras.isEditor || this.props.isHotspotTabbable ? this.props.tabIndexValue : -1
  }

  render() {
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
            this.onAnchorDragMouseUp()
          },
          { once: true }
        );
      }, []);

      useEffect(() => {
        /*In order to take control of the mousedown listener, we have to it when the component mount,
       the reason for trhis is that we have to stop the propagation early on, since mousedown is already listened to by threesixty */
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
      <div className={`nav-button-hotspot-wrapper ${this.props.staticScene ? 'nav-button-hotspot-wrapper--is-static' : ''} `}>
        <button
          ref={this.props.reference}
          aria-label={this.props.ariaLabel}
          style={{width: this.state.sizeWidth + 'px', height : this.state.sizeHeight + 'px'}}
          className={ `nav-button nav-button-hotspot ${this.props.showHotspotOnHover ? "nav-button-hotspot--show-hotspot-on-hover" : ""} ${this.context.extras.isEditor ? "nav-button-hotspot--editor" : ''} `}
          tabIndex={this.determineTabIndex()}
          onClick={this.props.onClickEvent}
          onDoubleClick={this.props.onDoubleClickEvent}
          onMouseDown={ this.props.onMouseDownEvent}
          onMouseUp={this.props.onMouseUpEvent}
          onFocus={this.props.onFocusEvent}
          onBlur={this.props.onBlurEvent}
        />
        {
          this.context.extras.isEditor ? <>
              <DragButton horizontalDrag = {true}/>
              <DragButton horizontalDrag = {false}/>
            </>
            : ""
        }
      </div>
    );
  }
}
HotspotNavButton.contextType = H5PContext;
