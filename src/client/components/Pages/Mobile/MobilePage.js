import React, { Component } from "react";
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

    this.props.socket.on(Constants.MSG.WAITING_FOR_GAME, () => {
      this.props.history.push("/mobile/waiting");
    });
  }

  handleFormSubmit(name, type) {
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
        Hello, I am you wand!
        <NameForm handleFormSubmit={this.handleFormSubmit.bind(this)} />
      </Wrapper>
    );
  }
}

export default MobilePage;
