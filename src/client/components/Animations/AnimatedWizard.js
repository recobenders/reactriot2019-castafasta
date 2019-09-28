import React, { Component } from "react";
import AnimatedImage from "./AnimatedImage"
import {wizards} from "./config";

class AnimatedWizard extends Component {

  render() {
      const {wizardColor, wizardAction } = this.props;
      return (
        <AnimatedImage
            img={wizards[wizardColor][wizardAction]}
            width={200}
        />
      );
  }
}

export default AnimatedWizard
