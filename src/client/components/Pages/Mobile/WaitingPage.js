import React, { Component } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export class WaitingPage extends Component {
  constructor(props) {
    super(props);

    this.props.socket.on(Constants.MSG.GAME_JOINED, () => {
      console.log('Joining game');
      this.props.history.push("/game/controller");
    });
  }

  render() {
    return <Wrapper>Mobile Waiting</Wrapper>;
  }
}
