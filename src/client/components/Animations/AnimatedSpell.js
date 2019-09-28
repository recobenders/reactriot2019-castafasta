import React, { Component } from "react";
import AnimatedImage from "./AnimatedImage"
import {spells} from "./config";

class AnimatedSpell extends Component {

  render() {
      const {spellType, spellPower } = this.props;
      return (
        <AnimatedImage
            img={spells[spellType][spellPower]}
            width={200}
        />
      );
  }
}

export default AnimatedSpell