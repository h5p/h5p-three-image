import React from 'react';
import { H5PContext } from "../../context/H5PContext";
import './PasswordContent.scss';

export default class PasswordContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unlocked: false,
      hasClicked: false,
      shakeClass : "",
      showPasswordInput : true
    }
  }

  handleOnClick = event => {
    event.preventDefault();
    this.setState({
      hasClicked: true
    })
    if(this.props.currentInteraction.unlocked) {
      this.props.showInteraction(this.props.currentInteractionIndex)
    } else {
      this.setState({
        unlocked: this.props.handlePassword(this.input.value)
      })
      console.log("unlocked: " +this.state.unlocked)
      if(!this.props.currentInteraction.unlocked){
        this.shakeIcon();

      }
    }
  };
  toggleShowCode = () => {
    console.log("sasa")

  this.setState({
    showPasswordInput : !this.state.showPasswordInput
  })

  }

  shakeIcon = () => {
    this.setState({
      shakeClass : "h5p-password-icon--shake"
    })
    setTimeout((() => {
      this.setState({
        shakeClass : ""
      })
    }), 500)
  };
  render() {
//TODO: replace with l10n translation
    return (
      <div className='h5p-password-content' >
        <div className={`h5p-password-icon-wrapper ${this.state.unlocked ? "h5p-password-icon-wrapper--correct-code" :
          !this.state.hasClicked ? "" : "h5p-password-icon-wrapper--wrong-code"
        }` }>
          <span className={`h5p-password-icon ${this.state.unlocked ? "unlocked" : "locked"}` + ` ${this.state.shakeClass}`}/>
        </div>
        <h1>{this.state.unlocked ? " Åpnet" : "Låst"}</h1>

        {<span className={"h5p-field-description"}>

          {this.state.unlocked ? " Rommet er nå åpent!" :
              !this.state.hasClicked ? "Søk i rommet til du finner koden." : "Koden var dessverre feil, prøv igjen"
          }

         </span>}
        <form className={"h5p-wrapper"} onSubmit={this.handleSubmit}>
          <label className={"h5p-wrapper"} htmlFor={"field-code-" + this.props.currentInteractionIndex}>
            <span className={"h5p-field-text"}>{this.props.hint}</span>
            <input type={this.state.showPasswordInput ? "password" : "text"} className={"h5p-field-input"} id={"field-code-" + this.props.currentInteractionIndex} placeholder={"Kode"}  ref={(input) => this.input = input}/>
            </label>
          <button className={"h5p-password-btn show-btn"} type={"button"} onClick={this.toggleShowCode}>{this.state.showPasswordInput ? "Vis kode" : "Skjul kode"}</button>

          <button className={"h5p-password-btn"} onClick={this.handleOnClick}>{this.state.unlocked ? " Gå videre" : "Lås opp"}</button>
        </form>
      </div>
    );
  }
}

PasswordContent.contextType = H5PContext;
