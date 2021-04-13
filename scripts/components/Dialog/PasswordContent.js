import React from 'react';
import { H5PContext } from "../../context/H5PContext";
import './PasswordContent.scss';

export default class PasswordContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unlocked: false,
      hasClicked: false
    }

  }
  handleOnClick = event => {
    event.preventDefault();
    this.setState({
      hasClicked: true
    })
    console.log(this.props.currentInteractionIndex)
    if(this.props.currentInteraction.unlocked) {
      this.props.showInteraction(this.props.currentInteractionIndex)
    } else {
      this.setState({
        unlocked: this.props.handlePassword(this.input.value)
      })


    }
  };
  render() {
//TODO: replace with l10n translation
    return (
      <div className='h5p-password-content' >
        <div className={"h5p-password-icon-wrapper"}>
          <span className={`h5p-password-icon ${this.state.unlocked ? "h5p-password-icon-unlock":"h5p-password-icon-lock"}` }/>
        </div>
        <h1>{this.state.unlocked ? " Åpnet" : "Låst"}</h1>
        <span className={"h5p-field-description"}>{this.state.unlocked ? " Rommet er nå åpent!" : "Søk i rommet til du finner koden"}</span>
        <label className={"h5p-label-wrapper"} htmlFor={"field-code-" + this.props.currentInteractionIndex}>
          <span className={"h5p-field-text"}>{this.props.hint}</span>
          <input className={"h5p-field-input"} id={"field-code-" + this.props.currentInteractionIndex} placeholder={"Kode"}  ref={(input) => this.input = input}/>
        </label>
        <button className={"h5p-password-btn"} onClick={this.handleOnClick}>{this.state.unlocked ? " Gå videre" : "Lås opp"}</button>
        {
          this.state.hasClicked && !this.state.unlocked ?  <span>Koden var dessverre feil, prøv igjen</span> :""
        }
      </div>
    );
  }
}

PasswordContent.contextType = H5PContext;
