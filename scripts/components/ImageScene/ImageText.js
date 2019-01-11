import React from 'react';
import NavigationButton from "../Shared/NavigationButton";
import infoButtonIcon from '../../../assets/info.svg';

export default class ImageText extends React.Component {
  constructor(props) {
    super(props);

    const pos = this.props.textpos.split(',');
    this.x = pos[0];
    this.y = pos[1];
  }

  render() {
    return (
      <NavigationButton
        leftPosition={this.x}
        topPosition={this.y}
        isStatic={true}
        hasNoPulse={true}
        buttonClasses={['bottom-row']}
        buttonIcon={infoButtonIcon}
        clickHandler={this.props.showTextDialog.bind(this, this.props.text)}
      />
    );
  }
}