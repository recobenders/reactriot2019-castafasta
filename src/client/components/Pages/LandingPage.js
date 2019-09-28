import React, { Component } from "react";
import QRCode from "qrcode.react";
import styled from "styled-components";
import Constants from "../../../shared/constants";

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
      qrCode: window.location.host + "/" + props.userId
    };
  }

  componentDidMount() {
    this.props.socket.emit(Constants.MSG.PREPARE_PLAYER, {
      uuid: this.props.userId
    });
  }

  render() {
    return (
      <Wrapper>
        <QRCode value={this.state.qrCode} />
        <div>{this.props.userId}</div>
      </Wrapper>
    );
  }
}

export default LandingPage;
