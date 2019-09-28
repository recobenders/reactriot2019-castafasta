import React, { Component } from "react";
import styled from "styled-components";
import AnimatedImage from "./AnimatedImage"
import {wizards} from "./config";

const ImageWrapper = styled.div`
    ${({tilt}) => tilt && `
        transform: rotate3d(0, 1, 0, 180deg)
    `}
`;

class AnimatedWizard extends Component {
    render() {
      const {wizardColor, wizardAction, repeat, repeatInterval, tilt } = this.props;
      return (
          <ImageWrapper tilt={tilt}>
              <AnimatedImage
                  img={wizards[wizardColor][wizardAction]}
                  width={300}
                  repeat={repeat}
                  repeatInterval={repeatInterval}
              />
          </ImageWrapper>
      );
  }
}

export default AnimatedWizard
