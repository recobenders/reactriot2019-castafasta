import React, { Component } from "react";
import { Input, Icon, Button, Form } from "antd";

const formStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "90vw"
};

const btnStyle = {
    whiteSpace: "pre-wrap",
    height: "auto",
    padding: "10px",
};

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
      <Form style={formStyle} >
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
          style={{ ...btnStyle, marginBottom: "0.5em" }}
          size="large"
          htmlType="submit"
          icon="smile"
        >
          I'm prepared. Find me a worthy opponent, please.
        </Button>
        <Button
          htmlType="submit"
          icon="meh"
          style={{ ...btnStyle }}
          size="large"
          onClick={event => this.handleSubmit(event, "singleplayer")}
        >
          I'm not sure. Let me practice with a Bot.
        </Button>
      </Form>
    );
  }
}

export default NameForm;
