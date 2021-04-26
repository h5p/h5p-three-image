import React, {useCallback, useEffect, useRef} from 'react';
import './NavigationButton.scss';
import { H5PContext } from "../../context/H5PContext";

export default class ActiveFieldNavButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorDrag : false,
      canDrag : false,
      camPosYaw : 0,
      camPosPitch : 0,
      startMousePosX : 0,
      startMidPoint : 0,
      sizeX : 0
    }
  }

  componentDidMount() {
    const activeFieldValues = this.props.getActiveFieldValues();
    console.log(activeFieldValues)

    this.setState({
      sizeX : activeFieldValues[0]
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
  onAnchorDragMouseDown = (e) => {
    this.setState({
      anchorDrag: true,
      startMousePosX : e.clientX,
      startMidPoint : this.state.sizeX / 2
    })

  }
  onMouseMove = (currentPosMouseX) => {
    const midPoint = this.state.startMousePosX - (this.state.startMidPoint)
    let finalX = ((currentPosMouseX - midPoint) * 2);
    if(finalX > 32 && finalX < 512) {
      this.setState({
        sizeX : finalX
      })
    }
  }

  onAnchorDragMouseUp = (e) => {
    const newSizeWidth = this.state.sizeX
    console.log(newSizeWidth)
    this.setState({
      anchorDrag: false,
    })
    this.props.setActiveFieldValues(newSizeWidth)
  }

  render() {

    const DragButton = () => {
      const activeFieldBtnRef = useRef(null);

      const mouseMoveHandler = (e) => {
        this.onMouseMove(e.clientX)
      }

      const handleMouseDown = useCallback(e => {
        this.onAnchorDragMouseDown(e)
        this.toggleDrag()
        document.addEventListener("mousemove", mouseMoveHandler)

        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove",  mouseMoveHandler)
            this.toggleDrag()
            this.onAnchorDragMouseUp(e)
          },
          { once: true }
        );
      }, []);

      useEffect(() => {
        activeFieldBtnRef.current.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          handleMouseDown(e)
        })

      }, []);


      return(
        <button className={"drag"} ref={activeFieldBtnRef}
        />)
    }
    return (
      <div className={"nav-button-active-field-wrapper"}>
        <button
          ref={this.props.reference}
          aria-label={this.props.ariaLabel}
          style={{width: this.state.sizeX + 'px'}}
          className={ `nav-button ${this.context.extras.isEditor ? "nav-button-active-field nav-button-active-field--editor" : 'nav-button-active-field'}`}
          tabIndex={this.props.tabIndexValue}
          onClick={this.props.onClickEvent}
          onDoubleClick={this.props.onDoubleClickEvent}
          onMouseDown={ this.props.onMouseDownEvent}
          onMouseUp={this.props.onMouseUpEvent}
          onFocus={this.props.onFocusEvent}
          onBlur={this.props.onBlurEvent}
        />
        {
          this.context.extras.isEditor ? <DragButton/>
 : ""
        }
      </div>
    );
  }
}
ActiveFieldNavButton.contextType = H5PContext;
