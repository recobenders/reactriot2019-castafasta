import React, { Component } from "react";
import AnimatedImage from "./AnimatedImage"
import {spells} from "./config";

class AnimatedSpell extends Component {

  render() {
      const {spellType, spellPower, direction } = this.props;
      return (
        <AnimatedImage
            img={spells[spellType][spellPower]}
            width={200}
            direction={direction}
        />
      );
  }
}

export default AnimatedSpell