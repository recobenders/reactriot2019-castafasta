import React, { Component } from "react";

class SpellForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: "",
      code: ""
    };

    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleWeightChange(event) {
    this.setState({ weight: event.target.value });
  }

  handleCodeChange(event) {
    this.setState({ code: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleFormSubmit(this.state.code, this.state.weight);
  }

  render() {
    return (
      <form>
        <label>
          Type code:
          <input
            type="text"
            weight={this.state.weight}
            onChange={this.handleWeightChange}
          />
          Type weight:
          <input
            type="text"
            value={this.state.code}
            onChange={this.handleCodeChange}
          />
        </label>
        <input
          onClick={event => this.handleSubmit(event)}
          type="submit"
          value="Cast"
        />
      </form>
    );
  }
}

export default SpellForm;
