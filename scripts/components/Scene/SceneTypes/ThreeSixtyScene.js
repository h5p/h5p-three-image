import React from 'react';
import ReactDOM from 'react-dom';
import NavigationButton, {getIconFromInteraction} from "../../Shared/NavigationButton";
import {H5PContext} from '../../../context/H5PContext';

export default class ThreeSixtyScene extends React.Component {
  constructor(props) {
    super(props);

    this.sceneRef = React.createRef();
    this.renderedInteractions = 0;
    this.initializeScene = this.initializeScene.bind(this);

    this.state = {
      hasInitialized: false,
    };
  }

  initializeScene() {
    const startPosition = this.props.sceneParams.cameraStartPosition
      .split(',')
      .map(parseFloat);

    const yaw = startPosition[0];
    const pitch = startPosition[1];

    this.scene = new H5P.ThreeSixty(this.imageElement, {
      ratio: 16/9,
      cameraStartPosition: {
        yaw: -yaw,
        pitch: pitch,
      },
    }, () => {
      // Determine if image source has changed
      const hasChangedImage = this.props.imageSrc
        !== this.imageElement.src;

      if (hasChangedImage) {
        this.imageElement.src = this.props.imageSrc;
      }

      return hasChangedImage;
    });

    if (this.props.isActive) {
      this.sceneRef.current.appendChild(this.scene.getElement());
      this.scene.resize();
      this.scene.startRendering();
    }

    this.scene.on('movestop', e => {
      this.context.trigger('movestop', e.data);
    });

    this.props.addScene(this.scene, this.props.id);

    // Add buttons to scene
    this.addInteractionHotspots(this.props.sceneParams.interactions);

    this.setState({
      hasInitialized: true,
    });
    this.imageElement.removeEventListener('load', this.initializeScene);
  }

  loadScene() {
    this.imageElement = document.createElement('img');
    this.imageElement.addEventListener('load', this.initializeScene);
    this.imageElement.src = this.props.imageSrc;
  }

  addInteractionHotspots(interactions) {
    if (!interactions) {
      return;
    }
    this.renderedInteractions = 0;

    interactions.forEach((interaction, index) => {
      const pos = interaction.interactionpos.split(',');
      const yaw = pos[0];
      const pitch = pos[1];
      this.addInteractionButtonToScene(yaw, pitch, index, interaction);
      this.renderedInteractions += 1;
    });
  }

  addInteractionButtonToScene(yaw, pitch, index, interaction) {
    const interactionButtonWrapper = document.createElement('div');

    ReactDOM.render(
      <H5PContext.Provider value={this.context}>
        <NavigationButton
          title={interaction.action.metadata.title}
          buttonClasses={['three-sixty']}
          icon={getIconFromInteraction(interaction)}
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

  removeInteractions() {
    this.scene.removeElements();
  }

  componentDidMount() {
    // Already initialized
    if (this.state.hasInitialized) {
      return;
    }

    this.loadScene();
  }

  componentDidUpdate(prevProps) {
    if (!this.state.hasInitialized) {
      return;
    }

    const hasChangedInteractions = this.props.sceneParams.interactions
      && (this.renderedInteractions
        !== this.props.sceneParams.interactions.length);

    if (hasChangedInteractions) {
      this.removeInteractions();
      this.addInteractionHotspots(this.props.sceneParams.interactions);
      return;
    }

    // Check if active state was transitioned
    if (prevProps.isActive === this.props.isActive) {
      return;
    }

    // TODO:  If the actual scene image has changed make a function for changing
    //        only the scene image

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
