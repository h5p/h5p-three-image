import React, {useCallback, useEffect, useRef} from 'react';
import './NavigationButton.scss';
import { H5PContext } from "../../context/H5PContext";

export default class HotspotNavButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorDrag : false,
      canDrag : false,
      camPosYaw : 0,
      camPosPitch : 0,
      startMousePos : 0,
      startMidPoint : 0,
      sizeWidth : 0,
      sizeHeight : 0
    }
  }

  componentDidMount() {
    const hotspotValues = this.props.getHotspotValues();

    this.setState({
      sizeWidth : hotspotValues[0],
      sizeHeight : hotspotValues[1]
    })
  }

  toggleDrag = (e) => {

    if(this.state.canDrag) {

      this.context.threeSixty.startRendering()
      this.context.threeSixty.setCameraPosition(this.state.camPosYaw, this.state.camPosPitch)
    } else {

      this.setState({
        camPosYaw : this.context.threeSixty.getCurrentPosition().yaw,
        camPosPitch : this.context.threeSixty.getCurrentPosition().pitch
      })

      this.context.threeSixty.stopRendering()
    }

    const dragBool = !this.state.canDrag
    this.setState({
      canDrag: dragBool
    })


  }
  onAnchorDragMouseDown = (e, horizontalDrag) => {

    this.setState({
      anchorDrag: true,
      startMousePos : horizontalDrag ? e.clientX : e.clientY,
      startMidPoint : horizontalDrag ? this.state.sizeWidth / 2 : this.state.sizeHeight / 2
    })

  }
  onMouseMove = (event, horizontalDrag) => {

    const currentPosMouse = horizontalDrag ? event.clientX : event.clientY
    const midPoint = this.state.startMousePos - (this.state.startMidPoint)
    let finalValue = ((currentPosMouse - midPoint) * 2);
    if(finalValue > 32 && finalValue < 512) {
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

    this.props.setHotspotValues(newSizeWidth, newSizeHeight)
  }

  render() {

    const DragButton = (innerProps) => {
      const hotspotBtnRef = useRef(null);

      const mouseMoveHandler = (e) => {
        this.onMouseMove(e, innerProps.horizontalDrag)
      }
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
        hotspotBtnRef.current.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          handleMouseDown(e)
        })

      }, []);


      return(
        <button className={innerProps.horizontalDrag ? "drag drag--horizontal" : "drag drag--vertical"}
                ref={hotspotBtnRef}
                tabIndex={this.props.tabIndexValue}
                aria-label={innerProps.horizontalDrag ? "Drag horizontally to scale hotspot" : "Drag vertically to scale hotspot"}
        />
      )}

    return (
      <div className={"nav-button-hotspot-wrapper"}>
        <button
          ref={this.props.reference}
          aria-label={this.props.ariaLabel}
          style={{width: this.state.sizeWidth + 'px', height : this.state.sizeHeight + 'px'}}
          className={ `nav-button ${this.context.extras.isEditor ? "nav-button-hotspot nav-button-hotspot--editor" : 'nav-button-hotspot'}`}
          tabIndex={this.props.tabIndexValue}
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
