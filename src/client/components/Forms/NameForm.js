import React, { Component } from "react";
import styled from "styled-components";
import Constants from "../../../shared/constants";

class NameForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.socket.emit(Constants.MSG.NEW_PLAYER, {
      uuid: this.props.userId,
      name: this.state.name
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default NameForm;
