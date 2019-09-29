import React, { Component } from "react";
import AnimatedImage from "./AnimatedImage"

class AnimatedSpell extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.update;
    }

    render() {
      const { spell } = this.props;
          console.log("spell", spell);

      return spell &&
        <AnimatedImage
            img={spell}
            width={300}
        />
    }
}

export default AnimatedSpell