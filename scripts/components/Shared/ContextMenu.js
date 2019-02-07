import React, {Component} from 'react';
import './ContextMenu.scss';
import {H5PContext} from "../../context/H5PContext";

export default class ContextMenu extends Component {

  goToScene() {
    this.context.trigger('goToScene', this.props.interactionIndex);
  }

  handlEdit() {
    this.context.trigger('editInteraction', this.props.interactionIndex);
  }

  handleDelete() {
    this.context.trigger('deleteInteraction', this.props.interactionIndex);
  }

  render() {
    return (
      <div className='context-menu'>
        {
          this.props.isGoToScene &&
          <button
            className='go-to-scene'
            onClick={this.goToScene.bind(this)}
          >
            <div className='tooltip'>Go To Scene</div>
          </button>
        }
        <button
          className='edit'
          onClick={this.handlEdit.bind(this)}
        >
          <div className='tooltip'>Edit</div>
        </button>
        <button
          className='delete'
          onClick={this.handleDelete.bind(this)}
        >
          <div className='tooltip'>Delete</div>
        </button>
      </div>
    );
  }
}

ContextMenu.contextType = H5PContext;