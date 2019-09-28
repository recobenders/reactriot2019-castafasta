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
    this.props.socket.on(Constants.MSG.GAME_UPDATE, () => {
      console.log('Received game update');
    });
  }


  render() {
    return (
      <Wrapper>
        <AnimatedWizard wizardColor="red" wizardAction="attack "/>
      </Wrapper>
    );
  }
}
