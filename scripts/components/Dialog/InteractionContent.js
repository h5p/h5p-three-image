import React from 'react';
import './InteractionContent.scss';
import {H5PContext} from '../../context/H5PContext';

export default class InteractionContent extends React.Component {
  constructor(props) {
    super(props);

    this.contentRef = React.createRef();
    this.state = {
      isInitialized: false,
    };
  }

  componentDidMount() {
    if (!this.state.isInitialized) {
      this.initializeContent();
    }
  }

  componentDidUpdate() {
    if (!this.state.isInitialized) {
      this.initializeContent();
    }
  }

  initializeContent() {
    // Remove any old content
    while (this.contentRef.current.firstChild) {
      this.contentRef.current.removeChild(this.contentRef.current.firstChild);
    }

    const scene = this.context.params.scenes[this.props.currentScene];
    const interaction = scene.interactions[this.props.currentInteraction];
    const library = interaction.action;

    this.instance = H5P.newRunnable(
      library,
      this.context.contentId,
      H5P.jQuery(this.contentRef.current)
    );

    this.setState({
      isInitialized: true,
    });

  }

  render() {
    return (
      <div ref={this.contentRef} />
    );
  }
}

InteractionContent.contextType = H5PContext;