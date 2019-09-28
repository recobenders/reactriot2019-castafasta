import React, { Component } from "react";
import NameForm from "../Forms/NameForm";
import styled from "styled-components";
import Constants from "../../../shared/constants";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

class MobilePage extends Component {
  render() {
    return (
      <Wrapper>
        Hello, I am you wand!
        <NameForm
          userId={this.props.match.params.userId}
          socket={this.props.socket}
        />
      </Wrapper>
    );
  }
}

export default MobilePage;
