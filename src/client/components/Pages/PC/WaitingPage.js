import React, { Component } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
import Title from "antd/lib/typography/Title";
import {Spin} from "antd";
import AnimatedWizard from "../../Animations/AnimatedWizard";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const ImagesWrapper = styled.div`
  margin-left: 150px;
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
    return (
        <Wrapper>
        <ImagesWrapper>
          <AnimatedWizard wizardColor={"red"} wizardAction={"idle"} repeat={true} repeatInterval={2000} update={true}/>
        </ImagesWrapper>
        <Title level={2} style={{marginBottom: "30px"}}>Waiting for Duel oponent</Title>
        <Spin/>
      </Wrapper>
    );
  }
}
