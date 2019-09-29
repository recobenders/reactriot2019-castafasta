import React, { Component } from "react";
import { withCookies } from "react-cookie";
import NameForm from "../../Forms/NameForm";
import styled from "styled-components";
import Constants from "../../../../shared/constants";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

class MobilePage extends Component {
  constructor(props) {
    super(props);

    const { cookies } = props;
    this.state = {
      userName: cookies.get("user_name")
    };

    this.props.socket.on(Constants.MSG.WAITING_FOR_GAME, () => {
      this.props.history.push("/mobile/waiting");
    });
  }

  handleFormSubmit(name, type) {
    const { cookies } = this.props;
    cookies.set("user_name", name);
    let singlePlayer = type === "singleplayer";
    this.props.socket.emit(Constants.MSG.NEW_PLAYER, {
      uuid: this.props.match.params.userId,
      name: name,
      singlePlayer: singlePlayer
    });
  }

  render() {
    return (
      <Wrapper>
        Hello, I am your wand!
        <NameForm handleFormSubmit={this.handleFormSubmit.bind(this)} userName={this.state.userName} />
      </Wrapper>
    );
  }
}

export default withCookies(MobilePage);
