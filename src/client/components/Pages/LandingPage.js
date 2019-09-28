import React, { Component } from "react";
import QRCode from "qrcode.react";
import styled from "styled-components";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrCode: window.location.host + "/" //+ UUID.v4()
    };
  }

  render() {
    return (
      <Wrapper>
        <QRCode value={this.state.qrCode} />
      </Wrapper>
    );
  }
}

export default LandingPage;
