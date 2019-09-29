import React, { Component } from "react";
import { Input, Icon, Button, Form } from "antd";

class NameForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.userName
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
      <Form>
        <Form.Item>
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="What's your name?"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </Form.Item>

        <Button
          onClick={event => this.handleSubmit(event, "multiplayer")}
          type="primary"
          style={{ marginBottom: "0.5em" }}
          size="large"
          htmlType="submit"
          icon="smile"
        >
          I'm prepared, please find me some other player
        </Button>
        <Button
          htmlType="submit"
          icon="meh"
          size="large"
          onClick={event => this.handleSubmit(event, "singleplayer")}
        >
          I'm not sure, give me Bot player to practice
        </Button>
      </Form>
    );
  }
}

export default NameForm;
