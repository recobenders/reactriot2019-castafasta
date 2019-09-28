import React, { Component } from "react";
import styled from "styled-components";

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
      </Wrapper>
    );
  }
}

export default MobilePage;
