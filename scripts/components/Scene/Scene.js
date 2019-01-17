import React from 'react';
import ReactDOM from 'react-dom';
import NavigationButton from "../Shared/NavigationButton";
import imageButtonIcon from '../../../assets/image.svg';
import navButtonIcon from '../../../assets/navigation.svg';

export default class Scene extends React.Component {
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

      this.setState({
        hasInitialized: true,
      });

      this.props.addScene(this.scene);

      // Add buttons to scene
      this.addNavigationHotspots(this.props.sceneParams.navigationhotspots);
      this.addImageHotspots(this.props.sceneParams.sceneimages);
      this.addInteractionHotspots(this.props.sceneParams.interactions);
    });
    imageElement.src = this.props.imageSrc;
  }

  addNavigationHotspots(hotspots) {
    if (!hotspots) {
      return;
    }

    hotspots.forEach((hotspot) => {
      var pos = hotspot.hotspotpos.split(',');
      var yaw = pos[0];
      var pitch = pos[1];

      this.addNavButtonToScene(yaw, pitch, hotspot.toscene);
    });

  }

  addNavButtonToScene(yaw, pitch, sceneName) {
    const navButtonWrapper = document.createElement('div');
    ReactDOM.render(
      <NavigationButton
        clickHandler={this.props.navigateToScene.bind(this, sceneName)}
        buttonIcon={navButtonIcon}
      />,
      navButtonWrapper
    );

    this.scene.add(
      navButtonWrapper,
      {yaw: yaw, pitch: pitch},
      false
    );
  }

  addImageHotspots(images) {
    if (!images) {
      return;
    }

    images.forEach((image) => {
      var pos = image.imagepos.split(',');
      var yaw = pos[0];
      var pitch = pos[1];
      this.addImageButtonToScene(yaw, pitch, image);
    });
  }

  addImageButtonToScene(yaw, pitch, image) {
    const imageButtonWrapper = document.createElement('div');
    ReactDOM.render(
      <NavigationButton
        clickHandler={this.props.showImage.bind(this, image)}
        buttonIcon={imageButtonIcon}
      />,
      imageButtonWrapper
    );

    this.scene.add(
      imageButtonWrapper,
      {yaw: yaw, pitch: pitch},
      true
    );
  }

  addInteractionHotspots(interactions) {
    if (!interactions) {
      return;
    }

    interactions.forEach((interaction) => {
      const pos = interaction.interactionspos.split(',');
      const yaw = pos[0];
      const pitch = pos[1];
      this.addInteractionButtonToScene(yaw, pitch);
    });
  }

  addInteractionButtonToScene(yaw, pitch) {
    const interactionButtonWrapper = document.createElement('div');
    ReactDOM.render(
      <NavigationButton
        clickHandler={() => {console.log("clicked interaction button")}}
      />,
      interactionButtonWrapper
    );

    this.scene.add(
      interactionButtonWrapper,
      {yaw: yaw, pitch: pitch},
      true
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