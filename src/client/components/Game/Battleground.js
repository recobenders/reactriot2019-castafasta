import React, { Component } from "react";
import AnimatedWizard from "../Animations/AnimatedWizard";
import AnimatedSpell from "../Animations/AnimatedSpell";
import AnimatedShot from "../Animations/AnimatedShot";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  margin: 15px;
`;

class Battleground extends Component {
  render() {
    return (
      <Row>
        <Column>
          <AnimatedWizard wizardColor="blue" wizardAction="jump" direction="right" />
          <AnimatedSpell spellType="earth" spellPower="strong" direction="right" />
          <AnimatedShot shotType="earth" direction="right" />
        </Column>
        <Column>
          <AnimatedWizard wizardColor="red" wizardAction="idle" direction="left" />
          <AnimatedSpell spellType="ice" spellPower="medium" direction="left" />
          <AnimatedShot shotType="ice" direction="left" />
        </Column>
      </Row>
    );
  }
}

export default Battleground;

