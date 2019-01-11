import React from 'react';
import NavigationButton from "../Shared/NavigationButton";
import infoButtonIcon from '../../../assets/info.svg';

export default class SceneDescription extends React.Component {
  render() {
    return (
      <NavigationButton
        isStatic={true}
        hasNoPulse={true}
        buttonClasses={['bottom-row']}
        buttonIcon={infoButtonIcon}
        clickHandler={this.props.showTextDialog.bind(this, this.props.text)}
      />
    );
  }
}