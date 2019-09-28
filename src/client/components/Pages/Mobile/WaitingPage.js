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
  render() {
    return <Wrapper>Mobile Waiting</Wrapper>;
  }
}
