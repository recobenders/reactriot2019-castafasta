import React, { Component } from "react";

class SpellForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleFormSubmit(this.state.value);
  }

  render() {
    return (
      <form>
        <label>
          Type spell accuracies:
          <input
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </label>
        <input onClick={event => this.handleSubmit(event)} type="Cast" />
      </form>
    );
  }
}

export default SpellForm;
