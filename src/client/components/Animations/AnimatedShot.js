import React, { Component } from "react";
import AnimatedImage from "./AnimatedImage"
import {shots} from "./config";

class AnimatedShot extends Component {

  render() {
      const { shotType } = this.props;
      return (
        <AnimatedImage
            img={shots[shotType]}
            width={100}
        />
      );
  }
}

export default AnimatedShot
