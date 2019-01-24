import React from 'react';
import NavigationButton, {Icons} from "../Shared/NavigationButton";

export default class SceneDescription extends React.Component {
  render() {
    return (
      <NavigationButton
        title='Scene description'
        icon={Icons.SCENE_DESCRIPTION}
        buttonClasses={['bottom']}
        clickHandler={this.props.showTextDialog.bind(this, this.props.text)}
      />
    );
  }
}