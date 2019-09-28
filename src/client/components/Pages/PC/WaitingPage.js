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

    this.props.socket.on(Constants.MSG.PLAYER_LEFT_QUEUE, () => {
      console.log('Player left the queue');
      // TODO: display some message explaining what happened
      this.props.history.push("/");
    });

    this.props.socket.on(Constants.MSG.GAME_JOINED, () => {
      console.log('Joining game');
      this.props.history.push("/game");
    });
  }

  render() {
    return <Wrapper>PC Waiting</Wrapper>;
  }
}
