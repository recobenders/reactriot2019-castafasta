import React, { Component } from "react";
import QRCode from "qrcode.react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
import { Link } from "react-router-dom";
import { Card, Divider } from "antd";
import Title from "antd/lib/typography/Title";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Centered = styled.section`
  display: flex;
  justify-content: center;
`;

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrCode: window.location.protocol + "//" + window.location.host + "/mobile/" + props.userId
    };

    this.props.socket.on(Constants.MSG.WAITING_FOR_GAME, () => {
      this.props.history.push("/waiting");
    });
  }

  componentDidMount() {
    this.props.socket.emit(Constants.MSG.PREPARE_PLAYER, {
      uuid: this.props.userId
    });
  }

  render() {
    return (
      <Wrapper>
        <Card>
          <Centered>
            <Title>Cast-a Fast-a</Title>
          </Centered>
          <div>
            Prepare yourself for some really fast magic duels with a very
            extraordinary twist. All you need to do is to keep this page opened
            and scan QR code on this page with your mobile phone.
          </div>
          <Divider dashed />
          <Centered>
            <QRCode value={this.state.qrCode} />
          </Centered>
          <Centered>
            <Link to={`/mobile/${this.props.userId}`}>{this.props.userId}</Link>
          </Centered>
        </Card>
      </Wrapper>
    );
  }
}

export default LandingPage;
