import React from 'react';
import ReactDOM from 'react-dom';
import NavigationButton from "../../Shared/NavigationButton";
import {H5PContext} from '../../../context/H5PContext';

export default class ThreeSixtyScene extends React.Component {
  constructor(props) {
    super(props);

    this.sceneRef = React.createRef();

    this.state = {
      hasInitialized: false,
    };
  }

  initializeScene() {
    var imageElement = document.createElement('img');
    imageElement.addEventListener('load', () => {
      this.scene = new H5P.ThreeSixty(imageElement, 16 / 9);

      if (this.props.isActive) {
        this.sceneRef.current.appendChild(this.scene.getElement());
        if (this.props.forceStartCamera) {
          this.scene.setStartCamera(this.props.forceStartCamera);
        }
        this.scene.resize();
        this.scene.startRendering();
      }

      this.scene.on('movestop', e => {
        this.context.trigger('movestop', e.data);
      });

      this.setState({
        hasInitialized: true,
      });

      this.props.addScene(this.scene);

      // Add buttons to scene
      this.addInteractionHotspots(this.props.sceneParams.interactions);
    });
    imageElement.src = this.props.imageSrc;
  }

  addInteractionHotspots(interactions) {
    if (!interactions) {
      return;
    }

    interactions.forEach((interaction, index) => {
      const pos = interaction.interactionpos.split(',');
      const yaw = pos[0];
      const pitch = pos[1];
      this.addInteractionButtonToScene(yaw, pitch, index);
    });
  }

  addInteractionButtonToScene(yaw, pitch, index) {
    const interactionButtonWrapper = document.createElement('div');

    // TODO:  Different libraries should be displayed with different navigation
    //        button icons. NavigationButton component should be able to handle
    //        this.

    ReactDOM.render(
      <H5PContext.Provider value={this.context}>
        <NavigationButton
          clickHandler={this.props.showInteraction.bind(this, index)}
          doubleClickHandler={() => {
            this.context.trigger('doubleClickedInteraction', index);
          }}
        />
      </H5PContext.Provider>,
      interactionButtonWrapper
    );

    this.scene.add(
      interactionButtonWrapper,
      {yaw: yaw, pitch: pitch},
      this.context.extras.isEditor
    );
  }

  componentDidMount() {
    // Already initialized
    if (this.state.isInitialized) {
      return;
    }

    this.initializeScene();
  }

  componentDidUpdate(prevProps) {
    // Check if active state was transitioned
    if (prevProps.isActive === this.props.isActive) {
      return;
    }

    // Remove any lingering elements
    if (this.sceneRef.current) {
      while (this.sceneRef.current.firstChild) {
        this.sceneRef.current.removeChild(this.sceneRef.current.firstChild);
      }
    }

    // Toggle activity for scene
    if (this.props.isActive) {
      this.sceneRef.current.appendChild(this.scene.element);
      this.scene.resize();
      this.scene.startRendering();

    }
    else {
      this.scene.stopRendering();
    }
  }

  render() {
    if (!this.props.isActive) {
      return null;
    }

    return (
      <div ref={this.sceneRef}/>
    );
  }
}
ThreeSixtyScene.contextType = H5PContext;
