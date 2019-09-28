import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export class ErrorPage extends Component {
  render() {
    return <Wrapper>Error: {this.props.message}</Wrapper>;
  }
}

export default ErrorPage;
