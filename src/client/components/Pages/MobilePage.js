import React, { Component } from "react";
import styled from "styled-components";
import Constants from "../../../shared/constants";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

class MobilePage extends Component {
  handleSocketTestClick() {
    this.props.socket.emit(Constants.MSG.NEW_PLAYER, {
      uuid: this.props.match.params.userId,
      nickame: "Test"
    });
  }

  render() {
    return (
      <Wrapper>
        Hello, I am you wand!
        <button onClick={this.handleSocketTestClick.bind(this)}>
          Socket test
        </button>
      </Wrapper>
    );
  }
}

export default MobilePage;
