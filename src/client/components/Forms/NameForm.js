import React, { Component } from "react";

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

  handleSubmit(event, type) {
    event.preventDefault();
    this.props.handleFormSubmit(this.state.name, type);
  }

  render() {
    return (
      <form>
        <label>
          Name:
          <input
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </label>
        <input
          onClick={event => this.handleSubmit(event, "multiplayer")}
          type="submit"
          value="Multiplayer"
        />
        <input
          onClick={event => this.handleSubmit(event, "singleplayer")}
          type="submit"
          value="Singleplayer"
        />
      </form>
    );
  }
}

export default NameForm;
