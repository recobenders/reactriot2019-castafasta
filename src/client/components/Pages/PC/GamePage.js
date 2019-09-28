import React, { Component } from "react";
import styled from "styled-components";
import Constants from "../../../../shared/constants";
import AnimatedWizard from "../../Animations/AnimatedWizard";

const Wrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export class GamePage extends Component {
  componentDidMount() {
    this.props.socket.on(Constants.MSG.GAME_UPDATE, data => {
      console.log(data);
    });
  }

  render() {
    return (
      <Wrapper>
        <AnimatedWizard wizardColor="blue" wizardAction="jump" />
      </Wrapper>
    );
  }
}
