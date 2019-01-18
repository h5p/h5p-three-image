import React from 'react';
import './StaticScene.scss';

export default class StaticScene extends React.Component {
  render() {
    if (!this.props.isActive) {
      return null;
    }

    // Props:
    // isActive={this.props.isActive}
    // sceneParams={this.props.sceneParams}
    // imageSrc={this.props.imageSrc}
    // navigateToScene={this.props.navigateToScene.bind(this)}
    // showInteraction={this.props.showInteraction.bind(this)}
    console.log("static scene interactions", this.props.sceneParams);

    const interactions = this.props.sceneParams.interactions || [];

    return (
      <div className='image-scene-overlay'>
        <div className='image-scene-wrapper'>
          <img
            className='image-scene'
            src={this.props.imageSrc}
          />
          {
            interactions.map((interaction, index) => {
              const pos = interaction.interactionpos.split(',');
              const x = pos[0];
              const y = pos[1];

              return (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                  }}
                >Nav</div>
              );
            })
          }
        </div>
      </div>
    );
  }
}