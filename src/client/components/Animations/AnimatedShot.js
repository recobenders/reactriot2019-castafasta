import React, { Component } from "react";
import AnimatedImage from "./AnimatedImage"
import {shots} from "./config";

class AnimatedShot extends Component {

  render() {
      const { shotType, direction } = this.props;
      return (
        <AnimatedImage
            img={shots[shotType]}
            width={100}
            direction={direction}
        />
      );
  }
}

export default AnimatedShot
