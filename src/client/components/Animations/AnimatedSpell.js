import React, { Component } from "react";
import styled from "styled-components"
import AnimatedImage from "./AnimatedImage"

class AnimatedSpell extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.update;
    }

    render() {
      const { spell } = this.props;
      return (
        <AnimatedImage
            img={spell}
            width={300}
        />
      );
    }
}

export default AnimatedSpell