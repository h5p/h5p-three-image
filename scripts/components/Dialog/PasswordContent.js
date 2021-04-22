import React from "react";
import { H5PContext } from "../../context/H5PContext";
import "./PasswordContent.scss";

export default class PasswordContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unlocked: false,
      hasClicked: false,
      shakeClass: "",
      inputPassword: "",
    };
  }
  handleOnChange = (event) => {
    this.setState({
      inputPassword: event.target.value,
    });
  };
  handleOnClick = (event) => {
    event.preventDefault();
    this.setState({
      hasClicked: true,
    });
    if (this.props.currentInteraction.unlocked) {
      this.props.showInteraction(this.props.currentInteractionIndex);
    } else {
      this.setState({
        unlocked: this.props.handlePassword(this.state.inputPassword),
      });
      if (!this.props.currentInteraction.unlocked) {
        this.shakeIcon();
      }
    }
  };

  shakeIcon = () => {
    this.setState({
      shakeClass: "h5p-password-icon--shake",
    });
    setTimeout(() => {
      this.setState({
        shakeClass: "",
      });
    }, 500);
  };
  render() {
    return (
      <div className="h5p-password-content">
        <div
          className={`h5p-password-icon-wrapper ${
            this.state.unlocked
              ? "h5p-password-icon-wrapper--correct-code"
              : !this.state.hasClicked
              ? ""
              : "h5p-password-icon-wrapper--wrong-code"
          }`}
        >
          <span
            className={`h5p-password-icon ${
              this.state.unlocked ? "unlocked" : "locked"
            } ${this.state.shakeClass}`}
          />
        </div>
        <h1>
          {this.state.unlocked
            ? this.context.l10n.unlocked
            : this.context.l10n.locked}
        </h1>

        {
          <span className={"h5p-field-description"}>
            {this.state.unlocked
              ? this.context.l10n.contentUnlocked
              : !this.state.hasClicked
              ? this.context.l10n.searchRoomForCode
              : this.context.l10n.wrongCode}
          </span>
        }
        <form className={"h5p-wrapper"} onSubmit={this.handleSubmit}>
          <label
            className={"h5p-wrapper"}
            htmlFor={"field-code-" + this.props.currentInteractionIndex}
          >
            <span className={"h5p-field-text"}>{this.props.hint}</span>
            <div className={"h5p-wrapper-inner"}>
              <input
                type={"text"}
                className={"h5p-field-input"}
                id={"field-code-" + this.props.currentInteractionIndex}
                placeholder={this.context.l10n.code}
                value={this.state.inputPassword}
                onChange={this.handleOnChange}
              />
            </div>
          </label>
          <button className={"h5p-password-btn"} onClick={this.handleOnClick}>
            {this.state.unlocked
              ? this.context.l10n.unlockedStateAction
              : this.context.l10n.lockedStateAction}
          </button>
        </form>
      </div>
    );
  }
}

PasswordContent.contextType = H5PContext;
