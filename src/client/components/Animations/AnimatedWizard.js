import React, { Component } from "react";
import AnimatedImage from "./AnimatedImage"
import {wizards} from "./config";

class AnimatedWizard extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.update || this.props.width;
    }

    render() {
      const {wizardColor, wizardAction, repeat, repeatInterval } = this.props;
      return (
          <AnimatedImage
              img={wizards[wizardColor][wizardAction]}
              width={300}
              repeat={repeat}
              repeatInterval={repeatInterval}
          />
      );
  }
}

export default AnimatedWizard
