import React, { Component } from "react";
import AnimatedWizard from "../Animations/AnimatedWizard";
import AnimatedSpell from "../Animations/AnimatedSpell";

class Battleground extends Component {
  render() {
    return (
      <div>
        <AnimatedWizard wizardColor="blue" wizardAction="jump" />
        <AnimatedSpell spellType="earth" spellPower="strong" />
      </div>
    );
  }
}

export default Battleground;

