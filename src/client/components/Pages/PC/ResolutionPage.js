import React, { Component } from "react";
import styled from "styled-components";
import Constants from '../../../../shared/constants'
import AnimatedWizard from "../../Animations/AnimatedWizard";
import { Link } from 'react-router-dom';

const WizardWrapper = styled.div`
${({top, left}) => `
  position: fixed;
  top: ${top}%;
  left: ${left}%;
  transform: translate(-50%, -50%);
  `
}
`;

const TitleWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.h1`
  font-size: 13em;
  transform: rotate(-15deg);
`;

class ResolutionPage extends Component {
  constructor(props) {
    super(props);

    let title = null;
    let redAction = 'init';
    let blueAction = 'init';

    if (props.game.result.type === Constants.RESOLUTION_TYPES.DRAW) {
      title = 'Draw';
    } else if (props.game.result.type === Constants.RESOLUTION_TYPES.VICTORY) {
      if (props.game.result.winner.id === props.currentUserId) {
        title = 'Victory';
      } else {
        title = 'Defeat';
      }

      if (props.game.result.winner.id === props.game.playerOne) {
        redAction = 'jump';
        blueAction = 'dead';
      } else {
        redAction = 'dead';
        blueAction = 'jump';
      }
    }

    this.state = {
      title: title,
      redAction: redAction,
      blueAction: blueAction
    };
  }

  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <WizardWrapper top={25} left={25}>
          <AnimatedWizard wizardColor="red" wizardAction={this.state.redAction} repeat={false} repeatInterval={2000} />
        </WizardWrapper>
        <TitleWrapper>
          <Title>{this.state.title}</Title>
        </TitleWrapper>
        <WizardWrapper top={75} left={75}>
          <AnimatedWizard wizardColor="blue" wizardAction={this.state.blueAction} repeat={false} repeatInterval={2000} tilt />
        </WizardWrapper>
      </div>
    );
  }
}

export default ResolutionPage;
